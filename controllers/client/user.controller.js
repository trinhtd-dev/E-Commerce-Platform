const User = require("../../models/user.model");

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

        if (password !== confirmPassword) {
            req.flash("error", "Password and Confirm Password do not match");
            return res.redirect("back");
        }

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
    res.render("client/pages/user/login");
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