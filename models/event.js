const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
	id: { type: String, required: true },
	title: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	notes: { type: String },
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
