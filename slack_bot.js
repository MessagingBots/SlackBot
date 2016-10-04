var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: 'xoxb-77604885776-8WlYCOYhUOFF3m8XAQTunNAH'
}).startRTM()

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {

  bot.reply(message,'Hello ydfdfourself.');

});
