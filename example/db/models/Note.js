/*
* Note model for constructor
* */

'use strict';


const util = require('util');

const log   = require('debug')('notes:Note');
const error = require('debug')('notes:error');

/*
* constructor
* */
module.exports = class Note {
    constructor(key, title, body) {
        this.key = key;
        this.title = title;
        this.body = body;
    }
    
    // get method
    get JSON() {
        return JSON.stringify({
            key: this.key, title: this.title, body: this.body
        });
    }
    
    // static method
    // get the json  from string and store as Note instance format
    static fromJSON(json) {
        var data = JSON.parse(json);
        var note = new Note(data.key, data.title, data.body);
        log(json +' => '+ util.inspect(note));
        return note;
    }
};