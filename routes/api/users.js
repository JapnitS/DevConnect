const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {
    check,
    validationResult
} = require('express-validator')
const User = require("../../models/User")
router.post('/', [
    check("name", "Name is Required").not().isEmpty(), //for name not being null (required),
    check("email", "Please input a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more charecters").isLength({
        min: 6
    })


], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        name,
        email,
        password
    } = req.body;
    try {
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: "User already exists"
                }]
            })
        }




        // Check if the user is already signed up
        // get users gravatar
        const avatar = gravatar.url(email, {
            s: '200', //size of the image
            r: 'pg', // pic senstivity like rating(universal)
            d: 'mm' //if no gravatr then put the default
        })
        user = new User({
            name,
            email,
            avatar,
            password
        });
        //encrypt password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save() //use await wherver a promise is being returned otherwise use "if-then" stsments 
        // return jsonwebtoken for the frontend
        const payload = {
            user: {
                id: user.id //saved as _id in mongo db but no need to put the "_" before id
            }
        }

        jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn :360000
        },(err,token)=>{if (err) throw err;
        res.json({token})
        } );  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
    console.log(req.body)

});
module.exports = router;