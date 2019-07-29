var mongoose = require('mongoose');  
const Schema = mongoose.Schema;

var schema = new Schema({
 img: { data: Buffer, contentType: String },
 userID : Schema.Types.ObjectId,
 imgBase64 : String
});

var profilePics = module.exports = mongoose.model('profilePics', schema);
module.exports = profilePics;