import { users } from "../utils/constants.mjs";

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
    if(!findUser) return res.status(404).send({msg : 'User was not found'});
    return res.send(findUser)
};