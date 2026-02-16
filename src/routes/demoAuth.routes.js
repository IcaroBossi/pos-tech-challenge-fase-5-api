const { Router } = require('express');
const validate = require('../middlewares/validate');
const { demoLoginQuery } = require('../schemas');
const { demoLogin } = require('../controllers/demoAuth.controller');

const router = Router();

router.get('/login', validate({ query: demoLoginQuery }), demoLogin);

module.exports = router;
