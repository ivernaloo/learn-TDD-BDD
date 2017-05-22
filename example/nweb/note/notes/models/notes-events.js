'use strict';

const EventEmitter = require('events'); // custom event source
const util         = require('util');

const log   = require('debug')('notes:router-events');
const error = require('debug')('notes:error');

class NotesEmitter extends EventEmitter {} // extend event source

module.exports = new NotesEmitter(); // export to outside

// noteCreated event
module.exports.noteCreated = function(note) {
    log('noteCreated '+ util.inspect(note));
    module.exports.emit('notecreated', note);
};

// event
module.exports.noteUpdate = function(note) {
    log('noteUpdate '+ util.inspect(note));
    module.exports.emit('noteupdate', note);
};

// event
module.exports.noteDestroy = function(data) {
    log('noteDestroy '+ util.inspect(data));
    module.exports.emit('notedestroy', data);
};
