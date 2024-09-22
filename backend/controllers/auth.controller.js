import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

const profilePictures = [
    "https://www.svgrepo.com/show/22032/boy.svg",
    "https://www.svgrepo.com/show/37286/boy.svg",
    "https://www.svgrepo.com/show/34979/boy.svg",
    "https://www.svgrepo.com/show/34972/girl.svg",
    "https://www.svgrepo.com/show/34994/girl.svg",
    "https://www.svgrepo.com/show/25171/girl.svg",
];

  // Function to get a random profile picture
const getRandomProfilePicture = () => {
    return profilePictures[Math.floor(Math.random() * profilePictures.length)];
};

export const signup = async (req, res) => {
    // console.log(req.body);
    try {
        const{ firstname, lastname, email, password, confirmPassword } = req.body

        if(password !== confirmPassword){
            return res.status(400).json({
                error: "Passwords don't match"
            })
        }

        const salt = await bcrypt.genSalt(10)

        const user = await User.findOne({email})
        const hasedPass = await bcrypt.hash(password, salt)

        if(user){
            return res.status(400).json({
                error: "User already exists!!!!"
            })
        }

        const profilePic = getRandomProfilePicture()

        const newUser = new User ({
            firstname,
            lastname,
            email,
            password: hasedPass,
            profilePic
        })
        // console.log(newUser);

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else{
            res.status(400).json({
                error: "Invalid data"
            })
        }

        
    } catch (error) {
        console.log("Error while signup:- ",error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}


export const login = async (req, res) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        // console.log(user);

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            res.status(400).json({
                error: "Invalid Data!!"
            })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error while login:- ",error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}


export const logout = (req, res) => {
    try {
        res.clearCookie("jwt").status(200).json({
            message : "Signed Out Successful"
        })
    } catch (error) {
        console.log("Error while logout:- ",error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export const google = async (req, res) => {
    try {
        const googleUser = await User.findOne({
            email : req.body.email
        })

        if(googleUser){
            generateTokenAndSetCookie(googleUser._id , res)
            res.status(200).json({
                message : "Logged in successfully",
                data: {
                    _id: googleUser._id,
                    email: googleUser.email,
                    firstname: googleUser.firstname,
                    lastname: googleUser.lastname,
                    profilePic: googleUser.profilePic
                }
            })
        } else {

            const randomPass = Math.random().toString(36).slice(-8)
            const hashedPass = bcrypt.hashSync(randomPass, 10)

            const name = req.body.name
            // Split the name by space
            const nameParts = name.split(" ");
            const firstname = nameParts[0];
            const lastname = nameParts.slice(1).join(" ");

            const profilePic = getRandomProfilePicture()

            const newUser = new User({
                firstname,
                lastname,
                email: req.body.email,
                password: hashedPass,
                profilePic
            })

            if(newUser){
                generateTokenAndSetCookie(newUser._id, res)
                await newUser.save()
                res.status(201).json({
                    message : "Logged in successfully",
                    data: {
                        _id: googleUser._id,
                        email: googleUser.email,
                        firstname: googleUser.firstname,
                        lastname: googleUser.lastname,
                        profilePic: googleUser.profilePic
                    }
                })
            } else{
                res.status(400).json({
                    error: "User creation failed"
                })
            }
        }
    } catch (error) {
        console.log("Error in google OAuth", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}