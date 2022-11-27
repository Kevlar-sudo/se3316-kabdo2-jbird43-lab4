const router = require('express').Router();
const verify = require('./VerifyToken');

//For functions that need authentication to use
router.get('/', verify, (req, res) => {

    res.json({posts: {title: 'posts', description: 'DATA YOU NEED TO AUTH TO USE'}});

})

module.exports = router;