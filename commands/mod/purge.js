let fs = require("fs");
const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");


module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      group: "mod",
      memberName: "purge",
      guildOnly: true,
      description: "Purge Command",
      args: [
        {
          key: 'deleteCount',
          prompt: 'How many messages do you want to delete?',
          type: 'integer',
          validate: deleteCount => deleteCount < 100 && deleteCount > 0
        }
      ]
    });
  }

  run(message, { deleteCount }) {
    if (message.member.hasPermission(["ADMINISTRATOR"])) {

        message.delete()
        if (deleteCount) {
          if (deleteCount > 0) {
            // Isnt 1
  
            message.channel
              .bulkDelete(deleteCount)
              .then(messages => message.say(`Deleted ${messages.size} messages`)).then(msg => {
            setTimeout(function() {
              msg.delete() 
            }, 1000);
            }).catch(console.error);
          } else {
            return message.reply(
              "You Cant Deleted 0 Messages! Its Impossible..."
            );
          }
        }

    } else {
        message.channel.send("You Dont Have Admin Dumbass");
      }
    
  }
};