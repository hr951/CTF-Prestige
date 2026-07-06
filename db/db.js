const mongoose = require('mongoose');

const EarthTopSchema = new mongoose.Schema({
    _id: { type: String }, // サーバーID
    channelId_del: { type: [String] }, // 削除対象チャンネルID
    channelId_send: { type: String }, // 送信対象チャンネルID
    deleteTime: { type: Number }, // 削除までの時間（分）
});
const EarthTopUtils = mongoose.model('EarthTopUtils', EarthTopSchema);

module.exports = { EarthTopUtils };