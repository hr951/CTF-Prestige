const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { basic_embed } = require('../utils/embeds.js');
const { EarthTopUtils } = require('../db/db');
const config_data = require('../data/config.json');
const { buildPage } = require('../utils/pages.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inquiry')
        .setDescription('一定以上の権限が必要です')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('ユーザー情報の照会を行います')
        ),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config_data.staffRoleId) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: "一定以上の権限が必要です", ephemeral: true });
            return;
        }
        const subcommand = interaction.options.getSubcommand();

        let data;
        try {
            data = await EarthTopUtils.findOne({ _id: interaction.guild.id });
        } catch (error) {
            custom.error(error);
        }

        if (subcommand === "user") {
            const { description, totalPages } = buildPage(data, 1);

            const embed = basic_embed(
                "登録済みのユーザー情報",
                description
            );

            const backButton = new ButtonBuilder()
                .setCustomId('inquiry__back')
                .setEmoji('⏪')
                .setDisabled(true)
                .setStyle('Secondary');

            const nextButton = new ButtonBuilder()
                .setCustomId('inquiry__next')
                .setEmoji('⏩')
                .setStyle('Secondary')
                .setDisabled(totalPages <= 1);

            const searchDidButton = new ButtonBuilder()
                .setCustomId('inquiry__searchDid')
                .setLabel('Discord IDで検索')
                .setEmoji('🔍')
                .setStyle('Secondary');

            const searchMcidButton = new ButtonBuilder()
                .setCustomId('inquiry__searchMcid')
                .setLabel('MCIDで検索')
                .setEmoji('🔍')
                .setStyle('Secondary');

            const pageButton = new ButtonBuilder()
                .setCustomId('inquiry__page')
                .setLabel(`1/${totalPages}`)
                .setDisabled(true)
                .setStyle('Secondary');

            await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(backButton, pageButton, nextButton, searchDidButton, searchMcidButton)] });
            return;

        }

    },
};