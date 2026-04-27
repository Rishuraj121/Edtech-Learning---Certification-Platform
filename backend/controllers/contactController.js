const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    const contact = await Contact.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contact
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error submitting contact form'
    });
  }
};

// @desc    Get all contacts (admin only)
// @route   GET /api/contact
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching contacts'
    });
  }
};

// @desc    Reply to a contact message (admin only)
// @route   PUT /api/contact/:id/reply
exports.replyContact = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ success: false, message: 'Please provide a reply message' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    contact.reply = reply;
    contact.status = 'replied';
    await contact.save();

    res.json({
      success: true,
      message: 'Reply sent successfully',
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error replying to message'
    });
  }
};
