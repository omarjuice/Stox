import { Router } from 'express';
import { User } from '../data'
const router = Router();





router.post('/register', async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const newUser: UserSchema.Create = { firstName, lastName, email, password }
        const user: User = await User.create(newUser);
        req.session.user = user.id
        res.status(201).send(user)
    } catch (e) {
        next(e)
    }
})
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user: User = await User.authenticate(email, password)
        req.session.user = user.id
        req.session.save(() => { res.status(200).send(user); })

    } catch (e) {
        next(e)
    }
})

router.get('/me', async (req, res, next) => {
    try {
        const { user: id } = req.session;
        if (id) {
            const user = await User.findById(id)
            res.send(user)
        } else {
            res.send(null)
        }
    } catch (e) {
        next(e)
    }
})
router.post('/logout', async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) reject(err)
                resolve()
            })
        })
        res.sendStatus(204)
    } catch (e) {
        next(e)
    }
})
export default router
