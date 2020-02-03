"use strict";

const ENGINE      = 'example';
const NAME        = 'IAMX Example Connector';
const VERSION     = '1.0.0';
const EXECUTIONS  = [ 'provision', 'revoke' ];
const REGVALSPEC  = { username: { required: true, type: 'string' }, something: { required: true, type: 'number' } };
const CONTEXTSPEC = { username: { required: true, type: 'string' }, something: { required: true, type: 'number' } };

exports.Connector = class GCPConnector {
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

  supportedExecution () {
    return EXECUTIONS;
  };

  registryFormat () {
    return REGVALSPEC;
  };

  contextFormat () {
    return CONTEXTSPEC;
  };

  provision (context) {
    return this.Promise.resolve(context);
  };

  revoke (context) {
    return this.Promise.resolve(context);
  };
};
