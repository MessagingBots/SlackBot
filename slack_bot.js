//Dependencies
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var Wit = require('node-wit').Wit;
var accessToken = 'ZF7JJF46I4NA53CXYVA56YLIA7TLQUAT';


const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

//various actions our bots can take
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
      const name = firstEntityValue(entities, 'name_of_person');
      if (name) {
        context.name = name
        return resolve(context);
      }else{
        return reject();
      }
    });
  },
  ['getEmails']({context,entities}){
    console.log(context)
    return new Promise(function(resolve,reject){
      if(context){
        return resolve(context);
      }
    })
  }
};



var client = new Wit({accessToken, actions});   //spawn a client for Wit.ai processing
var controller = Botkit.slackbot({              //the bot controller with JSON database
  json_file_store: 'path_to_json_database',
  debug: false
});
var bot = controller.spawn({                    //spawn a bot based on the API Token
  token: 'xoxb-77604885776-8WlYCOYhUOFF3m8XAQTunNAH'
}).startRTM()



//help
controller.hears(['help'],'direct_message,direct_mention,mention,ambient',function(bot, message){
  controller.storage.users.get(message.user,function(err,user){
    if(!user){
      bot.startConversation(message, function(err, convo){
      convo.ask("what is your name?", function(response,convo){
        user = {
          id : message.user
        }
        user.name = response.text
        convo.next();
      })
      convo.ask("What is your email?",function(response,convo){
        user.email = response.text
        controller.storage.users.save(user);
        convo.next();
      })
    });
    }else{
      bot.reply(message,"What can I do for you " + user.name + "?");
      bot.reply(message,"You can ask for...");
      bot.reply(message,"For your emails");
      bot.reply(message,"More functionality coming later");
    }
  });
});




//greetings
controller.hears(['name'], 'direct_message,direct_mention,mention', function(bot, message) {
  client.runActions('420-blaze-it-410', message.text,{})
  .then((context)=>{
    console.log(JSON.stringify(context));
    bot.reply(message, `hi ${context.name}, i cant blieve how frustraing this is`);
  })
  .catch((err)=>{
    bot.reply(message,"Sorry I had a hard time hearing that");
  })
});

//emails
controller.hears(['emails'],'direct_message,direct_mention,mention', function(bot,message){
  client.runActions('emails-WHY-THIS-ISNT-WORKING', message.text, {})
    .then((context)=>{
      console.log(JSON.stringify(context));
      bot.reply(message,"GETTING EMAILS");
    })
    .catch((err)=>{
      console.log("Error");
      bot.reply(message, "Received an error getting emails");
    })
});

//courses
