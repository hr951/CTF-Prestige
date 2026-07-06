const { sendMessage } = require('../utils/sendMessages.js');
const { EarthTopUtils } = require('../db/db');

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
    },
};