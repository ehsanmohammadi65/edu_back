const mongoose = require('mongoose');



const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    parrent: {
        type: String,
        requirred: true
    },
    file: {
        type: Object,
        default: {}
    },
    price: {
        type: String,
        default: '0'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProductChild', dataSchema);