/** IMPORTS AND VARIABES */
const express = require('express');
const app = express();
const axios = require("axios").default;
const { auth } = require('express-openid-connect');
const { type } = require('os');
const path = require('path');
const staticPath = path.join(__dirname, "views");
require('dotenv').config();
const { ManagementClient } = require('auth0');
let Users;


/** AUTHENTICATION */
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
};


/** AUTHORIZATION */

const management = new ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
});

const getUserRoles = async (ID) => {
    return await management.users.getRoles({ id:  ID});
}
const getUsers = async () => {
    return await management.users.getAll();
}

/*
const getToken = async () => {
    var options = {
        method: 'POST',
        url: process.env.TOKENURL,
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.CLIENTID,
          client_secret: process.env.CLIENTSECRET,
          audience: process.env.AUDIENCE
        })
      };
    return axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        return error;
    });
};
*/
/*
const getRoles = async () => {
    const axios = require('axios');

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://login.auth0.com/api/v2/users/:id/roles',
    headers: { 
        'Accept': 'application/json'
    }
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
    console.log(error);
    });
}
*/


/** MIDDLEWARE */
app.set('view engine', 'ejs');
app.use(express.static(staticPath));
app.use(auth(config));
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
});


/** ROUTING */
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/signin', function (req, res, next) {
    if(req.oidc.isAuthenticated()){
        res.redirect('/role');
    }
    else{
        res.oidc.login({
            returnTo: `${process.env.BASEURL}/role`
        });
    }
});

app.get('/role', (req, res) => {
    if(req.oidc.isAuthenticated()){
        const id = req.oidc.user.sub;
        getUserRoles(id).then((result) => {
            if(result.data.length == 0){ // User with no role
                res.redirect('/profile');
            }
            else if(result.data[0].id == 'rol_cXmp5WZeCYfL0JWm'){ // Admin Route
                res.redirect('/admin');
            }
            else if(result.data[0].id == 'rol_TtV8H0R8XuKJJxVq'){ // Manager Route
                res.redirect('/manager');
            }
            else if(result.data[0].id == 'rol_Ymj8mgv2HKBLuXor'){ // Employee Route
                res.redirect('/employee');
            }
        })
    }
    else{
        res.redirect('/signin');
    }
});

app.get('/profile/token', (req, res) => {
    if(req.oidc.isAuthenticated()){
        getToken().then((result) => {
            const token = result.access_token;
            const id = req.oidc.user.sub;
        });
    }
});


// STAFF ROUTES
app.get('/admin', (req, res) => {
    if(req.oidc.isAuthenticated()){
        res.render('Admin');
    }
    else{
        res.redirect('/signin');
    }
});
app.get('/manager', (req, res) => {
    if(req.oidc.isAuthenticated()){
        res.render('Manager');
    }
    else{
        res.redirect('/signin');
    }
});
app.get('/employee', (req, res) => {
    if(req.oidc.isAuthenticated()){
        res.render('Employee');
    }
    else{
        res.redirect('/signin');
    }
});
app.get('/profile', (req, res) => {
    if(req.oidc.isAuthenticated()){
        res.render('Profile', {
            userData: req.oidc.user
        });
    }
    else{
        res.redirect('/signin');
    }
});


// ADMIN ROUTES
app.get('/admin/manageusers', (req, res) => {
    const id = req.oidc.user.sub;
    getUserRoles(id).then((result) => {
        if(result.data[0].id == 'rol_cXmp5WZeCYfL0JWm'){
            getUsers().then((usersData) => {
                Users = usersData;
                res.send(usersData.data);
            });
        }
        else{
            res.send('Access Denied.');
        }
    });
}); // Retrieve all users of web application

// P O R T
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});