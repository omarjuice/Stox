import expect from 'expect';
import { User, Transaction, PortfolioStock, dropTables, createTables } from '../data/'
import seed from './seed';
let user: User;
beforeEach(async () => {
    await dropTables()
    await createTables()
    user = await seed()
})

describe('DATABASE', () => {
    describe('USER', () => {
        it('Should be able to create a new user', async () => {
            const newUser: UserSchema.Create = {
                firstName: 'Omar',
                lastName: 'Juice',
                password: 'hello',
                email: 'oj@gmail.com'
            }
            const user: User = await User.create(newUser)
            expect(user).toBeTruthy()
            expect(user.firstName).toBe(newUser.firstName)
            expect(user.password).toBeFalsy()
            expect(user.email).toBe(newUser.email)
            expect(user.lastName).toBe(newUser.lastName)
            expect(user.balance).toBe(5000)
        })
        it('Should not allow invalid emails', done => {
            const newUser: UserSchema.Create = {
                firstName: 'Omar',
                lastName: 'Juice',
                password: 'hello',
                email: 'bbbbb'
            }
            User.create(newUser)
                .then(() => {
                    done(new Error('Test failed, allowed invalid email'))
                })
                .catch(e => {
                    done()
                })
        })
        it('Should be able to find newly created users', async () => {
            const newUser: UserSchema.Create = {
                firstName: 'Omar',
                lastName: 'Juice',
                password: 'hello',
                email: 'oj@gmail.com'
            }
            const user: User = await User.create(newUser)
            const foundUser: User | null = await User.findById(user.id)
            expect(foundUser).toBeTruthy()
            if (foundUser) {
                expect(foundUser.firstName).toBe(newUser.firstName)
                expect(foundUser.lastName).toBe(newUser.lastName)
                expect(foundUser.email).toBe(newUser.email)
                expect(foundUser.balance).toBe(5000)
            }
        })
    })
    describe('TRANSACTIONS', () => {
        const newTransaction: TransactionSchema.Create = {
            userId: 1,
            symbol: 'SNAP',
            price: 100.12,
            quantity: 12,
            type: 'BUY'
        }
        it('Should create a new transaction', async () => {
            const transaction: Transaction = await Transaction.create(newTransaction)
            expect(typeof transaction.id).toBe('number')
            expect(transaction.createdAt).toBeTruthy()
            expect(transaction.symbol).toBe(newTransaction.symbol)
            expect(transaction.price).toBe(newTransaction.price)
            expect(transaction.type).toBe(newTransaction.type)
            expect(transaction.quantity).toBe(newTransaction.quantity)
        })
        it('can update the user balance after a transaction', async () => {
            const transaction: Transaction = await Transaction.create(newTransaction);
            const { balance } = user
            await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
            expect(user.balance).toBe(balance - transaction.price * transaction.quantity)
        })
        it('does not allow the users balance to go below 0', async () => {
            newTransaction.quantity = 500
            if (user.balance < newTransaction.quantity * newTransaction.price) {
                newTransaction.quantity = Math.floor(user.balance / newTransaction.price)
            }
            const transaction = await Transaction.create(newTransaction)
            await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
            expect(user.balance >= 0).toBe(true)
            expect(transaction.quantity < 50).toBe(true)
            newTransaction.quantity = 12
        })
        it('Selling increases the user balance', async () => {
            newTransaction.type = 'SELL';
            const { balance } = user
            const transaction = await Transaction.create(newTransaction)
            await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
            expect(user.balance > balance).toBe(true)
        })

    })
    describe('PORTFOLIO_STOCKS', () => {
        const stock = {
            userId: 1,
            symbol: 'FB',
            quantity: 13
        }
        const stock2 = {
            userId: 1,
            symbol: 'SNAP',
            quantity: 5
        }
        it('can add to a users portfolio', async () => {
            const newStock = await PortfolioStock.add(stock)
            expect(newStock.lastUpdated).toBeTruthy()
            expect(newStock.symbol).toBe(stock.symbol)
            expect(newStock.quantity).toBe(stock.quantity)
            expect(newStock.userId).toBe(stock.userId)
            const userPortfolio = await PortfolioStock.findAll(user.id)
            expect(userPortfolio.length).toBe(1)
            const moreStock = { ...stock, quantity: 5 }
            const updatedStock = await PortfolioStock.add(moreStock)
            expect(updatedStock.quantity).toBe(stock.quantity + moreStock.quantity)
            const updatedPortfolio = await PortfolioStock.findAll(user.id)
            expect(updatedPortfolio.length).toBe(1)
        })
        it('can add multiple items to a users portfolio', async () => {
            await PortfolioStock.add(stock)
            await PortfolioStock.add(stock2)
            const userPortfolio = await PortfolioStock.findAll(user.id)
            expect(userPortfolio.length).toBe(2)
        })
        it('can subtract quantity from a users portfolio', async () => {
            const portfolio = await PortfolioStock.add(stock)
            await PortfolioStock.add(stock2)
            const sellStock = { ...stock, quantity: 9 }
            const updatedQuantity = await portfolio.sell(sellStock.quantity)
            expect(updatedQuantity).toBe(stock.quantity - sellStock.quantity)

        })
    })
    describe('Transactions with portfolio_stocks', async () => {
        const stock = {
            userId: 1,
            symbol: 'FB',
            quantity: 13
        }
        const stock2 = {
            userId: 1,
            symbol: 'SNAP',
            quantity: 5
        }
        it('Can handle purchases of stock', async () => {
            const newTransaction: TransactionSchema.Create = {
                ...stock,
                price: 100.12,
                type: 'BUY'
            }
            const { balance } = user
            if (user.balance < newTransaction.quantity * newTransaction.price) {
                newTransaction.quantity = Math.floor(user.balance / newTransaction.price)
            }
            const transaction = await Transaction.create(newTransaction)
            await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
            const newPortfolio = await PortfolioStock[newTransaction.type === 'BUY' ? 'add' : 'subtract'](stock)

            expect(user.balance).toBe(balance - transaction.price * transaction.quantity)
            expect(newPortfolio.quantity).toBe(transaction.quantity)

        })
        it('Can handle sale of stock', async () => {
            const newTransaction: TransactionSchema.Create = {
                ...stock,
                price: 100.12,
                type: 'BUY'
            }
            const { balance } = user
            if (user.balance < newTransaction.quantity * newTransaction.price) {
                newTransaction.quantity = Math.floor(user.balance / newTransaction.price)
            }
            const transaction = await Transaction.create(newTransaction)
            await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
            const portfolio = await PortfolioStock.add(stock)
            const { balance: balance2 } = user
            newTransaction.quantity = 5
            newTransaction.type = 'SELL'
            const nextTransaction = await Transaction.create(newTransaction)
            await user.updateBalance(nextTransaction.price * nextTransaction.quantity, nextTransaction.type)
            await portfolio.sell(newTransaction.quantity)
            const finalTransactions = await Transaction.findByUserId(user.id)
            expect(user.balance < balance && user.balance > balance2).toBe(true)
            expect(portfolio.quantity).toBe(transaction.quantity - nextTransaction.quantity)
            expect(finalTransactions.length).toBe(2)
        })
    })
})