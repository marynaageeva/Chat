var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('connected to mongodb')
    }
});

var chatSchema = mongoose.Schema({
    nick: String,
    msg: String,
    created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('MyChat', chatSchema);

module.exports = Chat;