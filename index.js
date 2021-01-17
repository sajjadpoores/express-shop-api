const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())

const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Database...')
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}...`)
})