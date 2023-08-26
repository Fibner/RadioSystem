const { Song, History, User, Request } = require("../schemas");

var _randomCount = 0;
function randomSong() {
  return new Promise((resolve, reject) => {
    Song.count().exec(function (err, count) {
      var random = Math.floor(Math.random() * count);
      Song.findOne()
        .skip(random)
        .exec(function (err, song) {
          if (err) {
            reject(err);
          } else {
            History.findOne({
              songId: song.songId,
              playedDate: {
                $gte: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1)
              },
            }).exec(function (err, result) {
              console.log(_randomCount);
              if (err) {
                reject(err);
              } else if (result) {
                // Jeśli songId jest w kolekcji history, wylosuj nowy
                if(_randomCount>100) reject("can't find song wasn't play today")
                _randomCount++;
                randomSong().then(resolve).catch(reject);
              } else {
                // Jeśli songId nie jest w kolekcji history, zwróć go
                _randomCount = 0;
                resolve(song.songId);
              }
            });
            // resolve(result.songId);
          }
        });
    });
  });
}
function getSong(id) {
  return new Promise((resolve, reject) => {
    Song.findOne({ songId: id }).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
function addHistory(song) {
  let history = new History({
    songId: song.songId,
    title: song.title,
    link: song.link,
    playedDate: new Date(),
  });

  history.save();
}
function getHistory() {
  return new Promise((resolve, reject) => {
    History.find({})
      .sort({ playedDate: -1 })
      .exec((err, result) => {
        if (err) return reject(err);
        let history = [];
        result.forEach((song) => {
          history.push(song);
        });
        resolve(history);
      });
  });
}
function getUsers() {
  return new Promise((resolve, reject) => {
    User.find({}).exec((err, result) => {
      if (err) return reject(err);
      let users = [];
      result.forEach((user) => {
        users.push(user);
      });
      resolve(users);
    });
  });
}
function getRequests() {
  return new Promise((resolve, reject) => {
    Request.find({}).exec((err, result) => {
      if (err) return reject(err);
      let requests = [];
      result.forEach((request) => {
        requests.push(request);
      });
      resolve(requests);
    });
  });
}
async function declineRequest(id){
  await Request.deleteOne({songId: id});
}
async function acceptRequest(id){
  await new Promise(async (resolve, reject)=>{
    let song = await Request.findOne({songId: id});
    let newSong = new Song({
      songId: song.songId,
      title: song.title,
      thumbnail: song.thumbnail,
      publishedDate: song.publishedDate,
      link: song.link,
      viewCount: song.viewCount,
      likeCount: song.likeCount,
      dislikeCount: song.dislikeCount,
      commentCount: song.commentCount,
      addBy: song.addBy,
    });
    newSong.save(async (err)=>{
      if(err) return reject(err);
      await Request.findOneAndRemove({songId: id});
      resolve();
    })
  })
}
function getSongs(){
  return new Promise((resolve, reject) => {
    Song.find({}).exec((err, result) => {
      if (err) return reject(err);
      let songs = [];
      result.forEach((song) => {
        songs.push(song);
      });
      resolve(songs);
    });
  });
}
async function deleteSong(id){
  await Song.findOneAndRemove({songId: id})
}
module.exports = {
  randomSong,
  getSong,
  addHistory,
  getHistory,
  getUsers,
  getRequests,
  declineRequest,
  acceptRequest,
  getSongs,
  deleteSong
};
