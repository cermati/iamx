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

  const listAccessContextMock = require('./SampleConnector').listAccessContextMock;
  const listAccessContextExtensionOptionsMock = require('./SampleConnector').listAccessContextExtensionOptionsMock;

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

  let sampleListAvailableAccessContext = {
    keyword: 'sample-keyword'
  };

  let sampleListAccessContextExtensionOptions = {
    keyword: 'sample-keyword'
  };

  it('can execute provisioning workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.provision(sampleWriteContext).then((responseContext) => {
      assert.equal(responseContext.username, sampleWriteContext.username);
      assert.equal(responseContext.password, sampleWriteContext.password);
    }).catch(e => console.error(e));
  });

  it('can execute revocation workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.revoke(sampleWriteContext).then((responseContext) => {
      assert.equal(responseContext.username, sampleWriteContext.username);
      assert.equal(responseContext.password, sampleWriteContext.password);
    }).catch(e => console.error(e));
  });

  it('can execute data retrieval workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.show(sampleReadContext).then((responseContext) => {
      assert.equal(responseContext.keyword, sampleReadContext.keyword);
      assert.equal(responseContext.page, sampleReadContext.page);
    }).catch(e => console.error(e));
  });

  it('can execute fetchBatch workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.fetchBatch(sampleReadContext).then((responseContext) => {
      assert.equal(responseContext.keyword, sampleReadContext.keyword);
      assert.equal(responseContext.page, sampleReadContext.page);
    }).catch(e => console.error(e));
  });

  it('can execute listAvailableAccessContext workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.listAvailableAccessContext(sampleListAvailableAccessContext).then((responseContext) => {
      assert.deepEqual(responseContext, listAccessContextMock);
    }).catch(e => console.error(e));
  });

  it('can execute listAccessContextExtensionOptions workflow', () => {
    let executor = new Executor(SampleConnector, regVal);
    executor.listAccessContextExtensionOptions(sampleListAccessContextExtensionOptions).then((responseContext) => {
      assert.deepEqual(responseContext, listAccessContextExtensionOptionsMock);
    }).catch(e => console.error(e));
  });
});
