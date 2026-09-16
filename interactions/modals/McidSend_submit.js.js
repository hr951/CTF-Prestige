const { MessageFlags } = require("discord.js");
const { EarthTopUtils } = require('../../db/db.js');

module.exports = {
    async execute(interaction) {
        const ch_mcid = interaction.fields.getTextInputValue("ch_mcid");

        try {
            const result = ch_mcid
                .split(/\r?\n/)
                .filter(Boolean)
                .map(String);

            const newData = {
                "ch_mcid": result
            };

            await EarthTopUtils.findOneAndUpdate(
                { _id: interaction.guild.id }, // 条件
                {
                    $set: {
                        ch_mcid: newData.ch_mcid,
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );

            await interaction.reply({
                content: 'サーバー情報を更新しました\nMCIDを送信するチャンネル:```\n' + ch_mcid + '```',
                flags: [MessageFlags.Ephemeral]
            });
        } catch (error) {
            custom.error(error);
            await interaction.reply({
                content: `サーバー情報の更新に失敗しました`,
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};