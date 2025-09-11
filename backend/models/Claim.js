const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claim: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    default: 'en',
    enum: ['en', 'es', 'zh', 'ar', 'hi', 'ko', 'vi', 'tl']
  },
  community: {
    type: String,
    trim: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'verified', 'rejected'],
    default: 'pending'
  },
  verdict: {
    type: String,
    enum: ['true', 'false', 'misleading', 'unverified'],
    default: 'unverified'
  },
  explanation: {
    type: String,
    trim: true
  },
  sources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['government', 'news', 'academic', 'ngo', 'other']
    }
  }],
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  shareCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
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
claimSchema.index({ claim: 'text', explanation: 'text' });
claimSchema.index({ status: 1, verdict: 1 });
claimSchema.index({ language: 1, community: 1 });

module.exports = mongoose.model('Claim', claimSchema);

