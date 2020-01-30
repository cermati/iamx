"use strict";

/**
 * Registry of master credentials used to manage the identity and access life cycle
 * on the platforms managed by the IAM Engine
 */
let credRegistry = {};

/**
 * Expose public methods 
 */
exports.Registry = {
  set:      set,
  remove:   remove,
  fetch:    fetch,
  truncate: truncate,
  loadYAML: loadYAML
};

/**
 * Set a master credential in the registry
 * 
 * @param {String} key
 * @param {String} engine
 * @param {Object} credentials 
 * @param {Object} options
 */
function set (key, engine, credentials = {}, options = {}) {
  credRegistry[key] = {
    engine:      engine,
    credentials: credentials,
    options:     options
  };
};

/**
 * Remove a master credential from the registry
 * 
 * @param {String} key
 */
function remove (key) {
  delete credRegistry[key];
};

/**
 * Fetch value from credentials registry
 * 
 * @param {String} key
 */
function fetch (key) {
  return credRegistry[key];
};

/**
 * Truncate registry
 */
function truncate () {
  credRegistry = {};
};

/**
 * Load value from YAML
 * 
 * @param {String} filepath
 */
function loadYAML (filepath) {
  // load from YAML file
};
