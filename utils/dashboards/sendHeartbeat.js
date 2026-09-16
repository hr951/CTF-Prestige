require("dotenv").config();
const { getCPUUsage, getRAMUsage, getDBUsage } = require("../getUsage");
const { ms2time } = require("../ms2time");
const { version } = require('discord.js');
const os = require('os');

async function sendHeartbeat(client) {

  const uptime = ms2time(client.uptime);
  const nodeVer = process.version;
  const djsVer = version;
  const osVer = os.type();
  const ping = client.ws.ping;

  const cpuUsage = await getCPUUsage();

  const ramUsage = await getRAMUsage();

  const dbUsage = await getDBUsage();

  await fetch("https://api.crystium.net/api/bot/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bot-Secret": process.env.BOT_REPORT_SECRET,
    },
    body: JSON.stringify({
      bot_id: client.user.id,
      bot_name: client.user.username,
      bot_avatar_url: client.user.displayAvatarURL({ format: "png", size: 512 }),
      system: {
        os: osVer,
        uptime_seconds: uptime,
        ping_ms: ping,
        ram_usage_mb: ramUsage.botUsed,
        cpu_usage_percent: cpuUsage,
        db_usage_mb: dbUsage.used,
        node_version: nodeVer,
        discordjs_version: djsVer,
      },
      discord_stats: {
        guild_count: client.guilds.cache.size,
        total_users: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
        cached_users: client.users.cache.size,
        channels_count: client.channels.cache.size,
      },
      guilds: client.guilds.cache.map((g) => ({
        id: g.id,
        name: g.name,
        icon_url: g.iconURL(),
        member_count: g.memberCount,
        channel_count: g.channels.cache.size,
        boost_level: g.premiumTier,
      })),
      last_heartbeat_at: new Date().toISOString(),
    }),
  });
}


module.exports = { sendHeartbeat };