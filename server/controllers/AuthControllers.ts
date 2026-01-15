import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';


// User Registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;

        //find user by email
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        //Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();

        //setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;

        return res.json({
            success: true,
            message: 'Account created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        })

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// User Login
export const loginUser = async (req: Request, res: Response) => {
  
    try {
        const {email, password} = req.body;

        if(!email || !password){
             return res.status(400).json({
                success: false,
                message: 'Please, provide an email or password',
             })
        }
        
       // find user by email
       const isUser = await User.findOne({email});

       if(!isUser){
         return res.status(404).json({
            success: false,
            message: 'User not found',
         })
       }

       // check valid password
       const isValidPassword = await bcrypt.compare(password, isUser.password);

       if(!isValidPassword){
          return res.status(400).json({
            success: false,
            message: 'Email or password is incorrect'
          })
       }

       //setting user data in session
       req.session.isLoggedIn = true;
       req.session.userId = isUser._id;

       return res.json({
        success: true,
        message: 'Login successfully',
        user: {
            _id: isUser._id,
            name: isUser.name,
            email: isUser.email,
        }
       })

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// User Logout
export const logoutUser = async (req: Request, res: Response) => {
   
        req.session.destroy((error: any) => {
          if(error){
            console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
          }
        })

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        })
  
}

// User Verify
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;

       const user = await User.findById(userId).select('-password');

       if(!user){
        return res.status(400).json({
            success: false,
            message: 'Invalid user',
        })
       }

       return res.json({ user });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}