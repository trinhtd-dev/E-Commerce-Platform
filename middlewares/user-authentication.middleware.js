const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    const userToken = req.cookies.userToken;
    if(!userToken){
        res.redirect(`/user/login`);
        return;
    }
    const user = await User.findOne( {token : userToken} ).select("-password");
    
    if(!user){
        res.redirect(`/user/login`);
        return;
    }
    res.locals.user = user;
    next();
};