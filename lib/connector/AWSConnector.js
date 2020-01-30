"use strict";

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
    return 'aws';
  };

  provision (account) {
    return this._createUser(account)
      .then(this._attachPolicy(account))
      .then(this._createLoginProfile(account));
  };
  
  revoke (account) {
    return this._deleteLoginProfile(account)
      .then(this._detachPolicy(account))
      .then(this._deleteUser(account));
  };

  _createUser (account) {
    return this.IAM.createUser({
      UserName: account.username
    }).promise();
  };
  
  _deleteUser (account) {
    return this.IAM.deleteUser({
      UserName: account.username
    }).promise();
  }
  
  _createLoginProfile (account) {
    let randomstring = require('randomstring');

    return this.IAM.createLoginProfile({
      UserName: account.username,
      Password: randomstring.generate(),
      PasswordResetRequired: true
    }).promise();
  };
  
  _deleteLoginProfile (account) {
    return this.IAM.deleteLoginProfile({
      UserName: account.username
    }).promise();
  };
  
  _attachPolicy (account) {
    return this.IAM.attachUserPolicy({
      UserName: account.username,
      PolicyArn: this.config.defaultPolicyArn
    }).promise();
  };
  
  _detachPolicy (account) {
    return this.IAM.detachUserPolicy({
      UserName: account.username,
      PolicyArn: this.config.defaultPolicyArn
    }).promise();
  };
};
