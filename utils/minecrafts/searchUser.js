async function searchBedrockPlayer(gamertag) {
    const url = `https://mc-api.io/uuid/${encodeURIComponent(gamertag)}/BEDROCK`;

    const response = await fetch(url);

    if (!response.ok) {
        return {
            exists: false,
            gamertag
        };
    }

    const data = await response.json();

    return {
        exists: true,
        gamertag: data.name ?? gamertag,
        xuid: data.xuid,
        uuid: data.uuid
    };
}

module.exports = {
    searchBedrockPlayer
};