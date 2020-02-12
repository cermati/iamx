'use strict';

let registry = require('iamx').CredentialsRegistry;
let Executor = require('iamx').IAMExecutor;

registry.set(
  'example-entry',
  'example',
  {
    credentials: {
      accessKeyId: 'example',
      secretAccessKey: 'example'
    },
    region: 'ap-southeast-1'
  });

let ExampleConnector = require('./ExampleConnector').Connector;
let executor = new Executor(ExampleConnector, registry.fetch('example-entry'));

let context = {
  username: 'example-user',
  userPolicyArn: 'example-user-policy-arn'
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
