module.exports.forgot = (req, res, next) => {
    const email = req.body.email;
    if(!email){
        req.flash("error", "Please enter your email");
        return res.redirect("back");
    }
    
    next();    
};


module.exports.reset = (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;

    if(!newPassword) {
        req.flash("error", "New Password is required");
        return res.redirect("back");
    }

    if(!confirmPassword) {
        req.flash("error", "Confirm Password is required");
        return res.redirect("back");
    }

    if(confirmPassword != newPassword) {
        req.flash("error", "Password and Confirm Password do not match");
        return res.redirect("back");
    }

    next();
};

module.exports.otp = (req, res, next) => {
    const { email, otp } = req.body;
    if(!email) {
        req.flash("error", "Email is required");
        return res.redirect("back");
    }

    if(!otp) {
        req.flash("error", "OTP is required");
        return res.redirect("back");
    }
    
    next();
};