'use strict';

/**
 * Libraries to load and store data from YAML
 */

const fs = require('fs');
const YAML = require('yaml');

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
  get:      get,
  truncate: truncate,
  loadYAML: loadYAML
};

/**
 * Set a master credential in the registry
 *
 * @param {String} key
 * @param {String} engine
 * @param {Object} data
 */
function set (key, engine, data = {}) {
  credRegistry[key] = {
    engine:      engine,
    data:        data
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
 * Get value from credentials registry
 *
 * @param {String} key
 */
function get (key) {
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
  let fileContent = fs.readFileSync(filepath, 'utf8');

  // Enable merge keys (<<: *anchor_name) so that we can use anchor tag (&anchor_name)
  // and merge key to reduce duplication in the credentials registry config file
  // Ref: https://github.com/eemeli/yaml/blob/master/docs/03_options.md#schema-options
  let registryObjects = YAML.parse(fileContent, { merge: true });

  (registryObjects).forEach(regObject => {
    set(regObject.key, regObject.engine, regObject.data);
  });
};
