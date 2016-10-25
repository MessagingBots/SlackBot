//Botkit loaded in
var Botkit = require('./node_modules/botkit/lib/Botkit.js');

//the bot controller
var controller = Botkit.slackbot({
  debug: false
});

//spawn a bot based on the API Token
var bot = controller.spawn({
  token: 'xoxb-77604885776-8WlYCOYhUOFF3m8XAQTunNAH'
}).startRTM()


//Test Case, listen for pizza orders
controller.hears('pizza',['direct_mention','direct_message','mention'],function(bot,message){
  bot.reply(message,'What kind of pizza?');
});



/// ----- MESSAGE HANDLERS ----- ////
//So these are message event handlers; the slack stream can send the bot anything and
controller.on('direct_message',function(bot,message){
  bot.reply(message,"I received a message.");
});



/*

The slack bot should be able to do the following
  1. when a user requests a pizza:
  2. query for toppings
  3. when receive done
  4. launch up dominos.com
*/
