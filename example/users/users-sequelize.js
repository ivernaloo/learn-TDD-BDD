'use strict';

/*
* ORM logic proceed
* 2017-5-16
* */
const Sequelize = require("sequelize"); // orm
const jsyaml    = require('js-yaml'); // parser
const fs        = require('fs');
const util      = require('util');

const log   = require('debug')('users:model-users');
const error = require('debug')('users:error');

var SQUser;
var sequlz;

// connect instance
exports.connectDB = function() {
    
    if (SQUser) return SQUser.sync();
    
    return new Promise((resolve, reject) => {
        fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8', (err, data) => { // load config file
            if (err) reject(err);
            else resolve(data);
        });
    })
    .then(yamltext => {
        return jsyaml.safeLoad(yamltext, 'utf8'); // load configuration file
    })
    .then(params => {
        log('Sequelize params '+ util.inspect(params)); // inspect the params details
        
        if (!sequlz) sequlz = new Sequelize(params.dbname, params.username, params.password, params.params); // sequelize instance
        
        // These fields largely come from the Passport / Portable Contacts schema.
        // See http://www.passportjs.org/docs/profile
        //
        // The emails and photos fields are arrays in Portable Contacts.  We'd need to set up
        // additional tables for those.
        //
        // The Portable Contacts "id" field maps to the "username" field here
        if (!SQUser) SQUser = sequlz.define('User', { // User Object
            username: { type: Sequelize.STRING, unique: true },
            password: Sequelize.STRING,
            provider: Sequelize.STRING,
            familyName: Sequelize.STRING,
            givenName: Sequelize.STRING,
            middleName: Sequelize.STRING,
            emails: Sequelize.STRING(2048),
            photos: Sequelize.STRING(2048)
        });
        return SQUser.sync();
    });
};

exports.create = function(username, password, provider, familyName, givenName, middleName, emails, photos) {
    return exports.connectDB().then(SQUser => { // pass the parameters into the create function
        return SQUser.create({
            username: username,
            password: password,
            provider: provider,
            familyName: familyName,
            givenName: givenName,
            middleName: middleName,
            emails: JSON.stringify(emails),
            photos: JSON.stringify(photos)
        });
    });
};

exports.update = function(username, password, provider, familyName, givenName, middleName, emails, photos) {
    return exports.find(username).then(user => {    // find first then check the exist status
        return user ? user.updateAttributes({   // update instance
            password: password,
            provider: provider,
            familyName: familyName,
            givenName: givenName,
            middleName: middleName,
            emails: JSON.stringify(emails),
            photos: JSON.stringify(photos)
        }) : undefined;
    });
};

exports.destroy = function(username) {
    return exports.connectDB().then(SQUser => {
        return SQUser.find({ where: { username: username } })
    })
    .then(user => {
        if (!user) throw new Error('Did not find requested '+ username +' to delete');
        user.destroy(); // destroy the instance
        return;
    });
};

exports.find = function(username) {
    log('find  '+ username);
    return exports.connectDB().then(SQUser => {
        return SQUser.find({ where: { username: username } })
    })
    .then(user => user ? exports.sanitizedUser(user) : undefined);  // export and fresh format
};

exports.userPasswordCheck = function(username, password) {
    return exports.connectDB().then(SQUser => {
        return SQUser.find({ where: { username: username } }) // get the password
    })
    .then(user => {
        log('userPasswordCheck query= '+ username +' '+ password +' user= '+ user.username +' '+ user.password);
        if (!user) {
            return { check: false, username: username, message: "Could not find user" };
        } else if (user.username === username && user.password === password) {
            return { check: true, username: user.username }; // response user instance
        } else {
            return { check: false, username: username, message: "Incorrect password" }; // response wrong response
        }
    });
};

exports.findOrCreate = function(profile) {  // find and craete
    return exports.find(profile.id).then(user => { // pipeline syntax from profile.id get the user instance and create?
        if (user) return user; // if exist then return else create new instance
        return exports.create(profile.id, profile.password, profile.provider,
                       profile.familyName, profile.givenName, profile.middleName,
                       profile.emails, profile.photos);
    });
};

exports.listUsers = function() {
    return exports.connectDB()
    .then(SQUser => SQUser.findAll({}) ) // get all
    .then(userlist => userlist.map(user => exports.sanitizedUser(user))) // format
    .catch(err => console.error(err)); // put the error
};

// format the data
exports.sanitizedUser = function(user) {
    log(util.inspect(user));
    return {
        id: user.username,
        username: user.username,
        provider: user.provider,
        familyName: user.familyName,
        givenName: user.givenName,
        middleName: user.middleName,
        emails: user.emails,
        photos: user.photos
    };
};
