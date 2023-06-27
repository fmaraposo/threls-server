const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const { areIntervalsOverlapping, isSameDay } = require('date-fns')

const isOverlapping = async (event, edit) => {
	let existingEvents
	if (edit) {
		// Find all events except the one being edited
		existingEvents = await Event.find({ _id: { $ne: event._id } })
	} else {
		// Find all events except the one being edited
		existingEvents = await Event.find()
	}

	const isOverlap = existingEvents.some((e) => {
		// Check if the event overlaps with any existing event
		const eventOverlap = areIntervalsOverlapping(
			{ start: new Date(e.startDate), end: new Date(e.endDate) },
			{ start: new Date(event.startDate), end: new Date(event.endDate) }			
		)

		if (eventOverlap) return true
		else return false
	})

	return isOverlap
}

const areDatesOnSameDay = (startDate, endDate) => {
	const sameDay = isSameDay(new Date(startDate), new Date(endDate))
	return sameDay
}

// Get all events that start from a particular date
router.get('/:date/:endDate', async (req, res) => {
	try {
		const { date, endDate } = req.params

		// Find all events that occur on the specified date
		const events = await Event.find({ startDate: { $gte: date, $lte: endDate } })

		res.json(events)
	} catch (error) {
		res.status(500).json({ error: 'Server Error', message: error.message })
	}
})

// Save an event
router.post('/saveEvent', async (req, res) => {
	try {
		const eventData = req.body
		const event = new Event(eventData)

		if (!areDatesOnSameDay(eventData.startDate, eventData.endDate)) {
			// Check if event is on same day
			res.json({ error: 'Events must be on same day.' })
		} else if (await isOverlapping(eventData)) {
			// Check if event overlaps with any existing event
			res.json({ error: 'Event overlaps with an existing event.' })
		} else {
			// Save event
			const savedEvent = await event.save()
			res.json({ event: savedEvent, message: 'Event saved successfully.' })
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: 'An error occurred while saving the event.', message: error.message })
	}
})

// Delete an event
router.delete('/deleteEvent/:id', async (req, res) => {
	try {
		const { id } = req.params
		await Event.deleteOne({ _id: id })
		res.json({ message: 'Event deleted successfully.' })
	} catch (error) {
		res
			.status(500)
			.json({ error: 'An error occurred while deleting the event.', message: error.message })
	}
})

// Update an event
router.put('/updateEvent/:id', async (req, res) => {
	try {
		const { id } = req.params
		const eventData = req.body
		if (!areDatesOnSameDay(eventData.startDate, eventData.endDate)) {
			// Check if event is on same day
			res.json({ error: 'Events must be on same day.' })
		} else if (await isOverlapping({ ...eventData, _id: id }, true)) {
			// Check if event overlaps with any existing event
			res.json({ error: 'Event overlaps with an existing event.' })
		} else {
			// Update event
			await Event.updateOne({ _id: id }, eventData)
			res.json({ message: 'Event updated successfully.', event: { ...eventData, _id: id } })
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: 'An error occurred while updating the event.', message: error.message })
	}
})

module.exports = router
