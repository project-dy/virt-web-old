const express = require('express');

const router = express.Router();

router.use(express.static('build'));

module.exports = router;