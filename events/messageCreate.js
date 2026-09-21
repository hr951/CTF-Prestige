const { sendMessage } = require('../utils/sendMessages.js');
const { EarthTopUtils } = require('../db/db');
const { joinVoiceChannel } = require('@discordjs/voice');
const { searchBedrockPlayer } = require('../utils/minecrafts/searchUser.js');
const config_data = require('../data/config.json');
const { createConfigBoard } = require('../utils/configBoards');

let connection;

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.id === client.user.id) return;
        let data;
        try {
            data = await EarthTopUtils.findOne({ _id: message.guild.id });
        } catch (error) {
            custom.error(error);
        }

        if (data && data.channelId_del.includes(message.channel.id)) {
            setTimeout(() => {
                sendMessage(message, data.channelId_send);
                message.delete();
            }, data.deleteTime * 60 * 1000);
        }
        if (message.author.bot) return;

        if (data && data.ch_mcid.includes(message.channel.id)) {
            const playerData = await searchBedrockPlayer(message.cleanContent);
            const playerExists = playerData.exists;
            try {
                const result = await EarthTopUtils.updateOne(
                    {
                        _id: message.guild.id,
                        "mcid.discordId": message.author.id
                    },
                    {
                        $push: {
                            "mcid.$.mcid": {
                                mcid: message.cleanContent,
                                verify: playerExists
                            }
                        }
                    }
                );

                if (!result.matchedCount) {
                    await EarthTopUtils.updateOne(
                        { _id: message.guild.id },
                        {
                            $push: {
                                mcid: {
                                    discordId: message.author.id,
                                    mcid: [{
                                        mcid: message.cleanContent,
                                        verify: playerExists
                                    }]
                                }
                            }
                        }
                    );
                }
            } catch (err) {
                console.error(err);
            }

            message.delete();
        }

        if (message.author.id === config_data.developerId) {
            if (message.content === "!join") {
                const channel = message.member?.voice.channel;
                if (!channel) {
                    message.reply("You need to join a voice channel first!");
                    return;
                }
                connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
            } else if (message.content === "!leave") {
                connection.destroy();
            } else if (message.content.startsWith("!setting")) {
                message.channel.send(createConfigBoard(message.content.substr(message.content.indexOf(' ') + 1)));
            }
        }
    },
};