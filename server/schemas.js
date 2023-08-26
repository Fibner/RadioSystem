const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    facebookId: String,
    name: String,
    picture_url: String,
    authorizationDate: Date
  });
let songSchema = new mongoose.Schema({
    songId: String,
    title: String,
    thumbnail: String,
    publishedDate: Date,
    link: String,
    viewCount: Number,
    likeCount: Number,
    dislikeCount: Number,
    commentCount: Number,
    addBy: String
})
let requestSchema = new mongoose.Schema({
    songId: String,
    title: String,
    thumbnail: String,
    publishedDate: Date,
    link: String,
    viewCount: Number,
    likeCount: Number,
    dislikeCount: Number,
    commentCount: Number,
    addBy: String,
    requestDate: Date
})
let historySchema = new mongoose.Schema({
    songId: String,
    title: String,
    link: String,
    playedDate: Date
}, {collection: 'history'})

let _user = mongoose.model("users", userSchema);
let _song = mongoose.model("songs", songSchema); 
let _request = mongoose.model("requests", requestSchema);
let _history = mongoose.model("history", historySchema);

module.exports = {
    User: _user,
    Song: _song,
    Request: _request,
    History: _history
}