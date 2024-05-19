/** IMPORTS AND VARIABES */
const express = require('express');
const { auth } = require('express-openid-connect');
const { ManagementClient } = require('auth0');
const path = require('path');
require('dotenv').config();
const app = express();
const staticPath = path.join(__dirname, "views");
require('dotenv').config();

/** ******************************************************************************************************************* */
/** USER INFORMATION */
let email;
let name;
/** ******************************************************************************************************************* */


/** ******************************************************************************************************************* */
/** AUTHENTICATION */

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
};



/** ******************************************************************************************************************** */
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
const getUserPermissions = async (ID) => {
    return management.users.getPermissions({ id: ID });
}
const removeAccess = async (ID) => {
    management.users.delete({id: ID});
}


/** *********************************************************************************************************************** */
/** MIDDLEWARE */
app.set('view engine', 'ejs');
app.use(express.static(staticPath));
app.use(auth(config));
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
});



/** ************************************************************************************************************************ */
/** ROUTING */
app.get('/', (req, res) => {
    res.render('./homepage/home.ejs');
});

app.get('/signin', function (req, res, next) {
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
        res.oidc.login({
            returnTo: `${process.env.BASEURL}/signin`
        });
    }
});



/** ************************************************************************************************************************* */
/** STAFF ROUTES */
app.get('/admin', (req, res) => {
    if(req.oidc.isAuthenticated()){
        email = req.oidc.user.email;
        name = req.oidc.user.name;
        res.render('./admin/Admin.ejs');
    }
    else{
        res.redirect('/signin');
    }
});
app.get('/manager', (req, res) => {
    if(req.oidc.isAuthenticated()){
        email = req.oidc.user.email;
        name = req.oidc.user.name;
        res.render('./manager/Manager.ejs');
    }
    else{
        res.redirect('/signin');
    }
});
app.get('/employee', (req, res) => {
    if(req.oidc.isAuthenticated()){
        email = req.oidc.user.email;
        name = req.oidc.user.name;
        res.render('./employee/dashboard.ejs');
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



/** ************************************************************************************************************************* */
/** ADMIN ROUTES */
app.get('/admin/manageusers', (req, res) => {
    const id = req.oidc.user.sub;
    getUserRoles(id).then((result) => {
        if(result.data[0].id == 'rol_cXmp5WZeCYfL0JWm'){
            getUsers().then((usersData) => {
                Users = usersData;
                res.json(usersData.data);
            });
        }
        else{
            res.send('Access Denied.');
        }
    });
});



/** ************************************************************************************************************************ */
/** EMPLOYEE ROUTES */
app.get('/employee/eTimesheet', (req, res) => {
    id = req.oidc.user.sub;
    getUserRoles(id).then((result) => {
        if(result.data[0].id == 'rol_Ymj8mgv2HKBLuXor'){
            res.render('./employee/eTimesheet.ejs');
        }
        else{
            res.send('Access Denied.');
        }
    });
});

app.get('/employee/eBooking', (req, res) => {
    id = req.oidc.user.sub;
    getUserRoles(id).then((result) => {
        if(result.data[0].id == 'rol_Ymj8mgv2HKBLuXor'){
            res.render('./employee/eBooking.ejs')
        }
        else{
            res.send('Access Denied.');
        }
    });
});

app.get('/employee/eBookMeal', (req, res) => {
    id = req.oidc.user.sub;
    getUserRoles(id).then((result) => {
        if(result.data[0].id == 'rol_Ymj8mgv2HKBLuXor'){
            res.render('./employee/eBookMeal.ejs')
        }
        else{
            res.send('Access Denied.');
        }
    });
});



/** ************************************************************************************************************************ */
/** API FOR USER INFORMATION */
app.get('/userinfo', (req, res) => {
    res.json({ 
        "email": email,
        "name": name,
    });
});



/** ************************************************************************************************************************ */
/** PORT */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
