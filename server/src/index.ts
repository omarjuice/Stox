import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import session from 'express-session'
import db, { createTables } from './data/index';
import api from './api'
import ApiError from './utils/error';
import seed from './tests/seed';
const env = process.env
const PORT = process.env.PORT || 3001;

const app = express();

const productionEnv = env.NODE_ENV === 'production'
const developmentEnv = env.NODE_ENV === 'development'
const testEnv = env.NODE_ENV === 'test'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (developmentEnv || testEnv) {
    app.use(morgan("dev"))
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
} else if (env.NODE_ENV === 'production') {

}

app.use(session({
    name: 'ttpfs-session',
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: productionEnv,
        maxAge: !testEnv ? 1000 * 60 * 60 * 24 * 30 : 60000
    }
}))



app.use('/api', api)


app.use((error: ApiError, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).send(error.message)
})


db.connect()
    .then(async () => {
        await createTables()
        // if (developmentEnv) await seed()
        app.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`)
        })
    }).catch(e => {
        console.log(e)
    })

export default app