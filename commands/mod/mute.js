let fs = require("fs");
const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");


module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      group: "mod",
      memberName: "mute",
      guildOnly: true,
      description: "Mute Command"
    });
  }

  run(message) {
    if (message.member.hasPermission(["ADMINISTRATOR"])) {
    if (!message.mentions.members.first()) {
        return message.say("Mention Someone!");
      }

      var person = message.guild.member(message.mentions.users.first());
      if (!person) return message.reply("I CANT FIND THE USER " + person);
      let role = message.guild.roles.cache.find(role => role.name === "Muted");

      if (!role) return message.reply("Couldn't find the mute role.");
      person.roles.add(role.id);

      message.channel.send(`@${person.user.tag} has now been muted`);
      person.send(`You Have Been Muted in **${message.guild.name}** By **${message.author.username}#${message.author.discriminator}**`)
    } else {
        message.channel.send("You Dont Have Admin Dumbass");
      }
  }
};