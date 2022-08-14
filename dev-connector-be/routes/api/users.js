const express = require('express');
const router = express.Router();

// @route GET api/users/
// @desc users endpoint
// @access Public

router.get('/', (req, res)=>res.json({msg: "users is working."}))

module.exports = router