const express = require('express')
const mongoose = require('mongoose')
const { mongoUri } = require('./config')
const eventsRouter = require('./routes/eventsRouter')

const app = express() // start express app
app.use(express.json()) // body parser middleware
connectMongoDB() // connect to MongoDB

async function connectMongoDB() {
	mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
	const db = mongoose.connection
	db.once('open', () => console.log('Connected to MongoDB'))
	db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}

app.use('/api', eventsRouter);

app.listen((port = 3000), () => {
	console.log(`Server is running on port ${port}`)
})
