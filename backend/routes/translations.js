const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Translation = require('../models/Translation');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/translations
// @desc    Get translations with filtering and search
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('language').optional().isIn(['es', 'zh', 'ar', 'hi', 'ko', 'vi', 'tl']),
  query('category').optional().isIn(['voting', 'registration', 'identification', 'deadlines', 'locations', 'general']),
  query('search').optional().trim(),
  query('verified').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.language) filter.language = req.query.language;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.verified !== undefined) filter.verified = req.query.verified === 'true';

    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const translations = await Translation.find(filter)
      .populate('verifiedBy', 'firstName lastName')
      .sort({ usageCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Translation.countDocuments(filter);

    res.json({
      translations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get translations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/translations/categories
// @desc    Get translation categories and counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Translation.aggregate([
      {
        $group: {
          _id: { category: '$category', language: '$language' },
          count: { $sum: 1 },
          verified: { $sum: { $cond: ['$verified', 1, 0] } }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          languages: {
            $push: {
              language: '$_id.language',
              count: '$count',
              verified: '$verified'
            }
          },
          totalCount: { $sum: '$count' },
          totalVerified: { $sum: '$verified' }
        }
      },
      { $sort: { totalCount: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/translations/:id
// @desc    Get single translation by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id)
      .populate('verifiedBy', 'firstName lastName')
      .populate('relatedTerms', 'english translated language');

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    // Increment usage count
    translation.usageCount += 1;
    await translation.save();

    res.json({ translation });
  } catch (error) {
    console.error('Get translation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/translations
// @desc    Create a new translation (organizers only)
// @access  Private (Organizers)
router.post('/', auth, authorize('organizer', 'admin'), [
  body('english').trim().notEmpty(),
  body('translated').trim().notEmpty(),
  body('language').isIn(['es', 'zh', 'ar', 'hi', 'ko', 'vi', 'tl']),
  body('explanation').trim().notEmpty(),
  body('category').isIn(['voting', 'registration', 'identification', 'deadlines', 'locations', 'general']),
  body('audioUrl').optional().isURL(),
  body('context').optional().trim(),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      english,
      translated,
      language,
      explanation,
      category,
      audioUrl,
      context,
      difficulty,
      tags
    } = req.body;

    const translation = new Translation({
      english,
      translated,
      language,
      explanation,
      category,
      audioUrl,
      context,
      difficulty: difficulty || 'beginner',
      tags: tags || [],
      verified: true,
      verifiedBy: req.userId,
      verifiedAt: new Date()
    });

    await translation.save();

    res.status(201).json({
      message: 'Translation created successfully',
      translation
    });
  } catch (error) {
    console.error('Create translation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/translations/:id/verify
// @desc    Verify a translation (organizers only)
// @access  Private (Organizers)
router.put('/:id/verify', auth, authorize('organizer', 'admin'), [
  body('verified').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { verified } = req.body;

    const translation = await Translation.findById(req.params.id);
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    translation.verified = verified;
    translation.verifiedBy = req.userId;
    translation.verifiedAt = new Date();

    await translation.save();

    res.json({
      message: `Translation ${verified ? 'verified' : 'unverified'} successfully`,
      translation
    });
  } catch (error) {
    console.error('Verify translation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/translations/:id/feedback
// @desc    Submit feedback on a translation
// @access  Private
router.post('/:id/feedback', auth, [
  body('helpful').isBoolean(),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { helpful, comment } = req.body;

    const translation = await Translation.findById(req.params.id);
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    // Check if user already provided feedback
    const existingFeedback = translation.feedback.find(f => f.user.toString() === req.userId.toString());
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }

    translation.feedback.push({
      user: req.userId,
      helpful,
      comment
    });

    await translation.save();

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/translations/stats/overview
// @desc    Get translation statistics overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Translation.aggregate([
      {
        $group: {
          _id: null,
          totalTranslations: { $sum: 1 },
          verifiedTranslations: { $sum: { $cond: ['$verified', 1, 0] } },
          totalUsage: { $sum: '$usageCount' },
          languages: { $addToSet: '$language' },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalTranslations: 1,
          verifiedTranslations: 1,
          totalUsage: 1,
          languageCount: { $size: '$languages' },
          categoryCount: { $size: '$categories' },
          verificationRate: {
            $multiply: [
              { $divide: ['$verifiedTranslations', '$totalTranslations'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (error) {
    console.error('Get translation stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

