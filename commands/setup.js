const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const { EarthTopUtils } = require('../db/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('管理者権限が必要です')
        .addSubcommand(subcommand =>
            subcommand
                .setName('del_ch')
                .setDescription('自動メッセージ削除の設定を行います')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mcid_ch')
                .setDescription('MCID送信チャンネルの設定を行います')
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: "管理者権限が必要です", ephemeral: true });
            return;
        }
        const subcommand = interaction.options.getSubcommand();

        let data;
        try {
            data = await EarthTopUtils.findOne({ _id: interaction.guild.id });
        } catch (error) {
            custom.error(error);
        }

        if (subcommand === "del_ch") {
            const modal = new ModalBuilder()
                .setTitle("自動メッセージ削除 設定")
                .setCustomId("AutoDeleteMsg_submit");
            const TextInput_1 = new TextInputBuilder()
                .setLabel("メッセージを削除するチャンネルのIDを入力してください")
                .setCustomId("channelId_del")
                .setValue(data?.channelId_del?.join("\n") || "")
                .setStyle("Paragraph")
                .setMaxLength(4000)
                .setRequired(true);
            const TextInput_2 = new TextInputBuilder()
                .setLabel("メッセージを転送するチャンネルのIDを入力してください")
                .setCustomId("channelId_send")
                .setValue(data?.channelId_send || "")
                .setStyle("Short")
                .setMaxLength(4000)
                .setRequired(true);
            const TextInput_3 = new TextInputBuilder()
                .setLabel("削除するまでの時間を分単位で入力してください (半角数字推奨)")
                .setCustomId("minutes")
                .setValue(data?.deleteTime?.toString() || "")
                .setStyle("Short")
                .setPlaceholder("5分の場合) 5")
                .setMaxLength(4000)
                .setRequired(true);
            const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
            const ActionRow_3 = new ActionRowBuilder().setComponents(TextInput_3);
            modal.setComponents(ActionRow, ActionRow_2, ActionRow_3);
            await interaction.showModal(modal);
            return;

        } else if (subcommand === "mcid_ch") {
            const modal = new ModalBuilder()
                .setTitle("MCID送信チャンネル 設定")
                .setCustomId("McidSend_submit");
            const TextInput_1 = new TextInputBuilder()
                .setLabel("MCIDを送信するチャンネルのIDを入力してください")
                .setCustomId("ch_mcid")
                .setValue(data?.ch_mcid?.join("\n") || "")
                .setStyle("Paragraph")
                .setMaxLength(4000)
                .setRequired(true);
            const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            modal.setComponents(ActionRow);
            await interaction.showModal(modal);
            return;

        }

    },
};