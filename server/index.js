const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const apiPort = 3000
const Db = require('./db')
const db = new Db()
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Looks like you are not on the right page')
})

app.use('/api', async (req, res)=>{
   let answer = await db.getUser(req.originalUrl.split(`/`)[2])
   res.send(answer)
   return answer
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))