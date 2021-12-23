const axios = require("axios");
const { HmacSHA256, Base64, MD5 } = require("crypto-js");

const SecurityManager = {
  salt: undefined,
  username: null,
  key: null,
  userInfo: null,
  ip: null,
  appUser: "",
  ipUrl: "http://icanhazip.com/",
  logonUrl: "logon",
  async generate() {
    // // If the user is providing credentials, then create a new key.
    // if (this.username && this.password) {
    //   this.logout();
    // }
    // Set the username.
    // this.username = this.username || this.appUser + username;
    // Set the key to a hash of the user's password + salt.
    this.key =
      this.key ||
      Base64.stringify(
        HmacSHA256([MD5(this.password), this.salt].join(":"), this.salt)
      ); // Set the client IP address.
    this.ip = this.ip || (await this.getIp()); // Persist key pieces.
    if (this.username) {
      localStorage["SecurityManager.username"] = this.username;
      localStorage["SecurityManager.key"] = this.key;
    } // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
    const ticks = new Date().getTime() * 10000 + 621355968000000000;
    let message = [
      this.username,
      this.ip,
      navigator.userAgent.replace(/ \.NET.+;/, "").replace(/ SLCC2;/, ""),
      ticks,
    ].join(":"); // Hash the body, using the key.
    const hash = HmacSHA256(message, this.key); // Base64-encode the hash to get the resulting token.
    const token = Base64.stringify(hash); // Include the username and timestamp on the end of the token, so the server can validate.
    const tokenId = [this.username, ticks].join(":"); // Base64-encode the final resulting token.
    const tokenStr = utf8.parse([token, tokenId].join(":"));
    return Base64.stringify(tokenStr);
  },
  async getIp() {
    const xhr = await fetch(this.ipUrl, { method: "POST" });
    const text = await xhr.text();
    return text.replace(/\r?\n|\r/g, "");
  },
  logout(redirectToLogin) {
    localStorage.removeItem("SecurityManager.username");
    this.username = null;
    localStorage.removeItem("SecurityManager.key");
    this.key = null;
    if (redirectToLogin) window.location.href = this.logonUrl;
  },
  // ilk burası çalışacak
  init({ username, password, appKey, apiUrl }) {
    this.salt = appKey;
    this.apiUrl = apiUrl;
    this.username = username;
    this.password = password;
  },
};

module.exports = SecurityManager;
