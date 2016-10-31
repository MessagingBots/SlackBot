//Botkit and APIAI
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
// var interactive = require('node-wit').interactive;
var Wit = require('node-wit').Wit;

var accessToken = 'ZJJ5TKZXOVOE72O6STFSWO5YXE5QIRAX';
var client = new Wit({accessToken, actions});

const firstEntityValue = (entities, entity) => {
  console.log('searching through');
  console.log(entities);
  console.log('for');
  console.log(entity);
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

var actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    console.log('inside send');
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  ['echoName']({context, entities}) {
    return new Promise(function(resolve, reject) {
      const name = firstEntityValue(entities, 'name_of_person'));
      if (name) {
        context.name = name
      }

      //call the API here
      return resolve(context);
    });
  },
};



//the bot controller with JSON database
var controller = Botkit.slackbot({
  json_file_store: 'path_to_json_database',
  debug: false
});

//spawn a bot based on the API Token
var bot = controller.spawn({
  token: 'xoxb-77604885776-8WlYCOYhUOFF3m8XAQTunNAH'
}).startRTM()


//greetings
controller.hears(['name'], 'direct_message,direct_mention,mention', function(bot, message) {
  client.runActions('swag-420-blaze-it', message.text, context)
  .then((context)=>{
    console.log(JSON.stringify(context));
    bot.reply(message, `hi ${context.name}, i cant blieve how frustraing this is`);
  })
});
