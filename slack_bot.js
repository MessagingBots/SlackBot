//Dependencies
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var Wit = require('node-wit').Wit;
var accessToken = 'ZJJ5TKZXOVOE72O6STFSWO5YXE5QIRAX';
var Imap = require('imap');
var inspect = require('util').inspect;
var MailListener = require("mail-listener2");


var MailListener = require("mail-listener2");

var mailListener = new MailListener({
  username: 'insert email here'
  password: 'insert password here'
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: console.log, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});



mailListener.on("attachment", function(attachment){
  console.log(attachment.path);
});



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
        reject();
      }
    });
  },
  ['getEmails']({context,entities}){
    console.log("context");
    console.log("~~~~~~~~~");
    console.log(context);
    console.log("Entities");
    console.log("~~~~~~~~~");
    console.log(entities);
    return new Promise(function(resolve,reject){
      const email = firstEntityValue(entities, 'wit/email');
      if(email){
        context.email = email;
        return resolve(context);
      }else{
        return reject();
      }
    });
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


//greetings
controller.hears(['name'], 'direct_message,direct_mention,mention', function(bot, message) {
  client.runActions('greetings', message.text,{})
  .then((context)=>{
    console.log(JSON.stringify(context));
    bot.reply(message, `hi ${context.name}, i cant blieve how frustraing this is`);
  })
});

//emails
controller.hears(['emails'],'direct_message,direct_mention,mention', function(bot,message){
  client.runActions('emails', message.text, {})
    .then((context)=>{
      console.log(JSON.stringify(context));
      bot.reply(message,"GETTING EMAILS");
    })
})
