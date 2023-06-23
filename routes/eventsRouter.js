const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const { randomUUID } = require('crypto')

// Get all events that start from a particular date
router.get('/:date', async (req, res) => {
	try {
		const { date } = req.params

		// Convert the date string to a JavaScript Date object
		const searchDate = new Date(date)

		// Find all events that occur on or after the specified date
		const events = await Event.find({ startDate: { $gte: searchDate } })

		res.json(events)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server Error' })
	}
})

// Save an event
router.post('/saveEvent', async (req, res) => {
	try {
		const eventData = req.body
		const event = new Event({ ...eventData, id: randomUUID() })
		const savedEvent = await event.save()
		res.json(savedEvent)
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while saving the event.' })
	}
})

module.exports = router
