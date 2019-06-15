import express from 'express'
const PORT = process.env.PORT || 3000;

const app = express();


app.get('/', (req, res) => {
    res.send('OK')
})


app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
})

export default app