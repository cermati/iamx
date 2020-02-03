"use strict";

const ENGINE     = 'alicloud';
const NAME       = 'IAMX AliCloud Connector';
const VERSION    = '1.0.0';
const CONTEXTS   = [ 'user', 'group', 'role' ];
const EXECUTIONS = [ 'provision', 'revoke' ];

exports.Connector = class AliCloudConnector {
  constructor(config = {}) {
    this.config = config.data;
    this.Promise = require('bluebird');
  };

  engine () {
    return ENGINE;
  };

  version () {
    return VERSION;
  };

  name () {
    return NAME;
  };

  supportedContexts () {
    return CONTEXTS;
  };

  supportedExecution () {
    return EXECUTIONS;
  };

  provision (context) {
    return this.Promise.resolve(null);
  };
  
  revoke (context) {
    return this.Promise.resolve(null);
  };
};
