const request = require("sync-request");
const CryptoJS = require("crypto-js");
const SecurityManager = {
  salt: null, // Generated at https://www.random.org/strings
  username: null,
  key: null,
  userInfo: null,
  ip: null,
  appUser: "",
  ipUrl: "http://icanhazip.com/",
  logonUrl: "logon",
  init: function (appKey) {
    this.salt = appKey;
  },
  generate: function (username, password, ip, userAgent) {
    // Set the username.
    username = SecurityManager.appUser + username;
    // Set the key to a hash of the user's password + salt.
    var key = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        [CryptoJS.MD5(password), SecurityManager.salt].join(":"),
        SecurityManager.salt
      )
    );
    // Set the client IP address.
    // SecurityManager.ip = SecurityManager.ip || SecurityManager.getIp();
    console.log("sm:user:" + username);
    console.log("sm:pwd:" + CryptoJS.MD5(password));
    console.log("sm:ip:" + ip);
    console.log(
      "sm:nav:" + userAgent.replace(/ \.NET.+;/, "").replace(/ SLCC2;/, "")
    );
    // Persist key pieces.
    /*     if (SecurityManager.username) {
          localStorage['SecurityManager.username'] = SecurityManager.username;
          localStorage['SecurityManager.key'] = SecurityManager.key;
      } */
    // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
    var ticks = new Date().getTime() * 10000 + 621355968000000000;
    // Construct the hash body by concatenating the username, ip, and userAgent.
    var message = [
      username,
      ip,
      userAgent.replace(/ \.NET.+;/, "").replace(/ SLCC2;/, ""),
      ticks,
    ].join(":");
    // console.log(message);
    // var message = [SecurityManager.username, SecurityManager.ip, ticks].join(':');
    // Hash the body, using the key.
    var hash = CryptoJS.HmacSHA256(message, key);
    // Base64-encode the hash to get the resulting token.
    var token = CryptoJS.enc.Base64.stringify(hash);
    // Include the username and timestamp on the end of the token, so the server can validate.
    var tokenId = [username, ticks].join(":");
    // Base64-encode the final resulting token.
    var tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(":"));
    return CryptoJS.enc.Base64.stringify(tokenStr);
  },
};

module.exports = SecurityManager;
