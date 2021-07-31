const express = require('express')
const bodyParser = require('body-parser')
const Db = require('./db')
const db = new Db()
const cors = require('cors')
const yargs = require('yargs')

const expressApp = express();
const apiRouter = express.Router();

require('dotenv').config()

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

expressApp.use(bodyParser.urlencoded({ extended: true }))
// do not use cors on production (delt on nginx side)
if (process.env.NODE_ENV !== 'production')
    expressApp.use(cors())

expressApp.use(bodyParser.json())

apiRouter.get('/:userId', async (req, res)=>{
   let answer = await db.getUser(req.params.userId)
   res.send(answer)
   return answer
})

if (process.env.API) {
    expressApp.use(process.env.API, apiRouter)
    console.log(`API listening on '${process.env.API}'`)
} else {
    expressApp.use('/', apiRouter)
    console.log(`API listening on '/' ROOT`)
}

expressApp.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))