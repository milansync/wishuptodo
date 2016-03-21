/**
 * Created by shubh on 15/1/16.
 */
var nodemailer = require('nodemailer');
var Todo=require('./models/todo');
var mongoose = require('mongoose');
var database = require('./config/database');
var config=require('./config/auth');
mongoose.connect(database.url);
var transporter = nodemailer.createTransport('smtps://'+config.gmail.user+'%40gmail.com:'+config.gmail.password+'@smtp.gmail.com'
);

Todo.find({}, function(err, user) {

    user.forEach(function(user) {
        var todo = user.todo;
        todo.forEach(function(todo){
            var currtime = new Date();
            if(todo.date-currtime==10*60000)
            {
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: config.gmail.user+'@gmail.com', // sender address
                    to: user.email, // list of receivers
                    subject: 'Todo Remainder', // Subject line
                    text: 'Your todo ('+ todo.text +' )is about to end in 10 min. pls check ', // plaintext body

                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    else{
                    console.log('Message sent: ' + info.response);
                }
                });
            }
        });

    });


});




