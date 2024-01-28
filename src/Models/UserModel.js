const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    mobile: {
        type: String
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
}, {
    relations: {},
    acls: [],
    methods: {},
    versionKey: false
  })
module.exports = mongoose.model('users', users)
