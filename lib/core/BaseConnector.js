"use strict";

exports.Connector = class BaseConnector {
  constructor(config = {}) {
    this.config = config;
    this.Promise = require('bluebird');
  };

  engine () {
    throw(`Method engine() not implemented`);
  };

  version () {
    throw(`Method version() not implemented`);
  };

  name () {
    throw(`Method name() not implemented`);
  };

  supportedExecution () {
    throw(`Method supportedExecution() not implemented`);
  };

  registryFormat () {
    throw(`Method registryFormat() not implemented`);
  };

  readContextFormat () {
    throw(`Method readContextFormat() not implemented`);
  };

  writeContextFormat () {
    throw(`Method writeContextFormat() not implemented`);
  };

  provision (context) {
    throw(`Method provision() not implemented`);
  };

  revoke (context) {
    throw(`Method revoke() not implemented`);
  };

  show (context) {
    throw(`Method show() not implemented`);
  }
};
