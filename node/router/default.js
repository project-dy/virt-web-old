const express = require('express');
const logger = require('../logger');

const router = express.Router();

router.use(express.static('build'));
logger.verbose('Registered default router');

module.exports = router;