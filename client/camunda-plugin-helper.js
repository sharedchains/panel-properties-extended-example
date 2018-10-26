// var registerBpmnJSPlugin = require('camunda-modeler-plugin-helpers').registerBpmnJSPlugin;
// CODE TOOK FROM CAMUNDA-MODELER-PLUGIN-HELPERS
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
    var plugins = window.plugins || [];
    window.plugins = plugins;

    if (!plugin) {
        throw new Error('plugin not specified');
    }

    if (!type) {
        throw new Error('type not specified');
    }

    plugins.push({
        plugin: plugin,
        type: type
    });
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * Example use:
 *
 *    var registerBpmnJSPlugin = require('./camundaModelerPluginHelpers').registerBpmnJSPlugin;
 *    var module = require('./index');
 *
 *    registerBpmnJSPlugin(module);
 *
 * @param {Object} plugin
 */
function registerBpmnJSPlugin(plugin) {
    registerClientPlugin(plugin, 'bpmn.modeler.additionalModules');
}

function registerBpmnJSModdle(moddleName, moddlePackage) {
  if (typeof moddleName !== 'string') {
    throw new Error('moddleName should be a string');
  }
  if (typeof moddlePackage !== 'object') {
    throw new Error('moddlePackage should be the moddle object');
  }
  let plugin = {};
  plugin[moddleName] = moddlePackage;
  registerClientPlugin( plugin , 'bpmn.modeler.moddleExtensions');
}

module.exports = {
  registerBpmnJSPlugin : registerBpmnJSPlugin,
  registerBpmnJSModdle : registerBpmnJSModdle
};
