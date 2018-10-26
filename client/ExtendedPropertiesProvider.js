'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

var magicModdle = require('./descriptors/magic.json'),
  camundaModdlePackage = require('camunda-bpmn-moddle/resources/camunda');

// Require your custom property entries.
var spellProps = require('./parts/SpellProps');

// Create the custom magic tab
function createMagicTabGroups(element, elementRegistry) {
  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: 'black-magic',
    label: 'Black Magic',
    entries: []
  };

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element);

  return [
    blackMagicGroup
  ];
}

function MagicPropertiesProvider(eventBus, bpmnFactory, elementRegistry, propertiesProvider) {
  PropertiesActivator.call(this, eventBus);

  // Extend the injected existing properties provider
  let camundaGetTabs = propertiesProvider.getTabs;
  propertiesProvider.getTabs = function (element) {
    // The "magic" tab
    var magicTab = {
      id: 'magic',
      label: 'Magic',
      groups: createMagicTabGroups(element, elementRegistry)
    };

    // get the current tab array
    var array = camundaGetTabs(element);
    array.push(magicTab);
    return array;
  }
}

MagicPropertiesProvider.$inject = [
  'eventBus',
  'bpmnFactory',
  'elementRegistry',
  'propertiesProvider'
];

inherits(MagicPropertiesProvider, PropertiesActivator);

module.exports = {
  __init__: [ 'magicPropertiesProvider' ],
  magicPropertiesProvider: [ 'type', MagicPropertiesProvider ]
};
