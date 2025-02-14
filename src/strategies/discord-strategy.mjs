import passport from "passport";
import Strategy from "passport-discord";
import 'dotenv/config';
import { DiscordUser } from "../mongoose/schemas/discord.mjs";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

// Check if environment variables are set
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL) {
  throw new Error("Missing environment variables for Discord OAuth2 strategy.");
}

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
})

passport.deserializeUser(async(id, done) => {
    try {
        const findUser = await DiscordUser.findById(id);
        return findUser ? done(null, findUser) : done(null, null);
    } catch (error) {
        done(error, null);
    }
    done(null, user);
})

// Initialize and use the Discord strategy
passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: REDIRECT_URL,
      scope: ['identify'],
    },
    async (accessToken, refreshToken, profile, done) => {
        let findUser;
        try {
           findUser = await DiscordUser.findOne({discord: profile.id});
        } catch (error) {
            return done(error, null);
        }

        try {
            if(!findUser){
                const  newUser = new DiscordUser({
                    username : profile.username,
                    discordId : profile.id
                });
                const newSaveUser = await newUser.save()
                return done(null, newSaveUser);
            }
            return done(null, findUser);
        } catch (error) {
            console.log(error);
            return done(error, null)
        }
    }
  )
);