/// <reference path="../data/schema.d.ts" />
/// <reference path="../../../types.d.ts" />


import expect from 'expect';
import request from 'supertest';
import app from '../'
import db, { dropTables, createTables } from '../data/'
import { User, PortfolioStock, Transaction } from '../data/'
import seed, { seedUser } from './seed'

let agent: request.SuperTest<any> = request.agent(app);
let user: User;
beforeEach(async () => {
    await dropTables()
    await createTables()
    user = await seed()
    agent = request.agent(app)
})
const login = async () => {
    await agent.post('/api/auth/login').send({
        email: seedUser.email,
        password: seedUser.password
    })
}


describe('API', () => {
    it('Should return 200', done => {
        request(app)
            .get('/api')
            .expect(200)
            .end(done)
    })
    it('DB should not throw errors', async () => {
        const { rows: [result] } = await db.query('SELECT NOW()');
        expect(result.now instanceof Date).toBe(true)
    })

    describe('AUTH', () => {
        const newUser: UserSchema.Create = {
            firstName: 'Ben',
            lastName: 'Jamin',
            password: 'cool',
            email: 'ben@email.com'
        }
        it('/register should create a new user', done => {

            request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(({ body }) => {
                    for (const key in newUser) {
                        if (key === 'password') continue;
                        expect(body[key])
                            .toEqual(newUser[key])
                    }
                    expect(typeof body.id).toBe('number')
                })
                .end(done)

        })
        it('Should persist a new user', async () => {
            const { body: createdUser } = await agent
                .post('/api/auth/register')
                .send(newUser)

            const res = await agent.get('/api/auth//me')
            const user: User = res.body
            expect(user).toBeTruthy()
            for (const key in user) {
                expect(createdUser[key]).toStrictEqual(user[key])
            }

        })
        it('/login should authenticate and persist a user', async () => {
            const { body } = await agent.post('/api/auth/login').send({
                email: seedUser.email,
                password: seedUser.password
            })
            expect(body.error).toBeFalsy()
            for (const key in body) {
                if (key === 'id') {
                    expect(typeof body[key]).toBe('number')
                } else if (key === 'password') {
                    continue;
                } else if (key === 'createdAt') {
                    continue
                } else {
                    expect(body[key]).toEqual(seedUser[key])
                }
            }
            const res = await agent.get('/api/auth//me')
            const user: User = res.body
            expect(user).toBeTruthy()
            for (const key in user) {
                expect(body[key]).toStrictEqual(user[key])
            }
        })
        it('logout should remove a user session', async () => {
            await agent.post('/api/auth/login').send({
                email: seedUser.email,
                password: seedUser.password
            })
            const { status } = await agent.post('/api/auth/logout').send({})
            expect(status).toBe(201)

            const { body } = await agent.get('/api/auth//me')
            expect(body.id).toBeFalsy()

        })
    })
    describe('/portfolio', () => {

        it('Should not work if the user is not authenticated', done => {
            agent.get('/api/portfolio')
                .expect(401)
                .end(done)
        })
        it('Returns the users portfolio', async () => {
            const stock1: PortfolioStockSchema.Create = {
                userId: 1,
                symbol: 'GO',
                quantity: 5
            }
            const stock2: PortfolioStockSchema.Create = {
                userId: 1,
                symbol: 'D',
                quantity: 10
            }
            await PortfolioStock.add(stock1)
            await PortfolioStock.add(stock2)
            await login()
            const { body } = await agent.get('/api/portfolio')
            expect(body.length).toBe(2)
            body.forEach((item: PortfolioStockSchema.DB) => {
                expect(item.userId).toBe(user.id)
            })

        })
    })
    describe.only('/transactions', () => {
        it('Should not work if the user is not authenticated', done => {
            agent.get('/api/transactions/history')
                .expect(401)
                .end(done)
        })
        const stock1: PortfolioStockSchema.Create = {
            userId: 1,
            symbol: 'GO',
            quantity: 5
        }
        const stock2: PortfolioStockSchema.Create = {
            userId: 1,
            symbol: 'D',
            quantity: 10
        }
        const transaction1: TransactionSchema.Create = {
            ...stock1,
            price: 800,
            type: 'BUY'
        }
        const transaction2: TransactionSchema.Create = {
            ...stock2,
            price: 100,
            type: 'BUY'
        }
        describe('Buying shares', () => {

            it('user purchase updates balance and user portfolio', async () => {
                await login()
                {
                    const res = await agent.post('/api/transactions/buy').send(transaction1)
                    const response: TransactionResponse = res.body
                    expect(response.portfolio.quantity).toBe(stock1.quantity)
                    expect(response.portfolio.symbol).toBe(stock1.symbol)
                    expect(response.balance).toBe(1000)
                    expect(response.transaction.type).toBe(transaction1.type)
                }
                {
                    const res = await agent.post('/api/transactions/buy').send(transaction2)
                    const response: TransactionResponse = res.body
                    expect(response.portfolio.quantity).toBe(stock2.quantity)
                    expect(response.portfolio.symbol).toBe(stock2.symbol)
                    expect(response.balance).toBe(0)
                    expect(response.transaction.type).toBe(transaction2.type)
                }
                {
                    const res = await agent.post('/api/transactions/buy').send(transaction1)
                    expect(res.error).toBeTruthy()
                    expect(res.status).toBeTruthy()
                }
                {
                    const res = await agent.get('/api/transactions/history')
                    const response: Transaction[] = res.body
                    expect(response.length).toBe(2)
                }
                {
                    const res = await agent.get('/api/portfolio')
                    const response: PortfolioStock[] = res.body
                    expect(response.length).toBe(2)
                }
            })

        })
        describe('Full Flow', () => {
            it('user sales updates balance and portfolio, user cannot sell what they dont have', async () => {
                await login()
                await agent.post('/api/transactions/buy').send(transaction1)
                await agent.post('/api/transactions/buy').send(transaction2)
                {
                    const sale1: TransactionSchema.Create = { ...transaction1, type: "SELL", quantity: transaction1.quantity - 3, price: 900 }
                    const res = await agent.post('/api/transactions/sell').send(sale1)
                    const response: TransactionResponse = res.body
                    expect(response.portfolio.quantity).toBe(stock1.quantity - sale1.quantity)
                    expect(response.portfolio.symbol).toBe(sale1.symbol)
                    expect(response.balance).toBe(1800)
                    expect(response.transaction.type).toBe(sale1.type)
                }
                {
                    const sale1: TransactionSchema.Create = { ...transaction1, type: "SELL", quantity: 3, price: 600 }
                    const res = await agent.post('/api/transactions/sell').send(sale1)
                    const response: TransactionResponse = res.body
                    expect(response.portfolio.quantity).toBe(0)
                    expect(response.portfolio.symbol).toBe(sale1.symbol)
                    expect(response.balance).toBe(3600)
                    expect(response.transaction.type).toBe(sale1.type)
                }
                {
                    const res = await agent.get('/api/portfolio')
                    const portfolio: PortfolioStock[] = res.body;
                    expect(portfolio.length).toBe(1)
                }
                {
                    const sale1: TransactionSchema.Create = { ...transaction1, type: "SELL", quantity: 3, price: 600 }
                    const res = await agent.post('/api/transactions/sell').send(sale1)
                    expect(res.error).toBeTruthy
                    expect(res.status).toBe(400)
                }
                {
                    const sale2: TransactionSchema.Create = { ...transaction2, type: "SELL", quantity: 100, price: 500 }
                    const res = await agent.post('/api/transactions/sell').send(sale2)
                    const response: TransactionResponse = res.body
                    expect(response.portfolio.quantity).toBe(0)
                    expect(response.portfolio.symbol).toBe(sale2.symbol)
                    expect(response.balance).toBe(8600)
                    expect(response.transaction.type).toBe(sale2.type)
                    expect(response.transaction.quantity).toBe(10)

                }
                {
                    const res = await agent.get('/api/portfolio')
                    const portfolio: PortfolioStock[] = res.body;
                    expect(portfolio.length).toBe(0)
                }
                {
                    const res = await agent.get('/api/transactions/history')
                    const response: Transaction[] = res.body
                    console.log(response)
                    expect(response.length).toBe(5)
                }
            })
        })
    })

})