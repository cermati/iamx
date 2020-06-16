'use strict';

let registry = require('iamx').CredentialsRegistry;
let Executor = require('iamx').IAMExecutor;

registry.set(
  'example-entry',
  'example',
  {
    credentials: {
      username: 'example',
      password: 'example'
    }
  });

let ExampleConnector = require('./ExampleConnector').Connector;
let executor = new Executor(ExampleConnector, registry.get('example-entry'));

let context = {
  username: 'example-user',
  password: 'example-password'
};

// Provision user access according to context
executor.provision(context).then((returnedContext) => {
  console.log(context);
  console.log(returnedContext);
});

// Revoke user access according to context
executor.revoke(context).then((returnedContext) => {
  console.log(context);
  console.log(returnedContext);
});
