const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/ambassadors/toolkit
// @desc    Get ambassador toolkit resources
// @access  Private (Ambassador)
router.get('/toolkit', auth, authorize('ambassador'), async (req, res) => {
  try {
    // Placeholder for toolkit functionality
    res.json({ 
      message: 'Ambassador toolkit endpoint - to be implemented',
      resources: []
    });
  } catch (error) {
    console.error('Get toolkit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ambassadors/outreach
// @desc    Log outreach activity
// @access  Private (Ambassador)
router.post('/outreach', auth, authorize('ambassador'), [
  body('activity').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('date').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Placeholder for outreach logging
    res.status(201).json({ 
      message: 'Outreach activity logged successfully',
      activity: req.body
    });
  } catch (error) {
    console.error('Log outreach error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
