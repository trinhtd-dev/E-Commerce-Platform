module.exports.register = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if(!email) {
        req.flash("error", "Email is required");
        return res.redirect("back");
    }

    if(!password) {
        req.flash("error", "Password is required");
        return res.redirect("back");
    }

    if(!confirmPassword) {
        req.flash("error", "Confirm Password is required");
        return res.redirect("back");
    }

    if (password !== confirmPassword) {
        req.flash("error", "Password and Confirm Password do not match");
        return res.redirect("back");
    }

    next();
};


module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if(!email) {
        req.flash("error", "Email is required");
        return res.redirect("back");
    }

    if(!password) {
        req.flash("error", "Password is required");
        return res.redirect("back");
    }

    next();
};
