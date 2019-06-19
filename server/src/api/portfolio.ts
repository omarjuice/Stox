import { Router } from 'express';
import { PortfolioStock } from '../data'

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const id = req.session.user
        const portfolio = await PortfolioStock.findAll(id)
        res.send(portfolio)
    } catch (e) {
        next(e)
    }
})

export default router