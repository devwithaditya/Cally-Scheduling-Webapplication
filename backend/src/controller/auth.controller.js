const userModel = require("../models/auth.model")
const bcrypt = require("bcrypt")
const {generateOTP,otpTemplate, generateRandomWords} = require("../utils/utils")
const otpModel = require("../models/otp.model")
const sendEmail = require("../services/email.service")
const jwt = require("jsonwebtoken")
const {
  oauth2Client,
  calendarOAuthClient,
} = require("../services/google.service");

async function register(req,res){
    const {username,email,password} = req.body
    const isAlreadyExist = await userModel.findOne({
        email
    })
    if(isAlreadyExist){
        return res.status(400).json({
            message:"User already Exist"
        })
    }
    const pass = await bcrypt.hash(password,4)
    
    const otp = generateOTP()
    const html = otpTemplate(otp)
    console.log(otp);
    
    const otpHash = await bcrypt.hash(otp,4)

    await otpModel.deleteOne({
        email
    })

    await otpModel.create({
        email,
        otp:otpHash
    })


    await sendEmail({
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
    html: html
    });

    //Random slug generation
    let randomWords = generateRandomWords(4)
    let name = req.body.username.toLowerCase()
    let Newslug = name.replaceAll(' ','-')+'-'+randomWords

    let isUsed = await userModel.findOne({
        slug:Newslug
    })

    while(isUsed){
        randomWords = generateRandomWords(4)
        name = req.body.username.toLowerCase()
        Newslug = name.trim().replaceAll(' ','-')+'-'+randomWords
        isUsed = await userModel.findOne({
            slug:Newslug
        })
    }
    console.log("Generated slug:", Newslug);

    const user = await userModel.create({
        username,
        email,
        password:pass,
        slug:Newslug
    })

    console.log("Saved user:", user);
    console.log("Saved slug:", user.slug);
    
    res.status(201).json({
        message:"User Created Successfully",
        
    })
}

async function otpVerify(req,res){
    const {email,otp} = req.body

    const otpDoc = await otpModel.findOne({
        email
    })

    if(!otpDoc){
        return res.status(404).json({
            message:"OTP is expired or not found"
        })
    }

    const valid = await bcrypt.compare(otp,otpDoc.otp)

    if(!valid){
        return res.status(401).json({
            message:"Invalid OTP"
        }) 
    }

    await userModel.findOneAndUpdate({email},{verified:true})

    res.status(200).json({
        message:"OTP Verified Successfully"
    })

}

async function login(req,res){
    const{email,password} = req.body

    const user = await userModel.findOne({
        email,
        provider:"local"
    })

    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    if(!user.verified){
        return res.status(403).json({
            message:"User not verified"
        })
    }

    const valid = await bcrypt.compare(password,user.password)

    if(!valid){
        return res.status(401).json({
            message:"Username or password is incorrect"
        })
    }

    const accessToken = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRETS,
        {expiresIn:"15m"}
    )

    const refreshToken = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRETS,
        {expiresIn:"7D"}
    )

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })

    res.status(200).json({
        message:"User Login Successfully",
        accessToken,
        verified:user.verified,
        slug:user.slug
    })

}

async function refreshToken(req,res){
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(404).json({
            message:"Token not found"
        })
    }
    try{
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRETS)
    
        const accessToken = jwt.sign(
            {
                id:decoded.id
            },
              process.env.JWT_SECRETS,
            {
                expiresIn:"15m"
            }
        )
    
        const newRefreshToken = jwt.sign(
           {
              id:decoded.id,
           },
              process.env.JWT_SECRETS,
           {
               expiresIn:"7D"
           }
        )
    
        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"strict"
        })
    
        res.status(200).json({
            message:"Token Updated",
            accessToken
        })
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token or expired"
        })
    }

}

async function logout(req,res){
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(400).json({
            message:"Already Logout"
        })
    }
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:false,
        sameSite:"strict"
    })

    res.status(200).json({
        message:"Logout Successfully"
    })
}

async function googleCallback(req,res){
    const userId = req.user.id

    const accessToken = jwt.sign(
        {id:userId},
        process.env.JWT_SECRETS,
        {expiresIn:"15m"}
    )

    const refreshToken = jwt.sign(
        {id:userId},
        process.env.JWT_SECRETS,
        {expiresIn:"7d"}
    )

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        samesite:"strict",
        maxAge:7*24*60*60*1000
    })

    res.redirect(
      `${process.env.FRONTEND_URL}/google-success?token=${accessToken}`
    );
}

async function connectGoogleCalendar(req, res) {
  const token = req.query.token;
  const url = calendarOAuthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    state: token,
    scope: [
      "https://www.googleapis.com/auth/calendar",
    ],
  });
  console.log(url); 
  res.redirect(url);
}

async function googleCalendarCallback(req, res) {
  const { code, state } = req.query;

  const decoded = jwt.verify(state, process.env.JWT_SECRETS);

  const userId = decoded.id;

  const { tokens } = await calendarOAuthClient.getToken(code);

  await userModel.findByIdAndUpdate(userId, {
  googleAccessToken: tokens.access_token,
  googleRefreshToken: tokens.refresh_token,
  googleTokenExpiry: new Date(tokens.expiry_date),
  calendarConnected: true,
  });

  console.log("State:", state);
  console.log(userId);
  console.log(tokens);
  res.redirect(
    `${process.env.FRONTEND_URL}/google-calendar-success`
  );
}

module.exports = {register,otpVerify,login,logout,refreshToken,googleCallback,connectGoogleCalendar,googleCalendarCallback}