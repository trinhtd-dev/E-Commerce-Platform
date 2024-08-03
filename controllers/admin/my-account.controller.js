const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = async(req, res) => {
    const roles = await Role.find({});
    res.render('admin/pages/my-account/index',
        {
            title: 'my-account',
            roles: roles,
            
        }
    );
}


// [GET] /admin/my-account/edit:
module.exports.edit =  async (req, res) => {
    const roles = await Role.find({});
    res.render('admin/pages/my-account/edit', {
        title: 'Edit information ',
        roles: roles,
        
    });
};

// [Patch] /admin/my-account/edit:
module.exports.editPatch = async (req, res) => {
    try {
        console.log(res.locals.user);
        const account = await Account.updateOne({_id: res.locals.user.id}, {
            ...req.body,
            udpatedBy:{
                accountId: res.locals.user.id,
                updatedDate: new Date(),
            }
        });
        req.flash('success', 'Update information successfully');    
    } catch (error) {
        console.log(error);
        req.flash('error', 'Update information failed');
    }
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
}



// [GET] /admin/my-account/edit:
module.exports.changePassword =  async (req, res) => {
    res.render('admin/pages/my-account/change-password', {
        title: ' Change Password ',
    });
};

// [Patch] /admin/my-account/edit:
module.exports.changePasswordPatch = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        // Check if current password matches
        const account = await Account.findById(res.locals.user.id);
        if (!account) {
            req.flash('error', 'Account not found');
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/change-password`);
        }

        const isMatch = account.password === md5(currentPassword);
        console.log(account.password)
        console.log(currentPassword)
        if (!isMatch) {
            req.flash('error', 'Current password is incorrect');
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/change-password`);
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            req.flash('error', 'New password and confirm password do not match');
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/change-password`);
        }


        await Account.updateOne(
            { _id: res.locals.user.id },
            {
                password: md5(newPassword),
                updatedBy: {
                    accountId: res.locals.user.id,
                    updatedDate: new Date(),
                },
            }
        );

        req.flash('success', 'Password changed successfully');
        res.redirect(`${systemConfig.prefixAdmin}/my-account`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while changing the password');
        res.redirect(`${systemConfig.prefixAdmin}/my-account/change-password`);
    }
}
