const express = require('express')
const mongoose = require('mongoose')
const { mongoUri } = require('./config')
const cors = require('cors')
const eventsRouter = require('./routes/eventsRouter')

const app = express() // start express app
app.use(express.json()) // body parser middleware
app.use(cors()) // enable cors for all routes

async function connectMongoDB() {
	mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
	const db = mongoose.connection
	db.once('open', () => console.log('Connected to MongoDB'))
	db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}

app.use('/api', eventsRouter)

// connect to MongoDB
connectMongoDB().then(() => {
	app.listen((port = 3000), () => {
		console.log(`Server is running on port ${port}`)
	})
})
