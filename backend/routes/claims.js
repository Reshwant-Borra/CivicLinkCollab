const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Claim = require('../models/Claim');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/claims
// @desc    Get all claims with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'in-progress', 'verified', 'rejected']),
  query('verdict').optional().isIn(['true', 'false', 'misleading', 'unverified']),
  query('language').optional().isIn(['en', 'es', 'zh', 'ar', 'hi', 'ko', 'vi', 'tl']),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.verdict) filter.verdict = req.query.verdict;
    if (req.query.language) filter.language = req.query.language;
    if (req.query.community) filter.community = req.query.community;

    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const claims = await Claim.find(filter)
      .populate('submittedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Claim.countDocuments(filter);

    res.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/claims/trending
// @desc    Get trending claims by community and language
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const trendingClaims = await Claim.aggregate([
      { $match: { status: 'verified' } },
      {
        $group: {
          _id: { language: '$language', community: '$community' },
          claims: { $push: { claim: '$claim', viewCount: '$viewCount' } },
          totalViews: { $sum: '$viewCount' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    res.json({ trendingClaims });
  } catch (error) {
    console.error('Get trending claims error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/claims/:id
// @desc    Get single claim by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .populate('feedback.user', 'firstName lastName');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Increment view count
    claim.viewCount += 1;
    await claim.save();

    res.json({ claim });
  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/claims
// @desc    Submit a new claim for fact-checking
// @access  Private
router.post('/', auth, [
  body('claim').trim().notEmpty().isLength({ min: 10, max: 500 }),
  body('language').isIn(['en', 'es', 'zh', 'ar', 'hi', 'ko', 'vi', 'tl']),
  body('community').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { claim, language, community } = req.body;

    const newClaim = new Claim({
      claim,
      language,
      community,
      submittedBy: req.userId
    });

    await newClaim.save();
    await newClaim.populate('submittedBy', 'firstName lastName email');

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim: newClaim
    });
  } catch (error) {
    console.error('Submit claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/claims/:id/review
// @desc    Review and update a claim (organizers only)
// @access  Private (Organizers)
router.put('/:id/review', auth, authorize('organizer', 'admin'), [
  body('status').isIn(['in-progress', 'verified', 'rejected']),
  body('verdict').optional().isIn(['true', 'false', 'misleading', 'unverified']),
  body('explanation').optional().trim(),
  body('sources').optional().isArray(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, verdict, explanation, sources, priority } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const updates = {
      status,
      reviewedBy: req.userId,
      reviewedAt: new Date()
    };

    if (verdict) updates.verdict = verdict;
    if (explanation) updates.explanation = explanation;
    if (sources) updates.sources = sources;
    if (priority) updates.priority = priority;

    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('submittedBy', 'firstName lastName email')
     .populate('reviewedBy', 'firstName lastName');

    res.json({
      message: 'Claim reviewed successfully',
      claim: updatedClaim
    });
  } catch (error) {
    console.error('Review claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/claims/:id/feedback
// @desc    Submit feedback on a claim
// @access  Private
router.post('/:id/feedback', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Check if user already provided feedback
    const existingFeedback = claim.feedback.find(f => f.user.toString() === req.userId.toString());
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }

    claim.feedback.push({
      user: req.userId,
      rating,
      comment
    });

    await claim.save();

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/claims/:id/share
// @desc    Track claim sharing
// @access  Public
router.post('/:id/share', async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.shareCount += 1;
    await claim.save();

    res.json({ message: 'Share tracked successfully' });
  } catch (error) {
    console.error('Track share error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

