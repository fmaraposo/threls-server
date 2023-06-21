const express = require('express');
const mongoose = require('mongoose');
const { mongoUri } = require("./config");

const app = express() // start express app
connectMongoDB() // connect to MongoDB

async function connectMongoDB() {
    mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, });
    const db = mongoose.connection;
    db.once('open', () => console.log('Connected to MongoDB'));
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port = 3000, () => {
    console.log(`Server is running on port ${port}`);
});
