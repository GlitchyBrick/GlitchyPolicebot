let fs = require("fs");
const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");


module.exports = class RaiddmCommand extends Command {
  constructor(client) {
    super(client, {
      name: "raiddm",
      group: "mod",
      memberName: "raiddm",
      guildOnly: true,
      description: "Raiddms Command"
    });
  }

  run(message) {
    if (message.member.hasPermission(["ADMINISTRATOR"])) {
    if (!message.mentions.members.first()) {
        return message.say("Mention Someone!");
      }

      var person = message.guild.member(message.mentions.users.first());
      if (!person) return message.reply("I CANT FIND THE USER " + person);
      
      message.channel.send(`Spamming ${person} Dms`)
      
      setInterval(() => {
        person.send('SPAM') 
      }, 1000);


    } else {
        message.channel.send("You Dont Have Admin Dumbass");
      }
  }
};