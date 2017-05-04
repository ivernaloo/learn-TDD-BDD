var DB = require('../db');

var COLLECTION = 'comments';

// Get all comments
exports.all = function(cb) {
    db = DB.getDB();
    db.collection(COLLECTION).find().toArray(cb)
};

// Create new comment and return its id
exports.create = function(user, text, cb) {
    db = DB.getDB();
    db.collection(COLLECTION).insert({user: user, text: text}, function(err, docs) {
        if (err) return cb(err);
        cb(null, docs[0]._id)
    })
};

// Remove a comment
exports.remove = function(id, cb) {
    db = DB.getDB();
    db.collection(COLLECTION).remove({_id:id}, function(err, result) {
        cb(err)
    })
};