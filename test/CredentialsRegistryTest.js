'use strict';

let describe = require('mocha').describe;
let it = require('mocha').it;
let assert = require('chai').assert;

describe('Credentials Registry', () => {
  let credReg = require('../lib/index').CredentialsRegistry;
  let sampleYAML = 'test/sample.yml';
  let expectedRegVal = [
    {
      key: 'sample-key',
      engine: 'sample-engine',
      data: {
        credentials: {
          username: 'sample-username',
          password: 'sample-password'
        }
      }
    },
    {
      key: 'sample-key-2',
      engine: 'sample-engine',
      data: {
        credentials: {
          username: 'sample-username',
          password: 'sample-password'
        }
      }
    },
  ];

  credReg.set(expectedRegVal[0].key, expectedRegVal[0].engine, expectedRegVal[0].data);

  it('can set and get value to registry', () => {
    let retrievedRegVal = credReg.get(expectedRegVal[0].key);

    assert.equal(retrievedRegVal.engine, expectedRegVal[0].engine);
    assert.equal(retrievedRegVal.data.credentials.username, expectedRegVal[0].data.credentials.username);
    assert.equal(retrievedRegVal.data.credentials.password, expectedRegVal[0].data.credentials.password);
  });

  it('can truncate registry value', () => {
    let retrievedRegVal = credReg.get(expectedRegVal[0].key);
    assert.equal(retrievedRegVal.engine, expectedRegVal[0].engine);

    credReg.truncate();
    retrievedRegVal = credReg.get(expectedRegVal[0].key);
    assert.equal(retrievedRegVal, undefined);
  });

  it('can load values from YAML with anchor and merge key', () => {
    credReg.loadYAML(sampleYAML);
    let retrievedRegVal = credReg.get(expectedRegVal[1].key);

    assert.equal(retrievedRegVal.engine, expectedRegVal[1].engine);
    assert.equal(retrievedRegVal.data.credentials.username, expectedRegVal[1].data.credentials.username);
    assert.equal(retrievedRegVal.data.credentials.password, expectedRegVal[1].data.credentials.password);
  });
});
