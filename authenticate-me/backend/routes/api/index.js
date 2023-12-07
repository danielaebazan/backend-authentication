// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);


//test routing, POST, use fetch 
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

// test setTokenCookie function by getting the demo user and calling setTokenCookie
// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
      where: {
        username: 'Demo-lition'
      }
    });
  setTokenCookie(res, user);
  return res.json({ user });
});

// test restoreUser middleware by connecting the middleware and checking whether or not 
    //the req.user key has been populated by the middleware properly.

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
router.get(
  '/restore-user',
  restoreUser,
  (req, res) => {
    return res.json(req.user);
  }
);

// test requireAuth middleware
// If there is no session user, the route will return an error. 
// Otherwise it will return the session user's information.

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);





module.exports = router;