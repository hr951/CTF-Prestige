const { ActionRowBuilder, EmbedBuilder } = require('discord.js');
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

        const row = ActionRowBuilder.from(interaction.message.components[0]);

        if (id === 'searchDid') {
            const dId = interaction.fields.getTextInputValue("discordId");
            data = data?.mcid.filter(user => user.discordId === dId) || [];
            const description = data.map(user => `<@${user.discordId}>\nMCID: ${user.mcid.map(m => `${m.verify ? '⭕' : '❌'} **${m.mcid}**`).join(", ")}`)
                .join("\n\n") || "登録されているユーザー情報はありません。";
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setDescription(description);

            row.components[0].setDisabled(true);
            row.components[2].setDisabled(true);
            await interaction.update({ embeds: [embed], components: [row] });
        } else if (id === 'searchMcid') {
            const mcid = interaction.fields.getTextInputValue("mcid");
            data = data?.mcid.filter(user => user.mcid.some(m => m.mcid === mcid)) || [];
            const description = data.map(user => `<@${user.discordId}>\nMCID: ${user.mcid.map(m => `${m.verify ? '⭕' : '❌'} **${m.mcid}**`).join(", ")}`)
                .join("\n\n") || "登録されているユーザー情報はありません。";
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setDescription(description);

            row.components[0].setDisabled(true);
            row.components[2].setDisabled(true);
            await interaction.update({ embeds: [embed], components: [row] });
        }
    }
};