// Importing modules
const express = require("express");
const mongoose = require("mongoose");
require ('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

const jwt = require("jsonwebtoken");
const User = require("./userModel");
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// Handling post request
app.post("/login", async (req, res, next) => {
   
  let { email, password } = req.body;
  
  let existingUser;
  
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
     return res.status(400).json((err))
  }
  

  if (!existingUser || !await bcrypt.compare(req.body.password,existingUser.password)) {
    const error = Error("Wrong details please check at once");
    return res.status(400).json(next(error))
  }
  
  let token;
  
  try {
    //Creating jwt token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  console.log(token);
  res.status(200).json({
    success: true,
    data: {
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    },
  });
});

// Handling post request
app.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch (err){
    res.status(401).json(next(err))
   
  }
  let token;

  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {   
      console.log(JWT_SECRET);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(201).json({
    success: true,
    data: { userId: newUser.id, email: newUser.email, token: token },
  });
});


app.get('/accessResource', (req, res)=>{  
    

    const token2 = req.headers.authorization
    if(token2==undefined){
        const error = Error("Wrong details please check at once");
       
     return   res.status(401).json((error))
    }
    const token = token2.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    
    var decoded = jwt.verify(token, JWT_SECRET);

     
    // verify a token symmetric
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
    });

    if(!token)
    {
        res.status(200).json({success:false, message: "Error! Token was not provided."});
    }
    //Decoding the token
    const decodedToken = jwt.verify(token,JWT_SECRET );
    res.status(200).json({success:true, data:{userId:decodedToken.userId,
     email:decodedToken.email}});   
}),



//Connecting to the database
mongoose
  .connect("mongodb://localhost:27017/testDB")
  .then(() => {
    app.listen("3000", () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error Occurred");
  });
