var mongoose = require('mongoose');
var CynAuthModel = new mongoose.Schema({
    username: String,
    password: String
});
mongoose.model('CynAuthModel',CynAuthModel);