const mongoose = require(`mongoose`)
require(`dotenv`).config({ path: `../.env` });
const { DB_URI } = process.env;
const Schema = mongoose.Schema

function portConnect(port) {
  if(!DB_URI) return connURI(`mongodb://localhost:${port}/information`);
  else return connURI(DB_URI)
}
  
  // iife
//const authObj = (({DB_AUTHSOURCE, DB_USER, DB_PASS }) => ({authSource: DB_AUTHSOURCE, user: DB_USER, password: DB_PASS}))(process.env);

function connURI(uri) {
return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    /*...authObj,*/
});
}

portConnect(27017);

const db = mongoose.connection;
  

let thankedLog = mongoose.model('thankedLog', new Schema({}, { strict: false }))
let userInfoPublic = mongoose.model('userInfo', new Schema({}, { strict: false }))

db.on(`error`, console.error.bind(console, `connection error:`));
db.once(`open`, function () {
  console.log(`connected to database...`);
});

class Db {
    constructor(client) {
      this.client = client;
    }

    getUser = async function getuserInfo(id) {
      const q = await userInfoPublic.findOne({ server: `493173110799859713`, user_id: id }).lean();
      const q2 = await thankedLog.findOne({ server: `493173110799859713`, user_id: id }).lean();
      if(!q) return false
      if(!q2) return false
      let newObj = q2
      newObj.stats = q.stats
      return newObj
    };
    
  }
  
module.exports =  Db;

