const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');
const jwt = require('jsonwebtoken');
const m$users = require(__module_dir + '/users.module.js');


function verifyToken(req, res, next) {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).send('Acces denied.');
  
  const secret_key = 'tes'
  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
        console.log(err.message)    
        return res.status(403).send(err.message);
    }
    req.user = user;
    next();
  });
}

/**Show all task */
router.get('/', verifyToken, async (req, res, next) => {
    const userId = req.user.userId    
    const listTask = await m$task.show(userId)
    helper.sendResponse(res, listTask);
    // helper.sendResponse(res, listTask);
});

/**Show Task by ID*/
router.get('/id', verifyToken, async function (req, res, next) {
    const userId = req.user.userId;
    const idTask = req.query.id;
    const listTask = await m$task.show_by_id(idTask, userId)
    helper.sendResponse(res, listTask);
});

/**Create task */
router.post('/', verifyToken, async function (req, res, next) {
    const userId = req.user.userId;
    const addTask = await m$task.add(req.body, userId)
    helper.sendResponse(res, addTask);
});

/**Update Task */
router.put('/:id', verifyToken, async function (req, res, next) {
    const userId = req.user.userId;
    const taskID = req.params.id;    
    const updateTask = await m$task.update(taskID, req.body, userId);
    helper.sendResponse(res, updateTask);
});

/**Delete Task */
router.delete('/:id', verifyToken, async (req, res, next) => {
    const userId = req.user.userId;
    const taskID = req.params.id;
    const deleteTask = await m$task.delete(taskID, userId);
    helper.sendResponse(res, deleteTask);
})



module.exports = router;
