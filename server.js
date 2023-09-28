const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');

const router = require('./router');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')))


app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

app.use('/route', router);


app.get('/route/signup', (req, res) => {
    res.render('signup');
});

app.get('/route/login', (req, res) => {
    res.render('base');
})

// home route
app.get('/', (req, res) => {
    res.render('base', { title: "Login System" });
})

app.listen(port, () => { console.log("Lostening to the server on http://localhost:3000") });