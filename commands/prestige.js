const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { fields_embed } = require('../utils/embeds.js');

const levels = path.join(__dirname, '..', 'data', 'level.json');
const levels_json = JSON.parse(fs.readFileSync(levels, 'utf8'));

function PrestigeXp(json) {
    const xp_rate = [
        { "kill": 3 },
        { "assist": 1 },
        { "flag_capture": 50 },
        { "flag_return": 15 },
        { "win": 100 },
        { "draw": 50 }
    ];
    const victories = json.victories || 0;
    const kills = json.kills || 0;
    const killAssists = json.assists || 0;
    const flagCaptures = json.flags_captured || 0;
    const flagReturns = json.flags_returned || 0;

    const xp = (victories * xp_rate[4].win) +
        (kills * xp_rate[0].kill) +
        (killAssists * xp_rate[1].assist) +
        (flagCaptures * xp_rate[2].flag_capture) +
        (flagReturns * xp_rate[3].flag_return);

    return xp;
};

function PrestigeLevel(xp) {
    const XP_PER_PRESTIGE = levels_json["100"];

    const prestige = Math.floor(xp / XP_PER_PRESTIGE);
    let remainingXp = xp % XP_PER_PRESTIGE;
    let level = 1;

    for (let lv = 2; lv <= 100; lv++) {
        if (remainingXp >= levels_json[lv]) {
            level = lv;
        } else {
            break;
        }
    }

    return {
        totalXp: xp,
        prestige: prestige,
        level: level,
        remainingXp: remainingXp - levels_json[level]
    };
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prestige')
        .setDescription('CTFにプレステージを適応します')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('ユーザー名')
                .setRequired(true)
        ),

    async execute(interaction) {
        const name = interaction.options.getString('name');

        try {
            const res = await axios.get(`https://api.playhive.com/v0/game/all/ctf/${name}`);

            const description = `**Prestige**: ${PrestigeLevel(PrestigeXp(res.data)).prestige}  |  **Level**: ${PrestigeLevel(PrestigeXp(res.data)).level}\n**Next Level**: ${PrestigeLevel(PrestigeXp(res.data)).remainingXp.toLocaleString()} xp`;

            const fields = [
                { name: "推定XP", value: `${PrestigeXp(res.data).toLocaleString()} xp` },
                { name: "Wins / Losses", value: `${(res.data.victories || 0).toLocaleString()} / ${(res.data.played - res.data.victories || 0).toLocaleString()}` },
                { name: "Win Rate", value: `${((res.data.victories || 0) / (res.data.played || 1) * 100).toFixed(2)}%` },
                { name: "Kills / Deaths", value: `${(res.data.kills || 0).toLocaleString()} / ${(res.data.deaths || 0).toLocaleString()}` },
                { name: "Kill Rate", value: `${((res.data.kills || 0) / (res.data.deaths || 1)).toFixed(2)}` },
                { name: "Kill Assists", value: `${(res.data.assists || 0).toLocaleString()}` },
                { name: "Flag Captures", value: `${(res.data.flags_captured || 0).toLocaleString()}` },
                { name: "Flag Returns", value: `${(res.data.flags_returned || 0).toLocaleString()}` }
            ];

            await interaction.reply({
                embeds: [fields_embed(`CTF Prestige - ${name}`, description, fields, null, 0x00FF00)]
            });

        } catch (error) {
            custom.error(error);
            await interaction.reply({
                content: `❌ **${name}** のデータ取得に失敗しました。`,
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }
    }
};