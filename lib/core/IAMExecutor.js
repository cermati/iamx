"use strict";

let Promise = require('bluebird');

/**
 * The class for executor objects. The executor object carries out the execution of the IAM workflow
 * with each having their own separate context of executions.
 */
exports.IAMExecutor = class Executor {
  /**
   * The constructor for the executor objects
   * 
   * @param {Object} connector        Connector interface to the target platform
   * @param {Object} executionHooks   Hooks to be included in the execution workflow of the executor
   */
  constructor (connectorClass, registryValue, executionHooks = {}) {
    this.connector = new connectorClass (registryValue);;
    this.constructStateRegister();
    this.constructHooks(executionHooks);
  };

  /**
   * Constructing the executor state register, supports importing from a JSON object
   * 
   * @param {Object} importedRegister 
   */
  constructStateRegister (importedRegister = {}) {
    this.objStateRegister = importedRegister;
  };

  /**
   * Constructing the execution hooks of the executor object, accepts a JSON object containing
   * hook function definitions to be called during the execution process
   * 
   * @param {Object} executionHooks    JSON Object containing the execution hook functions
   */
  constructHooks (executionHooks) {
    this.executionHooks = {};

    this.executionHooks.beforeProvision = executionHooks.beforeProvision || function () {};
    this.executionHooks.afterProvision = executionHooks.afterProvision || function () {};
    this.executionHooks.errorProvision = executionHooks.errorProvision || function () {};

    this.executionHooks.beforeRevoke = executionHooks.beforeRevoke || function () {};
    this.executionHooks.afterRevoke = executionHooks.afterRevoke || function () {};
    this.executionHooks.errorRevoke = executionHooks.errorRevoke || function () {};
  };

  /**
   * Triggering the account provisioning workflow of the executor
   * 
   * @param {Object} account    JSON object containing account information to be provisioned
   */
  provision (account) {
    this.executionHooks.beforeProvision(this.objStateRegister);
    this.execProvision(account).then(
      this.executionHooks.afterProvision(this.objStateRegister)
    ).catch(
      this.executionHooks.errorProvision(this.objStateRegister)
    );
  };

  /**
   * Triggering the account revocation workflow of the executor
   * 
   * @param {Object} account    JSON object containing account information to be revoked
   */
  revoke (account) {
    this.executionHooks.beforeRevoke(this.objStateRegister);
    this.execRevoke(account).then(
      this.executionHooks.afterRevoke(this.objStateRegister)
    ).catch(
      this.executionHooks.errorRevoke(this.objStateRegister)
    );
  };

  /**
   * Executing the account provisioning workflow of the connector
   * 
   * @param {Object} account    JSON object containing account information to be provisioned
   */
  execProvision (account) {
    let self = this;
    return this.connector.provision(account).then(function (userData) {
      self.objStateRegister.userMetadata = userData;
    });
  }

  /**
   * Triggering the account revocation workflow of the connector
   * 
   * @param {Object} account    JSON object containing account information to be revoked
   */
  execRevoke (account) {
    return this.connector.revoke(account);
  };
};
