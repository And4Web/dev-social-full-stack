const express = require('express');
const router = express.Router();

// @route GET api/profile/
// @desc profile endpoint
// @access Public

router.get('/', (req, res)=>res.json({msg: "profile is working."}))

module.exports = router