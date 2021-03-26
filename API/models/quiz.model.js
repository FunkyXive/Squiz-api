const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Categories = ['Sport','Computers & IT','Gaming','Sports','Celebrities','Culture','Esport', 'Geography']
let Quiz = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        questions: [new Schema(
            {
                question: String,
                answers: {
                    answer1: {
                        answer: String,
                        isCorrect: Boolean
                    },
                    answer2: {
                        answer: String,
                        isCorrect: Boolean
                    },
                    answer3: {
                        answer: String,
                        isCorrect: Boolean
                    },
                    answer4: {
                        answer: String,
                        isCorrect: Boolean
                    },
                }
            }
        )],
        category: {
            type: String,
            enum: Categories,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['Easy','Medium','Hard','200IQ',]
        }
    }
)

module.exports = mongoose.model("Quiz", Quiz);
