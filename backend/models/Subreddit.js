import mongoose from 'mongoose';

const subredditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 21
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${this.name}`;
    }
  },
  banner: {
    type: String,
    default: null
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  rules: [{
    title: String,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Subreddit = mongoose.model('Subreddit', subredditSchema);

export default Subreddit;
