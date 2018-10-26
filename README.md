# Properties Panel Extension Example

This example shows how to extend the [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel) in Camunda Modeler with custom properties based on a plugin.

![properties panel extension screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/properties-panel-extension/docs/screenshot.png "Screenshot of the properties panel extension example")


## About

> If you need more information about setting up take look at the [basic properties example](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel) first and [Camunda modeler plugin documentation](https://github.com/camunda/camunda-modeler/tree/master/docs/plugins).

In this example we extend the current properties panel to allow editing a `magic:spell` property on all start events. To achieve that we will walk through the following steps:

* Add a tab called "Magic" to contain the property
* Add a group called "Black Magic" to this tab
* Add a "spell" text input field to this group
* Create a new moddle extension

The property `magic:spell` will be persisted as an extension as part of the BPMN 2.0 document:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions ... xmlns:magic="http://magic" id="sample-diagram">
  <bpmn2:process id="Process_1">
    <bpmn2:startEvent id="StartEvent_1" magic:spell="WOOO ZAAAA" />
  </bpmn2:process>
  ...
</bpmn2:definitions>
```


Let us look into all the necessary steps in detail.


### Create a Properties Provider

The first step to a custom property is to create your own `PropertiesProvider`, extending it from the modeler.
The provider defines which properties are available and how they are organized in the panel using tabs, groups and input elements.

We created the [`MagicPropertiesProvider`](client/ExtendedPropertiesProvider.js) which exposes all basic BPMN properties (via a "general" tab) as well as the "magic" tab.

```javascript
function MagicPropertiesProvider(eventBus, bpmnFactory, elementRegistry, propertiesProvider) {

  ...
  // Extend the injected existing properties provider
  let camundaGetTabs = propertiesProvider.getTabs;
  propertiesProvider.getTabs = function(element) {

    ...

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
  };
}

MagicPropertiesProvider.$inject = [
  'eventBus',
  'bpmnFactory',
  'elementRegistry',
  'propertiesProvider'
];
```


### Define a Group

As part of the properties provider we define the groups for the magic tab, too:

```javascript
// Require your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
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
```


### Define an Entry

The "spell" entry is defined in [`SpellProps`](client/parts/SpellProps.js). We reuse [`EntryFactory#textField`](https://github.com/bpmn-io/bpmn-js-properties-panel/blob/master/lib/factory/EntryFactory.js#L79) to create a text field for the property. Note that we make sure that the entry is shown if a start event is selected:

```javascript
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {
  // only return an entry, if the currently selected element is a start event
  if (is(element, 'bpmn:StartEvent')) {
    group.entries.push(entryFactory.textField({
      id : 'spell',
      description : 'Apply a black magic spell',
      label : 'Spell',
      modelProperty : 'spell'
    }));
  }
};
```

You can look into the [`EntryFactory`](https://github.com/bpmn-io/bpmn-js-properties-panel/blob/master/lib/factory/EntryFactory.js) to find many other useful reusable form input components. You can also go further and define what happens if you enter text in an input field and what is shown in it if the element is selected. To do so you can override `entry#set` and `entry#get` methods. A good example for this is [`DocumentationProps`](https://github.com/bpmn-io/bpmn-js-properties-panel/blob/master/lib/provider/bpmn/parts/DocumentationProps.js).

To get a better understand of the lifecycle of updating elements and the properties panel [this forum post](https://forum.bpmn.io/t/integrating-bpmn-js-properties-panel-with-the-bpmn-js-modeler/261/20) may be helpful.


### Create a Moddle Extension

The second step to create a custom property is to create a moddle extension so that moddle is aware of our new property "spell". This is important for moddle to write and read BPMN XML containing custom properties. The extension is basically a json descriptor file [magic.json](client/descriptors/magic.json) containing a definition of `bpmn:StartEvent#spell`:

```javascript
{
  "name": "Magic",
  "prefix": "magic",
  "uri": "http://magic",
  "xml": {
    "tagAlias": "lowerCase"
  },
  "associations": [],
  "types": [
    {
      "name": "BewitchedStartEvent",
      "extends": [
        "bpmn:StartEvent"
      ],
      "properties": [
        {
          "name": "spell",
          "isAttr": true,
          "type": "String"
        },
      ]
    },
  ]
}
```

In this file we define the new type `BewitchesStartEvent` which extends the type `bpmn:StartEvent` and adds the "spell" property as an attribute to it.

**Please note**: It is necessary to define in the descriptor which element you want to extend. If you want the property to be valid for all bpmn elements, you can extend `bpmn:BaseElement`:

```javascript
...

{
  "name": "BewitchedStartEvent",
  "extends": [
    "bpmn:BaseElement"
  ],

  ...
},
```


### Plugging Everything together

To ship our custom extension with the properties panel we have to register both the moddle extension and the properties provider when registering the modeler plugin.

```javascript
let registerBpmnJSPlugin = require('./camunda-plugin-helper').registerBpmnJSPlugin;
let registerBpmnJSModdle = require('./camunda-plugin-helper').registerBpmnJSModdle;

var extendedPropertiesProvider = require('./ExtendedPropertiesProvider');
var magicModdle = require('./descriptors/magic.json');

registerBpmnJSPlugin(extendedPropertiesProvider);
registerBpmnJSModdle('magic', magicModdle);
```


## Running the Example

Put the folder into the plugins directory relative to your Camunda Modeler installation directory. You can now use your plugin!

## License

MIT
