var mongoose = require('mongoose');
var cynNavigationModel = new mongoose.Schema({
    text: String,
    to: String,
    icon: String,
    isActive: Boolean,
    createdBy: String,
    createdOn: Date,
    modifiedBy: String,
    modifiedOn: Date
});
mongoose.model('CynNavigationModel',cynNavigationModel);