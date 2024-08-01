const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

module.exports.login = (req, res) => {
    if(req.cookies.token){
        return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }

    res.render("admin/pages/auths/login", {
    });
};

module.exports.loginPost = async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
    console.log(email, password);

    const emailExist = await Account.findOne({email: email });

    if(!emailExist){
        req.flash("error", "Email not true");
        res.redirect("back");
        return;
   }

   if(emailExist.password != md5(password)){
       req.flash("error", "Password not true");
       res.redirect("back");
       return;
   }

   req.flash("success", "Login successful");
   res.cookie("token", emailExist.token);
   res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};


module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auths/login`);
};