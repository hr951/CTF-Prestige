const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
require("dotenv").config();
const color = "#FFFFFF";
const config_data = require('../data/config.json');

const options = ["configMcid"];

function createConfigBoard(option) {
    if (option === options[0]) {
        const Button1 = new ButtonBuilder()
            .setURL("https://www.crystium.net/etu/privacypolicy")
            .setStyle(ButtonStyle.Link)
            .setLabel("プライバシーポリシー")

        const Button2 = new ButtonBuilder()
            .setURL("https://www.crystium.net/etu/terms")
            .setStyle(ButtonStyle.Link)
            .setLabel("利用規約")

        const embed = new EmbedBuilder()
            .setTitle("免責事項")
            .setDescription(`当サーバー内のユーザーの皆様のプライバシー保護の観点から当チャンネルに**__送信されたIDはただちに検証され、削除されます__**。\nなお、送信されたメッセージはすべて記録されます。\n### ID検証を効率的に行うため、当チャンネルに送信するメッセージはHive IDまたはMinecraft IDのみにしてください。\n※送信後、メッセージが消えたのちに再度送信する必要はありません。\n当サーバーにおける、 <@${config_data.botId}> の利用規約およびプライバシーポリシーは以下に示す通りです。`)
            .setColor(color);

        return { embeds: [embed], components: [new ActionRowBuilder().setComponents(Button2, Button1)] };
    } else {
        return { content: '不明なオプションです。\n以下のリスト内から選択してください。\n```\n' + options.join("\n") + '```' };
    }

}

function editConfigBoard(option) {
    if (option === options[0]) {
        const Button1 = new ButtonBuilder()
            .setCustomId("update_serverinfo_1")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("更新する")
            .setEmoji("⚙️");

        const Button2 = new ButtonBuilder()
            .setCustomId("update_serverinfo_2")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("更新する")
            .setEmoji("⚙️");

        const embed = new EmbedBuilder()
            .addFields(
                {
                    name: "サーバー情報の更新",
                    value: `ステータスに表示するサーバーの情報を更新できます。\n設定できる内容は以下の通りです。\n - サーバー 1のIP(JE&BE)\n - サーバー 1のポート(JE&BE)\n - サーバー 2のIP(JE&BE)\n - サーバー 2のポート(JE&BE)\n※デフォルトで最新の情報が自動的に入力されています。`,
                    inline: true
                },
            )
            .setColor(color);

        return {
            content: '',
            files: [],
            embeds: [embed],
            components: [new ActionRowBuilder().setComponents(Button1, Button2)]
        };
    } else {
        return {
            content: '不明なオプションです。\n以下のリスト内から選択してください。\n```\n' + options.join("\n") + '```',
            files: [],
            embeds: [],
            components: []
        };
    }

}

module.exports = {
    createConfigBoard,
    editConfigBoard
};