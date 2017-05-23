var seneca = require('seneca')();

seneca.add({cmd: 'wordcount'}, function(msg, respond) { // add producers
    var length = msg.phrase.split(' ').length;
    respond(null, {words: length});
});

seneca.add({cmd: 'wordcount', skipShort: true}, function(msg, respond) {
    var words = msg.phrase.split(' ');
    var validWords = 0;
    for (var i = 0; i < words.length; i++) {
        if (words[i].length > 3) {
            validWords++;
        }
    }
    respond(null, {words: validWords}); // output the count of word which length gte 3
});

// consumer
seneca.act({cmd: 'wordcount', phrase: 'Hello world this is Seneca'}, function(err, response) {
    console.log(response);
});

seneca.act({cmd: 'wordcount', skipShort: true, phrase: 'Hello world this is Seneca'}, function(err, response) {
    console.log(response); // response to the skipshort
});
