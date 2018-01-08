var mongoose = require('mongoose');
var dummySchema = new mongoose.Schema({
    username: String,
    address: String,
    mobile: String,
    qualification : String,
    age : Number,
    dob : Date
});
mongoose.model('Dummy',dummySchema);