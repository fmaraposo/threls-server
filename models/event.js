const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  startTimem: { type: Date, required: true },
  endDate: { type: Date, required: true },
  endTime: { type: Date, required: true },
  notes: { type: String }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;