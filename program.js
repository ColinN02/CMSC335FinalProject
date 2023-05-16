const { argv } = require('process')
const PORT = argv[2]
const express = require('express')
const path = require('path')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.set("views", path.resolve(__dirname, "templates"));
app.set('view engine', '.ejs')
app.listen(PORT, () => {
	console.log(`Web server started and running at http://localhost:${PORT}`)
	process.stdout.write('Stop to shutdown the server: ')
})

const username = process.env.MONGO_DB_USERNAME
const password = process.env.MONGO_DB_PASSWORD
const dbName = process.env.MONGO_DB_NAME
const collectionName = process.env.MONGO_COLLECTION
const databaseAndCollection = {
	db: dbName,
	collection: collectionName,
}
let dataInput = ''
process.stdin.on('readable', () => {
	data = process.stdin.read()
	if (dataInput !== null) {
		let command = data.toString().trim()
		if (command === 'stop') {
			console.log('Shutting down server')
			process.exit(0)
		}
	}
	process.stdout.resume()
})

const uri = `mongodb+srv://${username}:${password}@cluster0.3t8byfo.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
app.get('/', (request, response) => {
	response.render('index.ejs')
})

app.get('/apply', (request, response) => {
	response.render('apply')
})
app.post('/processApplication', async (request, response) => {

	const { username, email, info, phoneNumber, squatMax, benchMax, deadliftMax, vertical, horizontal, shoulder } = request.body
	const formattedUsername = username
	const formattedEmail = email
	const formattedInfo = info
	const formattedNumber = phoneNumber
	const formattedSquat = squatMax
	const formattedBench = benchMax
	const formattedDeadlift = deadliftMax
	const formattedVerticalPull = vertical
	const formattedHorizontalPull = horizontal
	const formattedShoulderPress = shoulder

	try {
		await client.connect()
		const applicantsCollection = client
			.db(databaseAndCollection.db)
			.collection(databaseAndCollection.collection)
		await applicantsCollection.insertOne({
			username: formattedUsername,
			email: formattedEmail,
			info: formattedInfo,
			phoneNumber: formattedNumber,
			squatMax: formattedSquat,
			benchMax: formattedBench,
			deadliftMax: formattedDeadlift,
			vertical: formattedVerticalPull,
			horizontal: formattedHorizontalPull,
			shoulder: formattedShoulderPress
		})
		await client.close()

		return response.render('processApplication', {
			username: formattedUsername,
			email: formattedEmail,
			info: formattedInfo,
			phoneNumber: formattedNumber,
			squatMax: formattedSquat,
			benchMax: formattedBench,
			deadliftMax: formattedDeadlift,
			vertical: formattedVerticalPull,
			horizontal: formattedHorizontalPull,
			shoulder: formattedShoulderPress
		})
	} catch (error) {
		console.error(error)
	}
})