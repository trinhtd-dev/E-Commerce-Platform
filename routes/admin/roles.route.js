const express = require('express');
const router = express.Router();
const rolesController = require("../../controllers/admin/roles.controller");


router.get('/', rolesController.index);
router.get('/create', rolesController.create);
router.post('/create', rolesController.createPost);
router.get('/edit/:id', rolesController.edit);
router.patch('/edit/:id', rolesController.editPost);
router.get('/detail/:id', rolesController.detail);
router.delete('/delete/:id', rolesController.delete);


module.exports = router;