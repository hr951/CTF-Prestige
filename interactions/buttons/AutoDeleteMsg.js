const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = {
    async execute(interaction) {

        const filePath = path.join(__dirname, '..', '..', 'data', 'data.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        const modal = new ModalBuilder()
            .setTitle("自動メッセージ削除 設定")
            .setCustomId("AutoDeleteMsg_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("メッセージを削除するチャンネルのIDを入力してください")
            .setCustomId("channelId_del")
            .setValue(data.channelId_del.join("\n"))
            .setStyle("Paragraph")
            .setMaxLength(4000)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("メッセージを転送するチャンネルのIDを入力してください")
            .setCustomId("channelId_send")
            .setValue(data.channelId_send)
            .setStyle("Short")
            .setMaxLength(4000)
            .setRequired(true);
        const TextInput_3 = new TextInputBuilder()
            .setLabel("削除するまでの時間を分単位で入力してください (半角数字推奨)")
            .setCustomId("minutes")
            .setValue(data.deleteTime.toString())
            .setStyle("Short")
            .setPlaceholder("5分の場合) 5")
            .setMaxLength(4000)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        const ActionRow_3 = new ActionRowBuilder().setComponents(TextInput_3);
        modal.setComponents(ActionRow, ActionRow_2, ActionRow_3);
        await interaction.showModal(modal);
        await interaction.message.delete();
        return;
    }
};