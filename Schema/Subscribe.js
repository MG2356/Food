// const mongoose = require('mongoose');

// const subscriptionSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   subscriptionType: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

// module.exports = SubscriptionModel;
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup' },
  type: String, // Weekly or bi-weekly subscription
  startDate: Date,
  endDate: Date,
});

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

module.exports = SubscriptionModel;


