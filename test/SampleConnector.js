'use strict';

const ENGINE           = 'sample-engine';
const NAME             = 'Sample Connector';
const VERSION          = '1.0.0';
const EXECUTIONS       = [ 'provision', 'revoke', 'show' ];
const REGVALSPEC       = { credentials: { required: true, type: 'object' } };
const WRITECONTEXTSPEC = { username: { required: true, type: 'string' }, password: { required: true, type: 'string' } };
const READCONTEXTSPEC  = { keyword: { required: true, type: 'string' }, page: { required: false, type: 'number' } };

exports.Connector = class SampleConnector {
  constructor(config = {}) {
    this.config = config;
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

  readContextFormat () {
    return READCONTEXTSPEC;
  };

  writeContextFormat () {
    return WRITECONTEXTSPEC;
  };

  provision (context) {
    return this.Promise.resolve(context);
  };

  revoke (context) {
    return this.Promise.resolve(context);
  };

  show (context) {
    return this.Promise.resolve(context);
  }
};
