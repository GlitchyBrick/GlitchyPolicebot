//UPTIME
const express = require("express")
const app = express()
const port = 3000

app.get("/", (request, response) => { 
  console.log("Ping Received");
  response.sendStatus(200);
  //response.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => console.log(`Bot app listening to ${port}!`))

const Discord = require('discord.js');
const { CommandoClient } = require("discord.js-commando");
const { Structures } = require("discord.js");
const { MessageAttachment } = require("discord.js");
const { owner, prefix, token } = require('./config.json');
const { badwords } = require("./badwords.json") 
const path = require("path");
const Canvas = require('canvas');

const client = new CommandoClient({
  commandPrefix: prefix,
  owner: owner
});


client.registry.registerDefaultTypes()
client.registry.registerGroups([
  ["member", "Member Commands"],
  ["mod", "Mod Commands"]
])

client.registry.registerDefaultGroups()
client.registry.registerDefaultCommands({
  help: false,
  ping: true,
  prefix: false,
  commandState: false,
  unknownCommand: false
})

client.registry.registerCommandsIn(path.join(__dirname, "commands"))

client.on("ready", () => {
  console.log('Ready');
  client.user.setActivity(`POLICE`, {
    type: 2,
    url: 'https://www.twitch.tv/glitchybrick'
  });
});

//AntiSwear
client.on('message', async message => {
    if (message.author.bot) return;  
    if(!message.member.hasPermission("ADMINISTRATOR")) {
          
          let confirm = false;
          //NOW WE WILL USE FOR LOOP
          var i;
          for(i = 0;i < badwords.length; i++) {
            
            if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
              confirm = true;
            
          }
          
          if(confirm) {
            message.delete()
            setInterval(() => {
                message.author.send('Fuck off Stop Swearing in my Server')
            }, 1000);
            return message.channel.send("You are not allowed to send badwords here")
          }    
    }
})

//Antilink
client.on('message', async message => {
    if(!message.member.hasPermission("ADMINISTRATOR")) {

        function is_url(str) {
            let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if(regexp.test(str)) {
              return true;
            } else {
              return false;
            } 
          }

    if(is_url(message.content) === true) {
        message.delete()
        setInterval(() => {
            message.author.send('Fuck off Stop Sedning Links in my Server')
        }, 1000);
        return message.channel.send("You can not send link here :/")
      }
    }
})

//antispam
const usersMap = new Map();
const LIMIT = 7;
const TIME = 3.6e+6;
const DIFF = 5000;

client.on('message', async(message) => {
    if(message.author.bot) return;
    
    if(usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;
        console.log(difference);

        if(difference > DIFF) {
            clearTimeout(timer);
            console.log('Cleared Timeout');
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                usersMap.delete(message.author.id);
                console.log('Removed from map.')
            }, TIME);
            usersMap.set(message.author.id, userData)
        }
        else {
            ++msgCount;
            if(parseInt(msgCount) === LIMIT) {
                let muterole = message.guild.roles.cache.find(role => role.name === 'Muted');

                if(!muterole) {
                    try{
                        muterole = await message.guild.roles.create({
                            data: {
                              name: 'Muted',
                              color: 'RED',
                            },
                            reason: 'Needed a Mute Role to Mute a User'
                        })
                        
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(muterole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS : false
                            })
                        })
                    }catch (e) {
                        console.log(e)
                    }
                }

                message.member.roles.add(muterole);
                message.channel.send('You have been muted!');
                setTimeout(() => {
                    message.member.roles.remove(muterole);
                    message.channel.send('You have been unmuted!')
                }, TIME);
            } else {
                userData.msgCount = msgCount;
                usersMap.set(message.author.id, userData);
            }
        }
    }
    else {
        let fn = setTimeout(() => {
            usersMap.delete(message.author.id);
            console.log('Removed from map.')
        }, TIME);
        usersMap.set(message.author.id, {
            msgCount: 1,
            lastMessage : message,
            timer : fn
        });
    }
})

//welcome message

client.on('message', async message => {
  if(message.content === `${prefix}join`) {
    
    // Create a canvas and access the 2d context
    const canvas = Canvas.createCanvas(700, 250)
    const ctx = canvas.getContext('2d')

    // Load the background image and draw it to the canvas
    const background = await Canvas.loadImage(
      path.join(__dirname, '/galaxy.png')
    )
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    // Load the user's profile picture and draw it
    const pfp = await Canvas.loadImage(
      message.member.user.displayAvatarURL({
        format: 'png',
      })
    )
    x = canvas.width / 2 - pfp.width / 2
    y = 25
    ctx.drawImage(pfp, x, y)

    // Display user text
    ctx.fillStyle = '#ffffff' // White text
    ctx.font = '35px sans-serif'
    let text = `Welcome ${message.member.user.tag}!`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 75 + pfp.height)
    
    // Attach the image to a message and send it
    const attachment = new MessageAttachment(canvas.toBuffer())

    message.channel.send(attachment)

  }
})

client.on("guildMemberAdd", member => {
    const ChannelID = '813026692695064615'
    const message = `Welcome <@${member.id}`
    const channel = member.guild.channels.cache.get(ChannelID)

    channel.send(message)
  });


client.login(token);
