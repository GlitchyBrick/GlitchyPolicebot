let fs = require("fs");
const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");


module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      group: "mod",
      memberName: "ban",
      guildOnly: true,
      description: "Kick Command",
      args: [
        {
          key: "user",
          prompt: "Which user do you want to Ban?",
          type: "user"
        },
        {
          key: "reason",
          prompt: "Why Do you Want to Ban This User?",
          type: "string"
        }
      ]
    });
  }

  run(message, { user, reason }) {
    if (message.member.hasPermission(["ADMINISTRATOR"])) {

        const member = message.mentions.members.first();
        member.ban().then(member => {
            // Successmessage
            message.channel.send(member.displayName + " has been Banned :point_right: ")
           user.send("You Have Been Banned From " + message.guild.name + " For: " + reason);
          
          })
          .catch(() => {
            // Failmessage
          });
      } else {
        message.channel.send("You Dont Have Admin Dumbass");
      }
  }
};
