const systemConfig = require("../config/system");
const Account = require("../models/account.model");

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if(!token){
        res.redirect(`${systemConfig.prefixAdmin}/auths/login`);
        return;
    }
    
    const user = await Account.findOne( {token : token} ).select("-password");
    
    if(!user){
        res.redirect(`${systemConfig.prefixAdmin}/auths/login`);
        return;
    }

    res.locals.user = user;
    next();
};