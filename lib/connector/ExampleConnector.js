"use strict";

const BaseConnector    = require('../core/BaseConnector').Connector;

const ENGINE           = 'example';
const NAME             = 'IAMX Example Connector';
const VERSION          = '1.0.0';
const EXECUTIONS       = [ 'provision', 'revoke', 'show' ];
const REGVALSPEC       = { credentials: { required: true, type: 'object' }, region: { required: true, type: 'string' } };
const WRITECONTEXTSPEC = { username: { required: true, type: 'string' }, something: { required: true, type: 'number' } };
const READCONTEXTSPEC  = { username: { required: true, type: 'string' }, something: { required: true, type: 'number' }, page: { required: true, type: 'number' } };

exports.Connector = class ExampleConnector extends BaseConnector {
  constructor(config = {}) {
    super(config);
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
