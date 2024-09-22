var express = require("express");
var router = express.Router();
var admin = require('firebase-admin');
const serviceAccount = require('C:/Users/mural/OneDrive/Desktop/gdsc/TextTranslator/gdscc-47b39-firebase-adminsdk-f34ms-1ab629b0f9.json'); // Corrected path
const bcrypt = require('bcrypt');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

});
var db = admin.firestore();
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


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userSnapshot = await db.collection('loginPage').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.redirect('/route/login?error=' + encodeURIComponent("User Not Found"));
        }

        const userData = userSnapshot.docs[0].data(); // Get the user data
        const isPasswordValid = await bcrypt.compare(password, userData.password); 

        if (!isPasswordValid) {
            return res.redirect('/route/login?error=' + encodeURIComponent("Invalid Password"));
        }

        req.session.user = {
            email: email,
        };

        res.redirect('/route/dashboard');
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