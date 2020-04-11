var express = require('express');
import * as controller from './webpage.controller';
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:url', controller.show);
router.put('/:url', controller.upsert);
router.delete('/:url', auth.hasRole('admin'), controller.destroy);

module.exports = router;
