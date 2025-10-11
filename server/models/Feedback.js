const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  name: String,
  email: String,
  message: String,
  createdAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model('Feedback', FeedbackSchema);
