import { Router } from 'express';
import { User, PortfolioStock, Transaction } from '../data'
import ApiError from '../utils/error';

const router = Router();

router.post('/buy', async (req, res, next) => {
    try {
        const user: User = await User.findById(req.session.user)
        const { body } = req
        const stock = {
            userId: user.id,
            symbol: body.symbol,
            quantity: body.quantity,
        }
        const newTransaction: TransactionSchema.Create = {
            ...stock,
            price: body.price,
            type: 'BUY'
        }
        if (user.balance < newTransaction.quantity * newTransaction.price) {
            newTransaction.quantity = Math.floor(user.balance / newTransaction.price)
            stock.quantity = newTransaction.quantity
        }
        if (stock.quantity === 0) {
            throw new ApiError(`Insufficient funds`, 400)
        }
        const transaction = await Transaction.create(newTransaction)
        const balance = await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
        const portfolio = await PortfolioStock.add(stock)
        res.send({ portfolio, balance, transaction })
    } catch (e) {
        next(e)
    }
})

router.post('/sell', async (req, res, next) => {
    try {
        const { body } = req

        const user: User = await User.findById(req.session.user)
        const stock = {
            userId: user.id,
            symbol: body.symbol,
            quantity: body.quantity,
        }
        const newTransaction: TransactionSchema.Create = {
            ...stock,
            price: body.price,
            type: 'SELL'
        }
        const portfolio: PortfolioStock = await PortfolioStock.find(user.id, stock.symbol)
        if (!portfolio) {
            throw new ApiError('No shares of that stock found in your portfolio', 400)
        }
        const { quantity: originalQuantity } = portfolio
        await portfolio.sell(newTransaction.quantity)
        newTransaction.quantity = originalQuantity - portfolio.quantity
        const transaction = await Transaction.create(newTransaction)
        const balance = await user.updateBalance(transaction.price * transaction.quantity, transaction.type)
        if (portfolio.quantity === 0) {
            portfolio.destroy()
        }
        res.send({ portfolio, transaction, balance })
    } catch (e) {
        next(e)
    }
})

router.get('/history', async (req, res, next) => {
    try {
        const transactions = await Transaction.findByUserId(req.session.user)
        res.send(transactions)
    } catch (e) {
        next(e)
    }
})

export default router