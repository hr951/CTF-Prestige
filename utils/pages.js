const PER_PAGE = 5;

function buildPage(data, page) {
    const users = data?.mcid ?? [];
    const totalPages = Math.max(1, Math.ceil(users.length / PER_PAGE));
    const current = Math.min(Math.max(page, 1), totalPages); // 範囲外を丸める

    const description = users
        .slice((current - 1) * PER_PAGE, current * PER_PAGE)
        .map(user => `<@${user.discordId}>\nMCID: **${user.mcid.map(m => m.mcid).join("**, **")}**`)
        .join("\n\n") || "登録されているユーザー情報はありません。";

    return { description, current, totalPages };
};

module.exports = {
    buildPage
};