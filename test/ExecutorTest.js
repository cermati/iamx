'use strict';

let describe = require('mocha').describe;
let it = require('mocha').it;
let assert = require('chai').assert;

describe('IAM Executor', () => {
  let credReg = require('../lib/index').CredentialsRegistry;
  let sampleYAML = 'test/sample.yml';
  let registryKey = 'sample-key';

  let SampleConnector = require('./SampleConnector').Connector;
  let Executor = require('../lib/index').IAMExecutor;

  credReg.loadYAML(sampleYAML);
  let regVal = credReg.get(registryKey);
  let sampleWriteContext = {
    username: 'sample-username',
    password: 'sample-password'
  };
  let sampleReadContext = {
    keyword: 'sample-keyword',
    page: 1
  };

  it('can execute provisioning workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.provision(sampleWriteContext).then((responseContext) => {
      assert.equal(responseContext.username, sampleWriteContext.username);
      assert.equal(responseContext.password, sampleWriteContext.password);
    });
  });

  it('can execute revocation workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.revoke(sampleWriteContext).then((responseContext) => {
      assert.equal(responseContext.username, sampleWriteContext.username);
      assert.equal(responseContext.password, sampleWriteContext.password);
    });
  });

  it('can execute data retrieval workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.show(sampleReadContext).then((responseContext) => {
      assert.equal(responseContext.keyword, sampleReadContext.keyword);
      assert.equal(responseContext.page, sampleReadContext.page);
    });
  });
});
