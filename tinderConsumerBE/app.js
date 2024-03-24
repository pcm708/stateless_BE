const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dbConfig = require('./config/db');
const startKafkaConsumer = require('./services/kafka-consumer');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/users', userRoutes);

// MongoDB Atlas connection
mongoose.connect(dbConfig.mongoURI)
    .then(() => {
        console.log('MongoDB connected')

        // Start the Kafka consumer
        startKafkaConsumer();
    })
    .catch(err => console.log(err+ dbConfig.mongoURI));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});