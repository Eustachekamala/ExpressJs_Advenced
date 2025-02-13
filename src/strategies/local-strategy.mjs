import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) =>{
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id)
});

passport.deserializeUser(async(id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User ID : ${id}`);
    try {
        const findUser = await User.findById(id);
        if(!findUser) throw new Error("User not found");
        done(null, findUser)
    } catch (error) {
        done(error, null)
    }
});

passport.use(
    new Strategy(async (username, password, done) => {
        try {
            /**
             * Finds a user by their username.
             * 
             * @async
             * @function findUser
             * @param {Object} query - The query object to find the user.
             * @param {string} query.username - The username of the user to find.
             * @returns {Promise<User|null>} A promise that resolves to the user object if found, otherwise null.
             */
            const findUser = await User.findOne({username});
            if(!findUser) throw new Error("User not found");
            if(!comparePassword(password, findUser.password)) throw new Error ("Bad Credentials")
            done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    })
)