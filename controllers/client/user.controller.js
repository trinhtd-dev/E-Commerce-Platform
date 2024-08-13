const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const sendMailHelper = require("../../helpers/send-mail");

const moment = require("moment");
const bcrypt = require("bcrypt");

const saltRounds = 10;



// [GET] /user/register
module.exports.register = (req, res) => {
    res.render("client/pages/user/register");
}; 

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {

        const { email, password, confirmPassword } = req.body;
     
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            req.flash("error", "Email already exists");
            return res.redirect("back");
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;
        const user = new User(req.body);

        await user.save();
        req.flash("success", "Registration successful. You can now log in");
        return res.redirect("/user/login");
    } catch (error) {
        console.log(error);
        req.flash("error", "Please try again");
        return res.redirect("back");
    }
};

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render("client/pages/user/login",{
        title: "Login",
    });
}; 

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        
        if(!user){
            req.flash("error", "Email does not exist");
            return res.redirect("back");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            req.flash("error", "Password is incorrect");
            return res.redirect("back");    
        }

        res.cookie("userToken", user.token);

        req.flash("success", "Login successful");
        return res.redirect("/");

    } catch (error) {
        console.log(error);
        req.flash("error", "Please try again");
        return res.redirect("back");
    }

}; 

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("userToken");
    req.flash("success", "Logout successful");
    return res.redirect("/");
}; 

// [GET] /user/password/forgot
module.exports.passwordForgot = (req, res) => {
    res.render("client/pages/user/password-forgot", {
        title: "Forgot Password",
    });
}; 

// [POST] /user/password/forgot
module.exports.passwordForgotPost = async (req, res) => {
    const email = req.body.email;
    if(!email){
        req.flash("error", "Please enter your email");
        return res.redirect("back");
    }
    try {
        const user = await User.findOne({ email });

        if(!user){
            req.flash("error", "Email is not registered");
            return res.redirect("back");
        }
        

        const forgotPassword = new ForgotPassword({ email });
        await forgotPassword.save();

    // Send OTP to user's email
        const subject = 'OTP Verification'
        const html = `<h1>Your OTP code is ${forgotPassword.otp}. Your OTP code is expired after 3 minutes.</h1>`
        sendMailHelper.sendMail(email, subject, html);
    //...

        req.flash("success", "OTP sent to your email");
        res.redirect(`/user/password/otp/${user.email}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred, please try again");
        res.redirect("/user/login");
    }
};

// [GET] /user/password/otp
 module.exports.passwordOtp = (req, res) => {
    res.render("client/pages/user/password-otp", {
        title: "OTP",
        email: req.params.email,
    });
};

// [POST] /user/password/otp
 module.exports.passwordOtpPost = async (req, res) => {
    const { email, otp } = req.body;
    const forgotPassword = new ForgotPassword({ email: email});
    try {
        if(!forgotPassword){
                req.flash("error", "Email is incorrect");
                return res.redirect("back");
            }
        
            if(otp !== forgotPassword.otp){
                req.flash("error", "OTP is incorrect");
                return res.redirect(`/user/password/otp/${email}`);
            }
        
            const user = await User.findOne({email: email});
            const expires = 1000 * 60 * 60 * 24 * 365; // 1 year
            res.cookie("userToken", user.token, { expires: new Date(Date.now() + expires) });
            await ForgotPassword.deleteOne({ email });

            res.redirect('/user/password/reset');
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred, please try again");
        res.redirect("/user/login");
        
    }

}; 
  
// [GET] /user/password/reset
module.exports.passwordReset = (req, res) => {
    res.render("client/pages/user/password-reset", {
        title: "Reset Password",
    });
}; 

// [POST] /user/password/reset
module.exports.passwordResetPost = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    
    try {
        const userToken = req.cookies.userToken;
        await User.updateOne({token: userToken}, {password: bcrypt.hashSync(newPassword, saltRounds)});
        req.flash("success", "Password reset successful");
        res.redirect("/");

    } catch (error) {
        console.log(error);
        req.flash("error", "Please try again");
        return res.redirect("user/login");
        
    }
};

// [GET] /user/profile
module.exports.profile = (req, res) => {
    res.render("client/pages/user/profile", {
        title: res.locals.user.fullName,
        moment: moment,
    });
};

// [GET] /user/profile/edit
module.exports.profileEdit = (req, res) => {
    res.render("client/pages/user/profile-edit", {
        title: res.locals.user.fullName,
        moment: moment,
    });
}; 

// [PATCH] /user/profile/edit
module.exports.profileEditPatch = async (req, res) => {
    try {
        const userToken = req.cookies.userToken;
        await User.updateOne({token: userToken}, req.body);
        req.flash('success', 'User updated successfully');
        res.redirect('/user/profile');
    } catch (error) {
        console.error(error);
        req.flash("error", "Please try again");
        res.redirect("/user/profile");
        
    }
}; 

