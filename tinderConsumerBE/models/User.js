const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
});

UserSchema.index({ location: '2dsphere' });

// Create a virtual property `id` that's computed from `_id`.
UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', UserSchema, 'user_infos');