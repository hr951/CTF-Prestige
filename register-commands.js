const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = "1511027390061477940";

// ----- グローバルコマンドここから-----
const prestige = new SlashCommandBuilder()
    .setName('prestige')
    .setDescription('CTFにプレステージを適応します')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('ユーザー名')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('rank')
            .setDescription('ランク(任意)')
            .setRequired(false)
            .addChoices(
                { name: "Ultimate", value: "ULTIMATE" },
                { name: "Plus", value: "PLUS" },
                { name: "Regular", value: "REGULAR" }
            )
    )
    .setIntegrationTypes([
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall
    ])
    .setContexts([
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]);

const setup = new SlashCommandBuilder()
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
    );

const inquiry = new SlashCommandBuilder()
    .setName('inquiry')
    .setDescription('一定以上の権限が必要です')
    .addSubcommand(subcommand =>
        subcommand
            .setName('user')
            .setDescription('ユーザー情報の照会を行います')
    );

const commands = [prestige, setup, inquiry];

// 登録用関数
const { REST, Routes } = require("discord.js")
const rest = new REST({ version: '10' }).setToken(token)
async function main() {
    await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    );
}

main().catch(err => console.log(err));