const express = require('express');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.get('/checkAuth', authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    status:200,
    message: 'authenticated',
    user: req.user, // contains userId, email, etc. from decoded JWT
  });
});



module.exports = router;