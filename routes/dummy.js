var express = require('express');
var moment = require('moment');
var router = express.Router();
var mongoose = require('mongoose');
var DummyModel = mongoose.model('Dummy');
var genericAPI = require('../utils/genericAPI');

/* GET variants listing. */
router.get('/', function(req, res, next) {
  genericAPI.getList(DummyModel,req, res, next);
});

router.get('/:id', function(req, res, next) {
  DummyModel.findById(req.params.id,function(err,dummyObj){
    if (err) {
       return res.status(500).send(err);
    } 
    return res.json(dummyObj);
    
  });  
});
router.post('/', function(req, res, next) {
  var dummyObj = new DummyModel();
  req.body.username && (dummyObj.username = req.body.username);
  req.body.address && (dummyObj.address = req.body.address);
  req.body.mobile && (dummyObj.mobile = req.body.mobile);
  req.body.qualification && (dummyObj.qualification = req.body.qualification);
  req.body.age && (dummyObj.age = req.body.age);
  req.body.dob && (dummyObj.dob = new Date(req.body.dob));

  dummyObj.save(function(err,data){
    if(err){
      return res.send(500,err);
    }
    return res.json(data);
  });

});

router.put('/:id', function(req, res, next) {
  DummyModel.findById(req.params.id,function(err,dummyObj){
    if (err) {
       return res.status(500).send(err);
    } 
    req.body.username && (dummyObj.username = req.body.username);
    req.body.address && (dummyObj.address = req.body.address);
    req.body.mobile && (dummyObj.mobile = req.body.mobile);
    req.body.qualification && (dummyObj.qualification = req.body.qualification);
    req.body.age && (dummyObj.age = req.body.age);
    req.body.dob && (dummyObj.dob = moment(req.body.dob, 'DD-MM-YYYY').toDate());

    dummyObj.save(function(err,data){
      if(err){
        return res.send(500,err);
      }
      return res.json(data);
    });
  });  

});
module.exports = router;
