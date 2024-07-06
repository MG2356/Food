const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup' },
  type: String, // Weekly or bi-weekly subscription
  startDate: Date,
  endDate: Date,
});

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

module.exports = SubscriptionModel;

    
