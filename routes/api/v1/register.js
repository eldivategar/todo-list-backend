const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$users = require(__module_dir + '/users.module.js');
const bycrypt = require('bcryptjs');

router.post('/', async function (req, res, next) {
    const Password = req.body.password;
    const data = {
        username: req.body.username,
        password: bycrypt.hashSync(Password, 8)
    }
    
    console.log(data.username, data.password)
    helper.sendResponse(res, await m$users.register(data));
})

module.exports = router;

