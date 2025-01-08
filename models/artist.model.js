const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// aqui creamos el schema
const artistSchema = new Schema({
    name: {
        type: String,
        required: true,
        // unique: true
    },
    awardsWon: {
        type: Number,
        min: 0
    },
    isTouring: Boolean,
    genre: {
        type: [String],
        enum: ["rock", "alternative", "jazz", "folk", "pop", "grunge", "rap", "pop-rap"]
    }
})

// aqui creamos el modelo
const Artist = mongoose.model("Artist", artistSchema)
//                               |           |
//   nombre interno del modelo SINGULAR      |
//                                       EL ESQUEMA

module.exports = Artist