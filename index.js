const axios = require("axios");
const { HmacSHA256, Base64, MD5 } = require("crypto-js");
const SecurityManager = {
  salt: null,
  apiUrl: null,
  username: null,
  password: null,
  key: null,
  generate() {},
  getKey() {
    return this.key;
  },
  init({ username, password, appKey, apiUrl }) {
    this.salt = appKey;
    this.apiUrl = apiUrl;
    this.username = username;
    this.password = password;

    this.key = Base64.stringify(
      HmacSHA256([MD5(this.password), this.salt].join(":"), this.salt)
    );
  },
};

module.exports = SecurityManager;
