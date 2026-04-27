const express = require('express');
const router = express.Router();
const { submitContact, getContacts, replyContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/reply', protect, adminOnly, replyContact);

module.exports = router;
