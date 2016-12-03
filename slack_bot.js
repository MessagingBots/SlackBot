//Dependencies
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var Wit = require('node-wit').Wit;
const https = require('https')
const  rp = require('request-promise')
const path = require('path')
const  httpProxy = require('http-proxy')

//tokens
var accessToken = 'ZF7JJF46I4NA53CXYVA56YLIA7TLQUAT';
var CANVAS_API = '1016~QaR4TkJeM3d4DH5qsGqCFVSKILnAjS9wFiU2TVdU9nhjBoXUfUhvYeH2dY5Nz1kM';
var canvasToken = '1016~QaR4TkJeM3d4DH5qsGqCFVSKILnAjS9wFiU2TVdU9nhjBoXUfUhvYeH2dY5Nz1kM';

//course request options
var courseOptions = {
  uri: 'https://canvas.instructure.com/api/v1/courses?&access_token=',
  qs: {
    access_token: canvasToken,
  },
  method: 'GET'
}

//announcement request options
var announcementOptions = {
  uri:  'https://canvas.instructure.com/api/v1/courses/?&access_token=?course_id=/gradebook_history/days',
  qs: {
    access_token: canvasToken,
    course_id: '10160000000332596',
  },
  method: 'GET'
}

//Helper function for action commands
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
  },
  ['getCourses']({context,entities}){
    console.log(context)
    return new Promise(function(resolve,reject){
      if(context){
        return resolve(context);
      }
    })
  }
};


//Bot configurations
var client = new Wit({accessToken, actions});
var controller = Botkit.slackbot({
  json_file_store: 'path_to_json_database',
  debug: false
});
var bot = controller.spawn({
  token: 'xoxb-77604885776-dK5CynBj8CXDHizwUzCPD6T4'
}).startRTM()



//help
controller.hears(['hi'],'direct_message,direct_mention,mention,ambient',function(bot, message){
  controller.storage.users.get(message.user,function(err,user){
    if(!user){
      bot.startConversation(message, function(err, convo){
      convo.ask("I don't recognize you. What is your name?", function(response,convo){
        user = {
          id : message.user
        }
        user.name = response.text
        convo.next();
      })
      convo.ask("What is your email?",function(response,convo){
        user.email = response.text
        controller.storage.users.save(user);
        bot.reply(message, "You are now registered with SlackBot :)");
        bot.reply(message,"What can I do for you " + user.name + "?");
        bot.reply(message,"You can ask for...");
        bot.reply(message,"*For your emails (No data)");
        bot.reply(message, "*For your courses (No data)");
        bot.reply(message, "*Change your name (Updates user's name)");
        bot.reply(message,"----More functionality coming later----");
      })
    });
    }else{
      bot.reply(message,"What can I do for you " + user.name + "?");
    }
  });
});


//change name
controller.hears(['name'], 'direct_message,direct_mention,mention', function(bot, message) {
  client.runActions('420-blaze-it-410', message.text,{})
  .then((context)=>{
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message,function(response,convo){
            convo.ask("what would you like to be called?", function(response,convo){
              if(!user){
                user = {
                  id : message.user
                }
              }
              user.name = response.text
              controller.storage.users.save(user, function(err, id) {
                  bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                  convo.status = 'completed'
              });
            })
          });
        })
      })
  .catch((err)=>{
    bot.reply(message,"Sorry I had a hard time hearing that");
  })
});

//emails
controller.hears(['emails'],'direct_message,direct_mention,mention', function(bot,message){
  client.runActions('emails-WHY-THIS-ISNT-WORKING', message.text, {})
    .then((context)=>{
      controller.storage.users.get(message.user,function(err,user){
        if(!user){
          bot.reply(message, "Sorry, no account was recognized for you. Type 'help' to create a user");
          next();
        }
        bot.reply(message, "Getting emails for: " + user.name);
      })
    })
    .catch((err)=>{
      console.log("Error");
      bot.reply(message, "Received an error getting emails");
    })
});

//courses
controller.hears(['courses'],'direct_message,direct_mention,mention', function(bot,message){
  client.runActions('courses-WHY-THIS-ISNT-WORKING', message.text, {})
    .then((context)=>{
      controller.storage.users.get(message.user,function(err,user){
        if(err && !user){
          bot.reply(message, "Sorry, no account was recognized for you. Type 'help' to create a user");
        }
        else{
          rp(courseOptions)
            .then((body)=>{
              var parsedResponse = JSON.parse(body);
              console.log(parsedResponse);
              for(var i = 0; i < 4; i++){
                if(typeof parsedResponse[i].name != undefined){
                  bot.reply(message,String(parsedResponse[i].name));

                }
              }
            })
            .catch((err)=>{
              console.log(err);
            })
        }
      });
    })
    .catch((err)=>{
      console.log(err);
      bot.reply(message, "Received an error getting courses");
    })
});


//announcements
controller.hears(['announcements'],'direct_message,direct_mention,mention', function(bot,message){
  client.runActions('courses-WHY-THIS-ISNT-WORKING', message.text, {})
    .then((context)=>{
      controller.storage.users.get(message.user,function(err,user){
        if(err && !user){
          bot.reply(message, "Sorry, no account was recognized for you. Type 'help' to create a user");
        }
        else{
          rp(announcementOptions)
            .then((body)=>{
              console.log(JSON.parse(body));
            })
            .catch((err)=>{
              console.log(err);
            })
        }
      });
    })
    .catch((err)=>{
      console.log(err);
      bot.reply(message, "Received an error getting courses");
    })
});
