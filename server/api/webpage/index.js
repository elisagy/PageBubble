var express = require('express');
var controller = require('./webpage.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:url', controller.show);
router.put('/:url', controller.upsert);
router.delete('/:url', controller.destroy);

module.exports = router;
