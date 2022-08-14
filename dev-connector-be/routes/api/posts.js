const express = require('express');
const router = express.Router();

// @route GET api/posts/
// @desc posts endpoint
// @access Public

router.get('/', (req, res)=>res.json({msg: "posts is working."}))

module.exports = router