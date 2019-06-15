import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
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


app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
})

export default app