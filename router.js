var express = require("express");
var router = express.Router();
var admin = require('firebase-admin');// Import Firebase library
var serviceAccount = require('C:/Users/sujan/Desktop/wd401/wd401-62e7e-firebase-adminsdk-vsyrj-31c1bc5955.json');
const bcrypt = require('bcrypt');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

});
var db = admin.firestore();
// Initialize Firebase with your config
//  


router.get('/signup', (req, res) => {

    res.render('signup', { title: 'Signup Page' });
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userSnapshot = await db.collection('loginPage').where('email', '==', email).get();
        // alert(userSnapshot);
        if (userSnapshot.empty) {
            await db.collection('loginPage').add({
                name: name,
                email: email,
                password: hashedPassword,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            res.render('signup_success', { title: 'Signup Successful', name: name });
        }
        else {

            // res.render('userfound', { title: 'Signup UnSuccessful', name: name });
            res.send("User alresy exists");
        }
    } catch (error) {

        res.redirect('/route/signup?error=' + encodeURIComponent(error.message));
    }
});


// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {

        req.session.user = {

            email: email,
        };

        // const hashedPassword = await bcrypt.hash(password, 10);
        const userSnapshot = await db.collection('loginPage').where('email', '==', email).where('password', '==', password).get();
        if (userSnapshot.empty) {

            res.redirect('/route/login?error=' + encodeURIComponent("User Not Found"));
        } else {

            res.redirect('/route/dashboard');
        }
    } catch (error) {

        res.redirect('/route/login?error=' + encodeURIComponent(error.message));
    }
});


// route for dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user })
    } else {
        res.send("Unauthorize User")
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.render('base', { title: "Express", logout: "logout Sucessfully" });
        }
    });
    res.redirect('/');
}
);

module.exports = router;