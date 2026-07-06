const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = {
    name: 'clientReady',
    async execute(client) {
        setInterval(() => {
            client.user.setPresence({
                activities: [
                    {
                        name: `/prestige | ${client.ws.ping} ms`,
                        type: ActivityType.Playing
                    }
                ],
                status: PresenceUpdateStatus.Online // Online : いつもの, DoNotDisturb : 赤い奴, Idle : 月のやつ, Invisible : 表示なし
            });
        }, 5_000);

        custom.log(`Logged in as ${client.user.tag}`);
    },
};