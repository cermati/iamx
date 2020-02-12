'use strict';

let describe = require('mocha').describe;
let it = require('mocha').it;
let assert = require('chai').assert;

describe('Credentials Registry', () => {
  let credReg = require('../lib/index').CredentialsRegistry;
  let sampleYAML = 'test/sample.yml';
  let sampleRegVal = {
    key: 'sample-key',
    engine: 'sample-engine',
    data: {
      credentials: {
        username: 'sample-username',
        password: 'sample-password'
      }
    }
  };

  it('can set and get value to registry', () => {
    credReg.set(sampleRegVal.key, sampleRegVal.engine, sampleRegVal.data);
    let retrievedRegVal = credReg.get(sampleRegVal.key);

    assert.equal(retrievedRegVal.engine, sampleRegVal.engine);
    assert.equal(retrievedRegVal.data.credentials.username, sampleRegVal.data.credentials.username);
    assert.equal(retrievedRegVal.data.credentials.password, sampleRegVal.data.credentials.password);
  });

  it('can truncate registry value', () => {
    let retrievedRegVal = credReg.get(sampleRegVal.key);
    assert.equal(retrievedRegVal.engine, sampleRegVal.engine);

    credReg.truncate();
    retrievedRegVal = credReg.get(sampleRegVal.key);
    assert.equal(retrievedRegVal, undefined);
  });

  it('can load values from YAML', () => {
    credReg.loadYAML(sampleYAML);
    let retrievedRegVal = credReg.get(sampleRegVal.key);

    assert.equal(retrievedRegVal.engine, sampleRegVal.engine);
    assert.equal(retrievedRegVal.data.credentials.username, sampleRegVal.data.credentials.username);
    assert.equal(retrievedRegVal.data.credentials.password, sampleRegVal.data.credentials.password);
  });
});
