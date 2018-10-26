let registerBpmnJSPlugin = require('./camunda-plugin-helper').registerBpmnJSPlugin;
let registerBpmnJSModdle = require('./camunda-plugin-helper').registerBpmnJSModdle;

var extendedPropertiesProvider = require('./ExtendedPropertiesProvider');
var magicModdle = require('./descriptors/magic.json');

registerBpmnJSPlugin(extendedPropertiesProvider);
registerBpmnJSModdle('magic', magicModdle);
