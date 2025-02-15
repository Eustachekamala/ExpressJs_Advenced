import { users } from "../utils/constants.mjs";
import { matchedData, validationResult } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

export const getUserByIdHandler = (req, res) => {
    const { findUserIndex } = req;    
    /**
     * Finds a user by their ID.
     *
     * @param {Array} users - The array of user objects.
     * @param {number} parsedId - The ID of the user to find.
     * @returns {Object|undefined} The user object if found, otherwise undefined.
     */
    const findUser = users[findUserIndex];
    if(!findUser) return res.sendStatus(404)
    return res.send(findUser)
};


export const createUserHandler = async (req, res) => {
    const result = validationResult(req);

    if(!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (error) {
        return res.sendStatus(400);
    }
}