const express = require('express');
const app = express();
const { auth } = require('express-openid-connect');
const path = require('path');
require('dotenv').config();
const staticPath = path.join(__dirname, "views");
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'vBJ6NaX1N23Dcr1qgYKPpLMuE3htVWk423SawPYnSWI0cURUG5Hn0y94jRnLmahCPNzxB8YXr209pimiYioHLlmrQ9gJ7mkABAKb',
    baseURL: 'http://localhost:3000',
    clientID: 'jkH1B1BTNZEOkCPTl3srxtAiEu7tJJTB',
    issuerBaseURL: 'https://boogeraids.eu.auth0.com',
};


// M I D D L E W A R E
app.set('view engine', 'ejs');
app.use(express.static(staticPath));
app.use(auth(config));
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
});


// R O U T E S
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/profile', function (req, res, next) {
    if(req.oidc.isAuthenticated()){
        res.render('profile', {
            userProfile: JSON.stringify(req.oidc.user, null, 2),
        });
    }
    else{
        res.oidc.login({
            returnTo: 'http://localhost:3000/profile'
        });
    }
});


// P O R T
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});