"use strict";

const PROVISION = 'provision';
const REVOKE    = 'revoke';
const SHOW      = 'show';
const VERSION   = '0.0.1';

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
    this._validateRegistryValue(connectorClass, { ...registryValue });
    this._initConnector(connectorClass, { ...registryValue });
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
    this._validateContext(context, PROVISION);
    return this._execProvision(context);
  };

  /**
   * Triggering the account revocation workflow of the executor
   * 
   * @param {Object} context          JSON object containing account information and context to be revoked
   */
  revoke (context) {
    this._validateConnectorSupport(REVOKE);
    this._validateContext(context, REVOKE);
    return this._execRevoke(context);
  };

  /**
   * Show information from target platform
   * 
   * @param {Object} context          JSON object containing query parameters for the objects to be shown
   */
  show (context) {
    this._validateConnectorSupport(SHOW);
    this._validateContext(context, SHOW);
    return this._execShow(context);
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
   * Querying objects to be shown from the connector
   * 
   * @param {Object} context          JSON object containing query parameters for the objects to be shown
   */
  _execShow (context) {
    let mContext = { ...context };
    return this.connector.show(mContext);
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

  /**
   * Initiate connector object based on the configured regisstry value
   * 
   * @param {Object} connectorClass    Connector class to be used to create the connector Object
   * @param {Object} registryValue     JSON object containing registry value to be configured to the connector object
   */
  _initConnector (connectorClass, registryValue) {
    this.connector = new connectorClass ({ ...registryValue });
    if (registryValue.engine != this.connector.engine()) {
      throw(`Engine mismatch, connector engine is ${this.connector.engine()} while loaded engine is ${registryValue.engine}`);
    }
  };

  /**
   * Validate registry value format for a connector's configured accepted registry value format
   * 
   * @param {Object} connectorClass    Connector class to be used to create the connector Object
   * @param {Object} registryValue     JSON object containing registry value to be validated
   */
  _validateRegistryValue (connectorClass, registryValue) {
    let mValue = { ...registryValue };
    let testConnector = new connectorClass (mValue.data);
    this._validateObject(testConnector.registryFormat(), mValue.data);
  };

  /**
   * Validate context object format passed to the executor according to the valid format for the connector
   * 
   * @param {Object} context          JSON object containing context to be validated
   * @param {Object} execution        Execution flow whose context is to be validated
   */
  _validateContext (context, execution) {
    let mContext = { ...context };
    if (execution === SHOW) {
      this._validateObject(this.connector.readContextFormat(), mContext);
    }
    else {
      this._validateObject(this.connector.writeContextFormat(), mContext);
    }
  };

  /**
   * Validate a JSON object's format structure according to a format reference
   * 
   * @param {Object} format            JSON object containing the correct format for validation
   * @param {Object} value             JSON object containing the object to be validated
   */
  _validateObject (format, value) {
    let formatKeys = Object.keys(format);
    formatKeys.forEach((key) => {
      let spec = format[key];
      let val = value[key];

      if (spec.required && typeof val === 'undefined') {
        throw(`Missing required value for "${key}": expected "${spec.type}" for format spec ${JSON.stringify(format)}`)
      }

      if (typeof val !== 'undefined' && typeof val !== spec.type) {
        throw(`Invalid object passed for "${key}": expected "${spec.type}" got "${typeof val}" for format spec ${JSON.stringify(format)}`);
      }
    });
  };
};
