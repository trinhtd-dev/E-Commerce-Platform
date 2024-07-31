module.exports.createPost = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Fullname is required");
        res.redirect('back');
        return;
    }
    if(!req.body.email){
        req.flash("error", "Email is required");
        res.redirect('back');
        return;
    }
   
    next();
};

module.exports.editPost = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Fullname is required");
        res.redirect('back');
        return;
    }
    if(!req.body.email){
        req.flash("error", "Email is required");
        res.redirect('back');
        return;
    }
    
    next();
};