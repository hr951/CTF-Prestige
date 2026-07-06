const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const options = ["AutoDeleteMsg"];

function textCommand(option) {
    if (option === options[0]) {
        const Button = new ButtonBuilder()
            .setCustomId("AutoDeleteMsg")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("変更する")
            .setEmoji("⚙️");

        return {
            components: [new ActionRowBuilder().setComponents(Button)],
            allowedMentions: { repliedUser: false }
        };
    } else {
        return {
            content: '不明なオプションです。\n以下のリスト内から選択してください。\n```\n' + options.join("\n") + '```',
            allowedMentions: { repliedUser: false }
        };
    }
}

module.exports = { textCommand };