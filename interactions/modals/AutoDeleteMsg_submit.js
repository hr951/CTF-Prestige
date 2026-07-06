const { MessageFlags } = require("discord.js");
const { toHalfWidth } = require("../../utils/toHalfWidth.js");
const { EarthTopUtils } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        const channelId_del = interaction.fields.getTextInputValue("channelId_del");
        const channelId_send = interaction.fields.getTextInputValue("channelId_send");
        let deleteTime = interaction.fields.getTextInputValue("minutes");

        deleteTime = Number(toHalfWidth(deleteTime));
        const channelId_send_Num = Number(toHalfWidth(channelId_send));

        if (!deleteTime || deleteTime <= 0 || !channelId_send_Num) {
            await interaction.reply({
                content: '半角数字で入力してください',
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }

        try {
            const result = channelId_del
                .split(/\r?\n/)
                .filter(Boolean)
                .map(String);

            const newData = {
                "channelId_del": result,
                "channelId_send": toHalfWidth(channelId_send),
                "deleteTime": deleteTime
            };

            await EarthTopUtils.findOneAndUpdate(
                { _id: interaction.guild.id }, // 条件
                {
                    $set: {
                        channelId_del: newData.channelId_del,
                        channelId_send: newData.channelId_send,
                        deleteTime: newData.deleteTime
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );

            interaction.reply({
                content: 'サーバー情報を更新しました\n削除するチャンネル:```\n' + channelId_del + '```\n転送するチャンネル:```\n' + channelId_send + '```\n削除するまでの時間:```\n' + deleteTime + '分```',
                flags: [MessageFlags.Ephemeral]
            });
        } catch (error) {
            custom.error(error);
            interaction.reply({
                content: `サーバー情報の更新に失敗しました`,
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};