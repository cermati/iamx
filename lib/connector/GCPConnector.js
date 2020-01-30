"use strict";

exports.GCPConnector = class Connector {
  constructor(config = {}) {
    if (config.engine != this.engine()) {
      throw(`Engine mismatch, class engine is ${this.engine} while loaded engine is ${config.engine}`);
    }
    if ((!config.credentials) || (config.credentials && (!config.credentials.accessKeyId || !config.credentials.secretAccessKey))) {
      throw(`accessKeyId and secretAccessKey is required in credentials`);
    }
    if (!config.options || (config.options && (!config.options.defaultPolicyArn || !config.options.region))) {
      throw(`defaultPolicyArn and region is required in options`);
    }
    this.credentials = config.credentials;
    this.options = config.options;

    this.Promise = require('bluebird');
  };

  engine () {
    return 'aws';
  };

  provision (account) {
    return this.Promise.resolve(null);
  };
  
  revoke (account) {
    return this.Promise.resolve(null);
  };
};
