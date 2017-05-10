/*
* this is a filesystem database storage
* in-memory data
* */
'use strict';

const fs    = require('fs-extra'); // fs method
const path  = require('path');  // path
const util  = require('util'); // util

const log   = require('debug')('notes:fs-model'); // log
const error = require('debug')('notes:error'); // log err

const Note = require('./Note'); // Note constructor

/*
* notes directory
* */
function notesDir() {
    const dir = process.env.NOTES_FS_DIR || "notes-fs-data";
    return new Promise((resolve, reject) => {
        fs.ensureDir(dir, err => { // why not use fs.existsSync, native method through sync style. but in the fs-extra, async do
            if (err) reject(err);
            else resolve(dir); // return the directory path
        });
    });
}

function filePath(notesdir, key) {
    return path.join(notesdir, key + ".json"); // log file destination
}

function readJSON(notesdir, key) {
    const readFrom = filePath(notesdir, key);// get the path
    return new Promise((resolve, reject) => {
        fs.readFile(readFrom, 'utf8', (err, data) => {
            if (err) return reject(err);
            log('readJSON '+ data);
            resolve(Note.fromJSON(data));   // write the data and return.
                                            // get the data string to JSON object
        });
    });
}

exports.update = exports.create = function(key, title, body) {
    return notesDir().then(notesdir => {
        if (key.indexOf('/') >= 0) throw new Error(`key ${key} cannot contain '/'`); // only sub directory
        var note = new Note(key, title, body);
        const writeTo = filePath(notesdir, key); // the location of the log file, caculate the absoulte path
        const writeJSON = note.JSON; // json data
        log('WRITE '+ writeTo +' '+ writeJSON);
        return new Promise((resolve, reject) => {
            fs.writeFile(writeTo, writeJSON, 'utf8', err => { // write file
                if (err) reject(err);
                else resolve(note);
            });
        });
    });
};

exports.read = function(key) {
    return notesDir().then(notesdir => {
        return readJSON(notesdir, key).then(thenote => { // read the file from filesystem
            log('READ '+ notesdir +'/'+ key +' '+ util.inspect(thenote)); // read the detail information
            return thenote;
        });
    });
};

/*
* destroy the item
* */
exports.destroy = function(key) {
    return notesDir().then(notesdir => {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath(notesdir, key), err => { // delete the file
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

exports.keylist = function() {
    return notesDir().then(notesdir => { // pass the directory path as parameters
        return new Promise((resolve, reject) => {
            fs.readdir(notesdir, (err, filez) => {
                if (err) return reject(err);
                if (!filez) filez = [];
                resolve({ notesdir, filez }); // return the file list collection
            });
        });
    })
    .then(data => {
        log('keylist dir='+ data.notesdir +' files='+ util.inspect(data.filez));
        var thenotes = data.filez.map(fname => { // iterate array async simpel way
            var key = path.basename(fname, '.json'); // get the basename from the path without ext name
            log('About to READ '+ key);
            return readJSON(data.notesdir, key).then(thenote => {
                return thenote.key;
            });
        });
        return Promise.all(thenotes); // the thenotes is a collection of series promise, which is the result of returning object
    });
};

exports.count   = function()    {
    return notesDir().then(notesdir => {
        return new Promise((resolve, reject) => {
            fs.readdir(notesdir, (err, filez) => {
                if (err) return reject(err);
                resolve(filez.length);
            });
        });
    });
};
