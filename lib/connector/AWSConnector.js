"use strict";

const ENGINE     = 'aws';
const NAME       = 'IAMX AWS Connector';
const VERSION    = '1.0.0';
const CONTEXTS   = [ 'user', 'group', 'role' ];
const EXECUTIONS = [ 'provision', 'revoke' ];

exports.Connector = class AWSConnector {
  constructor(config = {}) {
    if (config.engine != this.engine()) {
      throw(`Engine mismatch, class engine is ${this.engine} while loaded engine is ${config.engine}`);
    }
    if (!config.data) {
      throw(`Config data is empty`);
    }
    if ((!config.data.credentials) || (config.data.credentials && (!config.data.credentials.accessKeyId || !config.data.credentials.secretAccessKey))) {
      throw(`Missing accessKeyId or secretAccessKey credentials in config`);
    }
    if (!config.data.region) {
      throw(`Missing region in config`);
    }
    if (!config.data.defaultPolicyArn) {
      throw(`Missing defaultPolicyArn in config`);
    }
    if (!config.data.defaultPolicyArn.user) {
      throw(`Missing defaultPolicyArn.user in config`);
    }

    this.config = config.data;
    this.Promise = require('bluebird');

    this.AWS = require('aws-sdk');
    this.AWS.config.setPromisesDependency(this.Promise);
    this.AWS.config.update({
      accessKeyId: this.config.credentials.accessKeyId,
      secretAccessKey: this.config.credentials.secretAccessKey,
      region: this.config.region
    });

    this.IAM = new this.AWS.IAM({ apiVersion: '2010-05-08' });
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

  supportedContexts () {
    return CONTEXTS;
  };

  supportedExecution () {
    return EXECUTIONS;
  };

  provision (context) {
    let mContext = { ...context };
    return this._createUser(mContext)
      .then(this._attachPolicy(mContext))
      .then(this._createLoginProfile(mContext))
      .then(() => this.Promise.resolve(mContext));
  };
  
  revoke (context) {
    let mContext = { ...context };
    return this._deleteLoginProfile(mContext)
      .then(this._detachPolicy(mContext))
      .then(this._deleteUser(mContext))
      .then(() => this.Promise.resolve(mContext));
  };

  _createUser (context) {
    return this.IAM.createUser({
      UserName: context.username
    }).promise();
  };
  
  _deleteUser (context) {
    return this.IAM.deleteUser({
      UserName: context.username
    }).promise();
  }
  
  _createLoginProfile (context) {
    let randomstring = require('randomstring');
    context.newPassword = randomstring.generate();

    return this.IAM.createLoginProfile({
      UserName: context.username,
      Password: context.newPassword,
      PasswordResetRequired: true
    }).promise();
  };
  
  _deleteLoginProfile (context) {
    return this.IAM.deleteLoginProfile({
      UserName: context.username
    }).promise();
  };
  
  _attachPolicy (context) {
    return this.IAM.attachUserPolicy({
      UserName: context.username,
      PolicyArn: context.userPolicyArn
    }).promise();
  };
  
  _detachPolicy (context) {
    return this.IAM.detachUserPolicy({
      UserName: context.username,
      PolicyArn: context.userPolicyArn
    }).promise();
  };
};
