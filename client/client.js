import {
  registerBpmnJSPlugin,
  registerBpmnJSModdleExtension
} from 'camunda-modeler-plugin-helpers';

var extendedPropertiesProvider = require('./ExtendedPropertiesProvider');
var magicModdle = require('./descriptors/magic.json');

registerBpmnJSPlugin(extendedPropertiesProvider);
registerBpmnJSModdleExtension(magicModdle);
