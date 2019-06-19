import { Router } from 'express'
import auth from './auth'
import transactions from './transactions'
import portfolio from './portfolio'
import ApiError from '../utils/error';
const router = Router()

const authenticate = (req: Express.Request, _: Express.Response, next: any) => {
    if (!req.session.user) {
        next(new ApiError(`You must be authenticated to do that`, 401))
    } else {
        next()
    }
}

router.use('/auth', auth)
router.use('/transactions', authenticate, transactions)
router.use('/portfolio', authenticate, portfolio)
router.get('/', (req, res) => {
    res.send('hello')
})


export default router