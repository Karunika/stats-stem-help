const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Db = require('./db')
const db = new Db()
const cors = require('cors')
const yargs = require('yargs')

const argv = yargs
    // accept port number as argument
    .option('port', {
        alias: 'p',
        default: 3000,
        describe: 'Port number',
        type: 'number'
    }).argv

console.log(argv)

const apiPort = argv.port

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