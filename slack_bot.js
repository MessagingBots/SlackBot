//Botkit loaded in
var Botkit = require('./node_modules/botkit/lib/Botkit.js');

//the bot controller with JSON database
var controller = Botkit.slackbot({
  json_file_store: 'path_to_json_database',
  debug: true
});

//spawn a bot based on the API Token
var bot = controller.spawn({
  token: 'xoxb-77604885776-8WlYCOYhUOFF3m8XAQTunNAH'
}).startRTM()

var apiai = require('botkit-middleware-apiai')({
    token: '8c88f76b8c224b55b7f1e9d33a120a3a'
});

controller.middleware.receive.use(apiai.receive);


//Welcoming message
controller.hears("Hi",['direct_message'],function(bot,message){
  controller.storage.users.get(message.user,function(err,user){   //greet user if user exists in bot's memorys
    if(user && user.name){
      bot.reply(message, "Hi " + user.name + " what can I help you with?");
    }
    else{       //else inquire for their name
        bot.reply(message,"We've never met. What is your name?");
        controller.hears("(.*)",['direct_message'],function(bot,message){
          var name = message.match[1];
          if(!user){
            user = {        //create user object based on this message's user
              id : message.user
            };
          }
        user.name = name;     //assign name to this object
        controller.storage.users.save(user,function(err,id){});
      })
    }
  });
});

controller.hears(['Zach'],'direct_message',apiai.hears,function(bot, message) {
  bot.reply(message,message.fulfillment.speech);
});

/*

The slack bot should be able to do the following
  1. when a user requests a pizza:
  2. query for toppings
  3. when receive done
  4. launch up dominos.com
*/
