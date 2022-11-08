const Axios = require("axios").default;
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
  init(appKey) {
    this.salt = appKey;
  },
  async generate(username, password) {
    if ((username, password)) {
      this.logout();
    }

    this.username = this.username || this.appUser + username;
    this.key =
      this.key ||
      CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(
          [CryptoJS.MD5(password), this.salt].join(":"),
          this.salt
        )
      );

    this.ip = this.ip || (await this.getIp());
    console.log("SecurityManager", {
      usr: this.username,
      pwd: CryptoJS.MD5(password),
      ip: this.ip,
      nav: navigator.userAgent.replace(/ \.NET.+;/, "").replace(/ SLCC2;/, ""),
    });

    if (this.username) {
      localStorage["SecurityManager.username"] = this.username;
      localStorage["SecurityManager.key"] = this.key;

      const ticks = new Date().getTime() * 10000 + 621355968000000000;
      const message = [
        this.username,
        this.ip,
        navigator.userAgent.replace(/ \.NET.+;/, "").replace(/ SLCC2;/, ""),
        ticks,
      ].join(":");

      const hash = CryptoJS.HmacSHA256(message, this.key);
      const token = CryptoJS.enc.Base64.stringify(hash);
      var tokenId = [this.username, ticks].join(":");
      var tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(":"));
      return CryptoJS.enc.Base64.stringify(tokenStr);
    }
  },
  logout() {
    localStorage.removeItem("SecurityManager.username");
    this.username = null;
    localStorage.removeItem("SecurityManager.key");
    this.key = null;
    // if (redirectToLogin) window.location.href = SecurityManager.logonUrl;
  },
  async getIp() {
    const { data } = await Axios.get(this.ipUrl);
    return data;
  },
};

module.exports = SecurityManager;
