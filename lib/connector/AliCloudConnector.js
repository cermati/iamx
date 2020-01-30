"use strict";

exports.Connector = class AliCloudConnector {
  constructor(config = {}) {
    if (config.engine != this.engine()) {
      throw(`Engine mismatch, class engine is ${this.engine} while loaded engine is ${config.engine}`);
    }
    if (!config.data) {
      throw(`Config data is empty`);
    }
    if ((!config.data.credentials) || (config.data.credentials && (!config.data.credentials.accessKeyId || !config.data.credentials.accessKeySecret))) {
      throw(`Missing accessKeyId or accessKeySecret credentials in config`);
    }
    if (!config.data.region) {
      throw(`Missing region in config`);
    }
    if (!config.data.defaultPolicyArn) {
      throw(`Missing defaultPolicyArn in config`);
    }

    this.config = config.data;
    this.Promise = require('bluebird');
  };

  engine () {
    return 'alicloud';
  };

  provision (account) {
    return this.Promise.resolve(null);
  };
  
  revoke (account) {
    return this.Promise.resolve(null);
  };
};
