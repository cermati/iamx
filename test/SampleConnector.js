'use strict';

const ENGINE           = 'sample-engine';
const NAME             = 'Sample Connector';
const VERSION          = '1.0.0';
const EXECUTIONS       = [ 'provision', 'revoke', 'show', 'fetchBatch' ];

const REGVALSPEC       = {
  type: 'object',
  properties: {
    credentials: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: [ 'username', 'password' ]
    }
  },
  required: [ 'credentials' ]
};

const WRITECONTEXTSPEC = {
  type: "object",
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: [ 'username', 'password' ]
};

const READCONTEXTSPEC  = {
  type: "object",
  properties: {
    keyword: { type: 'string' },
    page: { type: 'integer', default: 1 }
  },
  required: [ 'keyword' ]
};

const LISTCONTEXTSPEC = {
  type: "object",
  properties: {
    keyword: { type: 'string' },
    page: { type: 'integer', default: 1 }
  },
  required: [ 'keyword' ]
}

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

  listContextFormat () {
    return LISTCONTEXTSPEC;
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

  fetchBatch (context) {
    return this.Promise.resolve(context)
  }
};
