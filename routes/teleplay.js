const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const service = require('../services/teleplay');

const resetPwdVaildator = [
    query('text').not().isEmpty().withMessage('不能为空'),
]


router.get('/getList', service.getList);

router.get('/details',service.getTeleplayDetails);





module.exports = router;