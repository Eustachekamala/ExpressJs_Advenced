import { Router } from "express";
import { validationResult, matchedData, checkSchema, query } from 'express-validator';
import { createUserValidatorSchema, getUserValidatorSchema } from '../validators/validatorSchemas.mjs';
import { users } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../middlewares/findUserId.mjs";

const router = Router();

//GET all the users
router.get('/api/users', query(checkSchema(getUserValidatorSchema)),(req, res) => {
    const result = validationResult(req)
    console.log(result);
    console.log(req.session);
    console.log(req.session.id);
    // Check for validation errors
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    
    /**
     * Extracts the `filter` and `value` properties from the query parameters of the request.
     *
     * @param {Object} req - The request object.
     * @param {Object} req.query - The query parameters of the request.
     * @param {string} req.query.filter - The filter parameter from the query.
     * @param {string} req.query.value - The value parameter from the query.
     */
    const {
        query : { filter, value}
    } = req;
    //when filter and value are undefined
    if(!filter && !value) return res.send(users)

    if(filter && value) {
        if (!users[0].hasOwnProperty(filter)) {
            return res.status(400).send({ msg: "Invalid filter property" });
        }
        return res.send(
            users.filter((user) => user[filter].includes(value))
        );
    }
    res.status(200).send(users);
});

//GET users by their ID
/**
 * An array of user objects.
 * @type {Array<{id: number, username: string, displayName: string}>}
 */
router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;    
    /**
     * Finds a user by their ID.
     *
     * @param {Array} users - The array of user objects.
     * @param {number} parsedId - The ID of the user to find.
     * @returns {Object|undefined} The user object if found, otherwise undefined.
     */
    const findUser = users[findUserIndex];
    if(!findUser) return res.status(404).send({msg : 'User was not found'});
    return res.send(findUser)
})

//POST user
// router.post('/api/users', checkSchema(createUserValidatorSchema),
//     (req, res) => {
//         const  result = validationResult(req)
//         console.log(result);

//     if(!result.isEmpty())
//         return res.status(400).send({errors : result.array()});
//     const data = matchedData(req);
//     /**
//      * Creates a new user object with a unique ID.
//      *
//      * @constant {Object} newUser - The new user object.
//      * @property {number} newUser.id - The unique ID for the new user.
//      * @property {Object} data - The additional data for the new user.
//      */
//     const  newUser = { id : users[users.length - 1].id + 1, ...data};
//     users.push(newUser);
//     return res.status(201).send(newUser);
// })

//Update the field of a user
router.put('/api/users/:id', resolveIndexByUserId,(req, res) => {
    const { body, findUserIndex } = req;
    users[findUserIndex] = { id : users[findUserIndex].id, ...body};
    return res.sendStatus(200);
})

//Update one field of a user
router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    users[findUserIndex] = {...users[findUserIndex].id, ...body};
    return res.sendStatus(200);
})

//DELETE a user by it ID
router.delete('/api/users/:id', (req, res) => {
    const { findUserIndex } = req;
    users.splice(findUserIndex, 1);
    return res.sendStatus(204);
})

export default router