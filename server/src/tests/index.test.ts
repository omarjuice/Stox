import expect from 'expect';
import request from 'supertest';
import app from '../'
import db, { dropTables, createTables } from '../data/'
import { User } from '../data/'
import seed, { seedUser } from './seed'

let agent: request.SuperTest<any> = request.agent(app);

beforeEach(async () => {
    await dropTables()
    await createTables()
    await seed()
    agent = request.agent(app)
})


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
})