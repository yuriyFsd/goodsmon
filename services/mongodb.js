import { MongoClient } from 'mongodb'
import 'dotenv/config'

// const url = 'mongodb://localhost:27017'

const pass = process.env.APP_DB_PASSWORD
const user = process.env.APP_DB_USER
const host = process.env.APP_DB_HOST
const dbName = process.env.APP_DB_NAME
const dbProject = process.env.APP_DB_PROJECT 
const url = `mongodb+srv://${user}:${pass}@${host}/${dbProject}?retryWrites=true&w=majority&appName=Cluster0`
const mongoClient = new MongoClient(url)

async function connect() {
  try {
    await mongoClient.connect()
    console.log('connected successfully')
    const mdb = mongoClient.db(dbName)
    const collection = mdb.collection('documents')
    const res = await collection.countDocuments()
    console.log({collection: res})
  } catch (error) {
    console.log(error.message)
  }
}

export default mongoClient
