const express = require('express');
const reportController = require('../controllers/report');
const { check, body } = require('express-validator');
const isAuth = require('../middleware/is-Auth');
const isAdmin = require('../middleware/is-Admin');
const router = express.Router();

// Add new contact to the database
router.post('/create', reportController.create);

// Fetch a particular contact from the database
router.get('/fetch/:id', reportController.getOne);

// Fetch all contacts from the database
router.get('/fetchAll', reportController.getAll);

// Delete a contact message in the database
router.delete('/delete/:id', isAdmin, reportController.deleteOne);

module.exports = router;