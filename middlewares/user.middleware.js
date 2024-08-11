const User = require("../models/user.model");

module.exports.user = async (req, res, next)  => {
    if(req.cookies.userToken){
        const user = await User.findOne({token: req.cookies.userToken});
        if(user){
            res.locals.user = user;
        }
    }
    next();
}