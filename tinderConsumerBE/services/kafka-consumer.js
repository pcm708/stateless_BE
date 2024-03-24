const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');

const startKafkaConsumer = () => {
    // Create a Kafka client
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092']
    })

    // Create a Kafka consumer
    const consumer = kafka.consumer({ groupId: 'test-group' })

    consumer.on('consumer.connect', () => {
        console.log('Consumer connected')
    })

    consumer.on('consumer.disconnect', () => {
        console.log('Consumer disconnected')
    })

    consumer.on('consumer.crash', ({ error }) => {
        console.error('Consumer crashed:', error)
    })

    // Connect to Kafka
    consumer.connect()
        .catch((err) => {
            console.error('Failed to connect:', err)
        })

    // Get a reference to the MongoDB collection
    const db = mongoose.connection.db;
    const collection = db.collection('user_infos');

    // Listen to messages from Kafka
    consumer.connect()
        .then(() => consumer.subscribe({ topic: 'userTopic', fromBeginning: true }))
        .then(() => {
            consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const data = JSON.parse(message.value.toString());
                    collection.insertOne(data, function(err, res) {
                        if (err) {
                            console.error('Failed to insert document:', err);
                            return;
                        }
                        console.log("Document inserted");
                    });
                },
            })
        })
        .catch(console.error);
}

module.exports = startKafkaConsumer;