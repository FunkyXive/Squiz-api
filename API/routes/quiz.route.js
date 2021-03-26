const { response } = require("express")
const express = require("express")
const quizRoute = express.Router()
const Quiz = require('../models/quiz.model')

quizRoute.route('/getall').get(function(req, res){
    Quiz.find(function(err, quizzes){
        if (err){
            console.log(err)
            res.json(err)
        }
        else {
            res.json(quizzes)
        }
    })
})

quizRoute.route('/getbycategory/:category').get(function(req, res){
    let req_category = req.params.category
    Quiz.find({category: req_category}, function(err, quizzes){
        if (err){
            console.log(err)
            res.json(err)
        }
        else{
            res.json(quizzes)
        }
    })
})

quizRoute.route('/getallcategories').get((req, res) => {
    let quizCategories = []

    Quiz.find((err, quizzes) => {
        if(err) res.status(400).json(err)

        else{
            quizzes.forEach(q => {
                if(!quizCategories.includes(q.category)) quizCategories.push(q.category)        
            });
            res.json(quizCategories)    
        }
    })
})

module.exports = quizRoute;