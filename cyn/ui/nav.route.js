var express = require('express');
var moment = require('moment');
var router = express.Router();
var mongoose = require('mongoose');
var genericAPI = require('../../utils/genericAPI');
var cynNavigationModel = mongoose.model('CynNavigationModel');

/* GET variants listing. */
router.get('/', function(req, res, next) {
  genericAPI.get(cynNavigationModel,req, res, next)
});
router.post('/', function(req, res, next) {
  var obj = new cynNavigationModel();
  genericAPI.post(cynNavigationModel,req, res, next)
//   req.body.text && (obj.text = req.body.text);
//   req.body.to && (obj.to = req.body.to);
//   req.body.icon && (obj.icon = req.body.icon);
//   req.body.isActive && (obj.isActive = req.body.isActive);
//   obj.save(function(err,data){
//     if(err){
//       return res.send(500,err);
//     }
//     return res.json(data);
//   });

});


module.exports = router;
