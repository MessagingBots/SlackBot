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

//testing if message received?
controller.on('message_received',function(bot,message){
  bot.reply(message,"I received a message.");
});
