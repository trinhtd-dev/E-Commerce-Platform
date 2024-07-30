const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async(req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.render('admin/pages/roles/index',
        {
            title: 'Roles',
            records: records,
        }
    );
}


// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create', {
        title: 'Create Role',
    });
};

module.exports.createPost = async (req, res) => {
   const role = new Role(req.body);
    try {
        await role.save();
        req.flash('success', "Role created successfully");
    } catch (error) {
        req.flash("error", "Role created failed");
        console.log(error);
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit:
module.exports.edit =  async (req, res) => {
    const id = req.params.id;
    let find ={
        _id: id,
        deleted: false
    };
    const record = await Role.findOne(find);

    res.render('admin/pages/roles/edit', {
        title: 'Edit Role',
        record: record,
    });
};

// [POST] /admin/roles/edit:
module.exports.editPost = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.updateOne({_id: id}, req.body);
        req.flash('success', 'Role updated successfully');
    } catch (error) {
        req.flash('error', "Role updated failed");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/detail
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Role.findOne({_id: id});
    res.render('admin/pages/roles/detail', {
        title: 'Detail Role',
        record: record,
    });
};

// [GET] /admin/roles/delete/:id?method_Delete
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.updateOne({_id: id}, {deleted: true});
        req.flash('success', 'Role deleted successfully');
    } catch (error) {
        req.flash('error', 'Role deleted failed');
    }    
    res.redirect('back');
};

module.exports.permissions = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render('admin/pages/roles/permissions', {
        title: 'Permissions',
        records: records,
    });
};

module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    try {
        for(const permission of permissions){
            await Role.updateOne({_id: permission.id}, {permissions: permission.permission})
        }
        req.flash('success', 'Permissions updated successfully');

    } catch (error) {
        req.flash('error', "Error updating permissions");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
};
