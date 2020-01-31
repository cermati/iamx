"use strict";

const PROVISION = 'provision';
const REVOKE    = 'revoke';
const VERSION   = '1.0.0';

/**
 * The class for executor objects. The executor object carries out the execution of the IAM workflow
 * with each having their own separate context of executions.
 */
exports.Executor = class Executor {
  /**
   * The constructor for the executor objects
   * 
   * @param {Object} connector        Connector interface to the target platform
   * @param {Object} registryValue    Registry value entry to be used as the reference for execution
   */
  constructor (connectorClass, registryValue) {
    this.connector = new connectorClass ({ ...registryValue });
    this.Promise = require('bluebird');
  };

  /**
   * Getter for the executor version
   */
  version () {
    return VERSION;
  }

  /**
   * Triggering the account provisioning workflow of the executor
   * 
   * @param {Object} context          JSON object containing account information and context to be provisioned
   */
  provision (context) {
    this._validateConnectorSupport(PROVISION);
    return this._execProvision(context);
  };

  /**
   * Triggering the account revocation workflow of the executor
   * 
   * @param {Object} context          JSON object containing account information and context to be revoked
   */
  revoke (context) {
    this._validateConnectorSupport(REVOKE);
    return this._execRevoke(context);
  };

  /**
   * Executing the account provisioning workflow of the connector
   * 
   * @param {Object} context          JSON object containing account information and context to be provisioned
   */
  _execProvision (context) {
    let mContext = { ...context };
    return this.connector.provision(mContext);
  }

  /**
   * Triggering the account revocation workflow of the connector
   * 
   * @param {Object} context          JSON object containing account information and context to be revoked
   */
  _execRevoke (context) {
    let mContext = { ...context };
    return this.connector.revoke(mContext);
  };

  /**
   * Ensuring the connector supports the required execution module
   * 
   * @param {String} executionModule  Constant string containing the module of the executor to be checked from the connector
   */
  _validateConnectorSupport (executionModule) {
    if (!this.connector.supportedExecution().includes(executionModule)) {
      throw(`Connector ${this.connector.name()} v${this.connector.version()} doesn't provide support for '${executionModule}' execution on Executor v${this.version()}`);
    };
  };
};
