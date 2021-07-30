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
// do not use cors on production (delt on nginx side)
if (process.env.NODE_ENV !== 'production')
    app.use(cors())
app.use(bodyParser.json())

app.get('/:userId', async (req, res)=>{
   let answer = await db.getUser(req.params.userId)
   res.send(answer)
   return answer
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))