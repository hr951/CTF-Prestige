const { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder } = require('discord.js');
const { buildPage } = require('../../utils/pages.js');
const { EarthTopUtils } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        const id = interaction.customId.replace('inquiry__', '');

        let data;
        try {
            data = await EarthTopUtils.findOne({ _id: interaction.guild.id });
        } catch (error) {
            custom.error(error);
        }

        if (id === 'next' || id === 'back') {
            // 現在のページを pageButton のラベルから取得
            const row = ActionRowBuilder.from(interaction.message.components[0]);
            const nowPage = Number(row.components[1].data.label.split('/')[0]);

            const nextPage = id === 'next' ? nowPage + 1 : nowPage - 1;
            const { description, current, totalPages } = buildPage(data, nextPage);

            // 既存の embed を引き継いで description だけ更新
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setDescription(description);

            // row の 0:back / 1:page / 2:next だけ更新。検索ボタンには触れない
            row.components[0].setDisabled(current <= 1);
            row.components[1].setLabel(`${current}/${totalPages}`);
            row.components[2].setDisabled(current >= totalPages);

            await interaction.update({ embeds: [embed], components: [row] });
        } else if (id === 'searchDid') {
            const modal = new ModalBuilder()
                .setTitle("Discord IDから検索")
                .setCustomId("inquiry__searchDid");
            const TextInput_1 = new TextInputBuilder()
                .setLabel("Discord IDを入力してください。")
                .setCustomId("discordId")
                .setStyle("Short")
                .setMaxLength(20)
                .setRequired(true);
            const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            modal.setComponents(ActionRow);
            await interaction.showModal(modal);
            return;
        } else if (id === 'searchMcid') {
            const modal = new ModalBuilder()
                .setTitle("MCIDから検索")
                .setCustomId("inquiry__searchMcid");
            const TextInput_1 = new TextInputBuilder()
                .setLabel("MCIDを入力してください。")
                .setCustomId("mcid")
                .setStyle("Short")
                .setMaxLength(2000)
                .setRequired(true);
            const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            modal.setComponents(ActionRow);
            await interaction.showModal(modal);
            return;
        }
    }
};