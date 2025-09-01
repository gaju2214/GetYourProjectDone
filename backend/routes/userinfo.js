const express = require('express');
const router = express.Router();
const userinfoController = require('../controllers/userinfoController');

router.get('/', userinfoController.getAllUserInfos);
router.get('/:id', userinfoController.getUserInfoById);
router.post('/', userinfoController.createUserInfo);
router.put('/:id', userinfoController.updateUserInfo);
router.delete('/:id', userinfoController.deleteUserInfo);

module.exports = router;
