const mongoose = require('mongoose');

const ImmersioniSchema = mongoose.Schema({
    sito: {
        type: String,
        required: true
    },
    luogo: {
        type: String,
        required: true
    },
    diving: {
        type: String,
        required: true
    },
    indirizzo: {
        type: String,
        required: true
    },
    pmax: {
        type: String,
        required: true
    },
    tmax: {
        type: String,
        required: true
    },
    mixfondo: {
        type: String,
        required: true
    },
    contenuto: {
        type: String,
        required: true
    },
    utente: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('immersioni', ImmersioniSchema);