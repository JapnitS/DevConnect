const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User') 

router.get('/',auth,async (req,res)=>{
    try{
        const user = await (await User.findById(req.user.id)).isSelected('-password')
        res.json(user)

    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')

    }
})
module.exports=router;