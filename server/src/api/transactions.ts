import { Router } from 'express';
import { User, PortfolioStock, Transaction } from '../data'
import axios from 'axios'
import ApiError from '../utils/error';
const env = process.env.NODE_ENV

const iex = axios.create({
    baseURL: `https://api.iextrading.com/1.0/tops/`
})

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
        if (env !== 'test') {
            const { data } = await iex.get(`last?symbols=${body.symbol}`)
            if (data[0] && data[0].price) {
                newTransaction.price = data[0].price
            } else {
                throw new ApiError(`Could not find data for ${body.symbol}`, 404)
            }
        }
        if (body.quantity < 1) throw new ApiError(`Quantity must be at least 1, got ${body.quantity}`, 400)
        if (user.balance < newTransaction.quantity * newTransaction.price) {
            newTransaction.quantity = Math.floor(user.balance / newTransaction.price)
            stock.quantity = newTransaction.quantity
        }
        if (stock.quantity === 0) {
            throw new ApiError(`Insufficient funds: Current balance ${user.balance}`, 400)
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
        if (env !== 'test') {
            const { data } = await iex.get(`last?symbols=${body.symbol}`)
            if (data[0] && data[0].price) {
                newTransaction.price = data[0].price
            } else {
                throw new ApiError(`Could not find data for ${body.symbol}`, 404)
            }
        }
        if (body.quantity < 1) throw new ApiError(`Quantity must be at least 1, got ${body.quantity}`, 400)
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