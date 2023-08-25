const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$users = require(__module_dir + '/users.module.js');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async function (req, res, next) {
    const data = {
        username: req.body.username,
        password: req.body.password
    }
    console.log(data.username, data.password)
    helper.sendResponse(res, await m$users.login(data));

})

module.exports = router;