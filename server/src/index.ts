import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import db from './db'
const env = process.env
const PORT = process.env.PORT || 3001;

const app = express();



if (env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
    app.use(cors({
        origin: 'http://localhost:3000'
    }))
}


app.get('/api', (req, res) => {
    res.send('OK')
})


db.connect()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`)
        })
    }).catch(e => {
        console.log(e)
    })

export default app