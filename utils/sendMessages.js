const { transfer_embed } = require("./embeds");

async function sendMessage(message, channelId) {
    if (!message.content && (!message.embeds || message.embeds.length === 0) && (!message.attachments || message.attachments.size === 0)) {
        return;
    }

    try {
        const targetChannel = message.client.channels.cache.get(channelId);

        if (!targetChannel) return;

        const guildName = message.client.guilds.cache.get(message.guildId)?.name || "Unknown Guild";
        const channelName = message.channel.name;
        const channelUrl = `https://discord.com/channels/${message.guildId}/${message.channel.id}`;

        const embed = await transfer_embed(
            message.member.displayName,
            message.author.displayAvatarURL(),
            `#${channelName} (${guildName})`,
            channelUrl,
            message.content ? message.content : '```ansi\n[2;35m[System][0m 添付ファイルのみのメッセージです```',
            message.id,
            message.createdTimestamp);

        const sendOptions = {
            embeds: message.embeds.length > 0 ? message.embeds : [embed]
        };

        if (message.attachments && message.attachments.size > 0) {
            sendOptions.files = message.attachments.map(a => a.url);
        }

        await targetChannel.send(sendOptions);

    } catch (error) {
        custom.error(error);
    }
};

module.exports = {
    sendMessage
};