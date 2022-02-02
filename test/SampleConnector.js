'use strict';

const ENGINE           = 'sample-engine';
const NAME             = 'Sample Connector';
const VERSION          = '1.0.0';
const EXECUTIONS       = [ 'provision', 'revoke', 'show', 'fetchBatch', 'listAvailableAccessContext' ];

const REG_VAL_SPEC       = {
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

const WRITE_CONTEXT_SPEC = {
  type: "object",
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: [ 'username', 'password' ]
};

const READ_CONTEXT_SPEC  = {
  type: "object",
  properties: {
    keyword: { type: 'string' },
    page: { type: 'integer', default: 1 }
  },
  required: [ 'keyword' ]
};

const LIST_CONTEXT_SPEC = {
  type: "object",
  properties: {
    keyword: { type: 'string' },
    page: { type: 'integer', default: 1 }
  },
  required: [ 'keyword' ]
}

const LIST_AVAILABLE_ACCESS_CONTEXT_SPEC = {
  type: "object",
  properties: {
    keyword: { type: 'string' },
  },
  required: [ 'keyword' ]
}

const listAccessContextMock = ['context-1', 'context-2', 'context-3'];

class SampleConnector {
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
    return REG_VAL_SPEC;
  };

  readContextFormat () {
    return READ_CONTEXT_SPEC;
  };

  writeContextFormat () {
    return WRITE_CONTEXT_SPEC;
  };

  listContextFormat () {
    return LIST_CONTEXT_SPEC;
  };

  listAvailableAccessContextFormat () {
    return LIST_AVAILABLE_ACCESS_CONTEXT_SPEC;
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
    return this.Promise.resolve(context);
  }

  listAvailableAccessContext (context) {
    return this.Promise.resolve(listAccessContextMock);
  }
};

module.exports = {
  Connector: SampleConnector,
  listAccessContextMock
}
