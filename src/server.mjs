/**
 * @fileoverview This file sets up an Express server with various middlewares and routes.
 * It includes session management, cookie parsing, and user authentication.
 */

import express, { response } from 'express';
import logger from './middlewares/logger.mjs';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { users } from './utils/constants.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import './strategies/local-strategy.mjs'

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
    .connect('mongodb://localhost/express_tutoriel')
    .then(() => console.log('connected to Database'))
    .catch((error) => console.log(`Error : ${error}`))

app.use(express.json());
app.use(logger);
app.use(cookieParser("helloworld"));
app.use(session(
    {
        secret : 'eustache the dev',
        resave : false,
        saveUninitialized : false,
        cookie : { 
            maxAge : 60000 * 60,
         },
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

/**
 * GET /
 * Welcome route that sets a signed cookie and initializes session data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/',(req, res) => {
    console.log(req.session.id);
    console.log(req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);
        
    }));
    req.session.visited = true;
    res.cookie("hello", "world", {maxAge : 10000, signed : true});
    res.status(201).send({msg : "Welcome to my backend json"});
});

/**
 * POST /api/auth
 * Authenticates a user and initializes session data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/api/auth', passport.authenticate("local"), (req, res) => {
    const { 
        body : {username, password} 
        } = req;
    const findUser = users.find(user => user.username === username && user.password === password);
    if (!findUser || findUser.password !== password)
        return res.status(401).send({msg: "Invalid credentials"});
    req.session.user = findUser;
    return res.status(200).send({msg: "Authentication successful"});
});

/**
 * GET /api/auth/status
 * Checks the authentication status of the user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/api/auth/status', (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    });

    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send(
        { message : "Not Authenticated"}
    )
})

/**
 * POST /api/cart
 * Adds an item to the user's cart.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/api/cart", (req,res) =>{
    if(!req.session.user) return res.sendStatus(401);
    const { body : item } = req;
    const { cart } = req.session;

    if(cart){
        cart.push(item);
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
})

/**
 * GET /api/cart
 * Retrieves the items in the user's cart.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/api/cart', (req, res) => {
     if(!req.session.user) return res.sendStatus(401);
     return res.send(req.session.cart ?? [])
})

/**
 * GET /api/cart/items
 * Retrieves all items added to the cart for each authenticated session.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/api/cart/items', (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    req.sessionStore.all((err, sessions) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        const allCarts = Object.values(sessions)
            .filter(session => session.cart)
            .map(session => session.cart)
            .flat();
        return res.status(200).send(allCarts);
    });
});

app.post('/api/auth/passport', passport.authenticate('local'),(req, res) => {
    res.sendStatus(200);
})

app.get('/api/auth/passport/status', (req, res) => {
    console.log(`Inside /auth/passport/status/ endpoint`);
    console.log(req.user);
    console.log(req.session);
    return req.user ? res.send(req.user) : res.sendStatus(401);
})

app.post("/api/auth/passport/logout", (req, res) => {
    if(!req.user) return res.sendStatus(401);

    req.logOut((err) => {
        if(err) return res.sendStatus(400);
        res.sendStatus(200);
    })
})

/**
 * Starts the Express server on the specified port.
 * @param {number} PORT - The port number on which the server will listen.
 */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});