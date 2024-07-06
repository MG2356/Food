const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subscriptionType: {
    type: String,
    enum: ['weekly', 'bi-weekly'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

module.exports = SubscriptionModel;
