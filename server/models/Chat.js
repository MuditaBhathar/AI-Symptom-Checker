const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  symptom: String,
  messages: Array,
  aiSummary: Object,
  createdAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model('Chat', ChatSchema);
