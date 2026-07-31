const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const userModel = require("../models/auth.model")
const { refreshToken } = require("../controller/auth.controller")
const jwt = require("jsonwebtoken")
const { generateRandomWords } = require("../utils/utils")

passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:process.env.GOOGLE_REDIRECT_URI
        },
        
        async (accessToken,refreshToken,profile,done)=>{
            const username = profile.displayName
            const email = profile.emails[0].value

            const user = await userModel.findOne({
                email
            })

            if(user){
                return done(null,user)
            }

            let randomWords = generateRandomWords(4)
            let name = username.toLowerCase();
            
            let newSlug = name.replaceAll(" ", "-") + "-" + randomWords;
            
            while (await userModel.findOne({ slug: newSlug })) {
                randomWords = generateRandomWords(4);
                newSlug = name.replaceAll(" ", "-") + "-" + randomWords;
            }


           const createUser = await userModel.create({
                username,
                email,
                provider:"google",
                verified:true,
                slug:newSlug
            })
            
            done(null,createUser)
        }
    )
)