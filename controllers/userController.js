const mongoose = require("mongoose");

exports.loginForm = (req,res) => {
    res.render('login', {title: 'Login'});
}

exports.registarForm = (req, res) => {
    res,render('register', {title: 'Registar'});
}