const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async(req, res) => {
    let find = {
        deleted: false
    };
    const records = await Account.find(find).select("-password -token");
    res.render('admin/pages/accounts/index',
        {
            title: 'Accounts',
            records: records,
        }
    );
}


// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({deleted: false});
    res.render('admin/pages/accounts/create', {
        title: 'Create Account',
        roles: roles,
    });
};
// [POST] /admin/accounts/create

module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({ email: req.body.email });
    if(emailExist){
        req.flash('error', "Email already exists");
        res.redirect('back');
        return;
    }

    try {
        if(req.body.password){
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
    
        const account = new Account(req.body);
        accout.createdBy = {
            accountId: res.locals.user.id,
            createdAt: new Date(),
        }
        await account.save();
        req.flash('success', "Role created successfully");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch (error) {
        req.flash("error", "Role created failed");
        res.redirect('back');
        console.log(error);
    }
};

// [GET] /admin/accounts/edit:
module.exports.edit =  async (req, res) => {
    const id = req.params.id;
    let find ={
        _id: id,
        deleted: false
    };
    
    try {
        const record = await Account.findOne(find).select("-password -token");
        const roles = await Role.find({deleted: false});
        res.render('admin/pages/accounts/edit', {
            title: 'Edit Account',
            record: record,
            roles: roles,
    });
    } catch (error) {
        req.flash("error", "Not Found");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
};

// [POST] /admin/accounts/edit:
module.exports.editPost = async (req, res) => {
    const id = req.params.id;
    
    if(req.body.password){
        req.body.password = md5(req.body.password);
    } else {
        delete req.body.password;
    }

    const emailExist = await Account.findOne({email: req.body.email, _id: {$ne: id}});
    if(emailExist){
        req.flash('error', "Email already exists");
        res.redirect('back');
        return;
    }

    try {
        await Account.updateOne({_id: id}, {
            ...req.body,
            updatedBy: {
                accountId: res.locals.user.id,
                createdAt: new Date(),
            }

        });
        req.flash('success', 'Account updated successfully');
    } catch (error) {
        req.flash('error', "Account updated failed");
    }
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

// [GET] /admin/accounts/detail
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    let find ={
        _id: id,
        deleted: false
    };
    
    try {
        const record = await Account.findOne(find).select("-password -token");
        const roles = await Role.find({deleted: false});
        res.render('admin/pages/accounts/detail', {
            title: 'Detail Account',
            record: record,
            roles: roles,
    });
    } catch (error) {
        req.flash("error", "Not Found");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
};

// [GET] /admin/accounts/delete/:id?method_Delete
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Account.updateOne({_id: id}, {
            deletedBy:{
                accountId: res.locals.user.id,
                createdAt: new Date(),
            },
            deleted: true
        });
        req.flash('success', 'Account deleted successfully');
    } catch (error) {
        req.flash('error', 'Account deleted failed');
    }    
    res.redirect('back');
};
