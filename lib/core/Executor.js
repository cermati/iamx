"use strict";

const PROVISION = 'provision';
const REVOKE    = 'revoke';

/**
 * The class for executor objects. The executor object carries out the execution of the IAM workflow
 * with each having their own separate context of executions.
 */
exports.Executor = class Executor {
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
   * @param {Object} context    JSON object containing account information and context to be provisioned
   */
  provision (context) {
    this._validateConnectorSupport(PROVISION);
    this.executionHooks.beforeProvision(this.objStateRegister);
    this._execProvision(context).then(
      this.executionHooks.afterProvision(this.objStateRegister)
    ).catch(
      this.executionHooks.errorProvision(this.objStateRegister)
    );
  };

  /**
   * Triggering the account revocation workflow of the executor
   * 
   * @param {Object} context    JSON object containing account information and context to be revoked
   */
  revoke (context) {
    this._validateConnectorSupport(REVOKE);
    this.executionHooks.beforeRevoke(this.objStateRegister);
    this._execRevoke(context).then(
      this.executionHooks.afterRevoke(this.objStateRegister)
    ).catch(
      this.executionHooks.errorRevoke(this.objStateRegister)
    );
  };

  /**
   * Executing the account provisioning workflow of the connector
   * 
   * @param {Object} context    JSON object containing account information and context to be provisioned
   */
  _execProvision (context) {
    let self = this;
    return this.connector.provision(context);
  }

  /**
   * Triggering the account revocation workflow of the connector
   * 
   * @param {Object} context    JSON object containing account information and context to be revoked
   */
  _execRevoke (context) {
    return this.connector.revoke(context);
  };

  _validateConnectorSupport (executionModule) {
    if (!this.connector.supportedExecution().includes(executionModule)) {
      throw(`Connector ${this.connector.name()} version ${this.connector.version()} doesn't provide support for '${executionModule}' execution`);
    };
  };
};
