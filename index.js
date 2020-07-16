const Discord = require("discord.js");
const client = new Discord.Client();
const spotifyLookUp = require("./spotifyLookUp");

const prefix = "S>";

let spotifyAuthToken;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command == "album") {
    if (args.length < 1) {
      msg.channel.send("Command syntax:   ```L> search {search term}``` ");
      return;
    } else {
      const loadingEmbed = new Discord.MessageEmbed()
        .setColor("#2BB55F")
        .setTitle("Loading...");
      let mainMessage = await msg.channel.send(loadingEmbed);

      // (async function() {
      //     let information = await spotifyLookUp.getData(args);
      //     console.log(information)
      // })();
      spotifyLookUp
        .getData(args, "album")
        .then((response) => {
          console.log(response);

          let albumInformationEmbed = new Discord.MessageEmbed()
            .setColor("#2BB55F")
            .setTitle(response.name)
            .setURL(response.link)
            .setAuthor(`By: ${response.artist}`)
            .setDescription(`**Released** ${response.releaseDate}`)
            .setThumbnail(response.coverArt)
            .addFields(
              { name: "Requested by:", value: `<@${msg.author.id}>` }
            );

          mainMessage.edit(albumInformationEmbed);
          // msg.channel.send(`|| ${response.link} ||`)
        })
        .catch((error) => {
          console.log(error);
          msg.channel.send(
            "Oops, something went wrong! ```" +
              error +
              "```" +
              "The error has been noted!"
          );
        });

      // (async function() {
      //     msg.channel.send(`Track info: ${await spotifyLookUp.getData(args)}`);
      // })();
    }
  } else if (command == "track") {
    if (args.length < 1) {
      msg.channel.send("Command syntax:   ```S> track {search term}``` ");
      return;
    } else {
      const loadingEmbed = new Discord.MessageEmbed()
        .setColor("#2BB55F")
        .setTitle("Loading...");
      let mainMessage = await msg.channel.send(loadingEmbed);
      // (async function() {
      //     let information = await spotifyLookUp.getData(args);
      //     console.log(information)
      // })();
      spotifyLookUp
        .getData(args, "track")
        .then((response) => {
          console.log(response);

          let albumInformationEmbed = new Discord.MessageEmbed()
            .setColor("#2BB55F")
            .setTitle(response.name)
            .setURL(response.link)
            .setAuthor(`By: ${response.artist}`)
            .setDescription(`**Released** ${response.releaseDate}`)
            .setThumbnail(response.coverArt)
            .addFields(
              { name: "Preview url", value: response.preview },
              { name: "Requested by:", value: `<@${msg.author.id}>` }
            );

          mainMessage.edit(albumInformationEmbed);
          // msg.channel.send(`|| ${response.link} ||`)
        })
        .catch((error) => {
          console.log(error);
          msg.channel.send(
            "Oops, something went wrong! ```" +
              error +
              "```" +
              "The error has been noted!"
          );
        });

      // (async function() {
      //     msg.channel.send(`Track info: ${await spotifyLookUp.getData(args)}`);
      // })();
    }
  } else {
    msg.channel.send("thats not a command!");
  }
});

client.login(process.env.DISCORD_TOKEN);
