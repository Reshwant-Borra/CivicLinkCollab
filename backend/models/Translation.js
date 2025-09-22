const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  english: {
    type: String,
    required: true,
    trim: true
  },
  translated: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: ['es', 'zh', 'ar', 'hi', 'ko', 'vi', 'tl']
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['voting', 'registration', 'identification', 'deadlines', 'locations', 'general'],
    default: 'general'
  },
  audioUrl: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  usageCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  context: {
    type: String,
    trim: true
  },
  relatedTerms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Translation'
  }],
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: Boolean,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for search functionality
translationSchema.index({ english: 'text', translated: 'text', explanation: 'text' });
translationSchema.index({ language: 1, category: 1 });
translationSchema.index({ verified: 1 });

module.exports = mongoose.model('Translation', translationSchema);

