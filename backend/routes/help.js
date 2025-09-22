const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/help/faq
// @desc    Get frequently asked questions
// @access  Public
router.get('/faq', async (req, res) => {
  try {
    // Placeholder for FAQ functionality
    res.json({ 
      message: 'FAQ endpoint - to be implemented',
      faqs: []
    });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/help/contact
// @desc    Submit contact form
// @access  Public
router.post('/contact', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().notEmpty(),
  body('message').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Placeholder for contact form submission
    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      contact: req.body
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/help/languages
// @desc    Get supported languages
// @access  Public
router.get('/languages', async (req, res) => {
  try {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'zh', name: '中文' },
      { code: 'ar', name: 'العربية' },
      { code: 'hi', name: 'हिन्दी' },
      { code: 'ko', name: '한국어' },
      { code: 'vi', name: 'Tiếng Việt' },
      { code: 'tl', name: 'Filipino' }
    ];
    
    res.json({ languages });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
