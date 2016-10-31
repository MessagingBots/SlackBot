//Botkit and APIAI
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var wit = require('botkit-middleware-witai')({
    token: 'ZJJ5TKZXOVOE72O6STFSWO5YXE5QIRAX'
});


//the bot controller with JSON database
var controller = Botkit.slackbot({
  json_file_store: 'path_to_json_database',
  debug: false
});

//spawn a bot based on the API Token
var bot = controller.spawn({
  token: 'xoxb-77604885776-8WlYCOYhUOFF3m8XAQTunNAH'
}).startRTM()



controller.middleware.receive.use(wit.receive);


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


controller.hears(['name'], 'direct_message,direct_mention,mention', wit.hears, function(bot, message) {
for (var i = 0; i < message.entities.intent.length; i++) {
  if (message.entities.intent[i].value == 'name'){
      bot.reply(message, 'Hi ' + message.entities.name_of_person[0].value + '!');
    }
  }
});

controller.hears(['weather'], 'direct_message,direct_mention,mention', wit.hears, function(bot, message) {
  console.log(message)
  bot.reply(message, 'Hello!');
});
