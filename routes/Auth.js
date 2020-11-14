const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-Auth');
const isAdmin = require('../middleware/is-Admin');
const User = require('../models/User');

const router = express.Router();

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Email exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  authController.signup
);

router.post('/adminSignup', isAdmin,
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Email exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  authController.adminSignup
);

router.post('/login', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),  
    body('password', 'Password has to be valid')
      .isAlphanumeric()
      .trim()
      .isLength({min: 8}),
  ],  
  authController.login
);

router.post('/adminLogin', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),  
  body('password', 'Password has to be valid')
    .isAlphanumeric()
    .trim()
    .isLength({min: 8}),
],  
authController.adminLogin
);

router.get('/getMe', isAuth, authController.getMe);

router.get('/getUser/:id', isAuth, authController.getUser);

router.post('/forgotPassword', authController.forgetPassword);

router.put('/resetPassword/:token', authController.resetPassword);

router.put('/changePassword', isAuth, [
  body('newPassword', 'New Password has to be valid')
    .isAlphanumeric()
    .trim()
    .isLength({min: 8}),
  ],
 authController.changePassword);
 
router.get('/getAllAdmin', isAdmin, authController.getAllAdmins);

router.get('/getAllIndividuals', isAdmin, authController.getAllIndividuals);

router.get('/getAllOrganization', isAdmin, authController.getAllOrganizations);

router.get('/getAllAdmin', isAdmin, authController.getAllAdmins);

router.get('/getAllUsers', isAdmin, authController.getAllUsers);

router.delete('/deleteUser/:id', isAdmin, authController.deleteUser);

//router.post('/newsletter', authController.saveEmail);

module.exports = router;