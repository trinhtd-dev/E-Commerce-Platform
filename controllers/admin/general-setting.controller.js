const GeneralSetting = require("../../models/general-setting.model")


// [GET] /admin/general-setting
module.exports.index = async (req, res) => {
    const generalSetting = await GeneralSetting.findOne({});
    res.render('admin/pages/general-setting/index',{
        title: 'General Setting',
        generalSetting: generalSetting,
    });
}
// [PATCH] /admin/general-setting
module.exports.indexPatch =  async (req, res) => {
     const generalSetting = await GeneralSetting.findOne({});
     if(generalSetting){
        await GeneralSetting.updateOne({ _id: generalSetting.id }, {
            ...req.body,
        });
        res.redirect('/admin/general-setting');
     }
     else{
        newGeneralSetting = new GeneralSetting(req.body);
        await newGeneralSetting.save();
        req.flash('success', "updated General Settings successfully");
        res.redirect('/admin/general-setting');
     }   
}

