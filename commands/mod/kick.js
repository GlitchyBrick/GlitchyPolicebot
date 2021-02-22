let fs = require("fs");
const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");


module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      group: "mod",
      memberName: "kick",
      guildOnly: true,
      description: "Kick Command",
      args: [
        {
          key: "user",
          prompt: "Which user do you want to Kick?",
          type: "user"
        },
        {
          key: "reason",
          prompt: "Why Do you Want to Kick This User?",
          type: "string"
        }
      ]
    });
  }

  run(message, { user, reason }) {
    if (message.member.hasPermission(["ADMINISTRATOR"])) {

        const member = message.mentions.members.first();
        member.kick().then(member => {
            // Successmessage

           message.channel.send(member.displayName + " has been kicked :point_right: ")
           member.send("You Have Been Kicked From " + message.guild.name + " For: " + reason);
          
          })
          .catch(() => {
            // Failmessage
          });
      } else {
        message.channel.send("You Dont Have Admin Dumbass");
      }
  }
};