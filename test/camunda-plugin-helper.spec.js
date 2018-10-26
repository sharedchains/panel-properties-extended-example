var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

let camundaPluginHelper = require('../client/camunda-plugin-helper');
let magicModdle = require('../client/descriptors/magic.json');

describe('Checking moddle plugin extension', () => {
    camundaPluginHelper.registerBpmnJSModdle('magic', magicModdle);

    describe('Should register the new moddle correctly', () => {
      let plugins = window.plugins;
        it('Plugins is an array', () => {
          expect(plugins).to.be.an('array');
          expect(plugins).to.have.lengthOf(1);
        });
        it('Plugins contains an object with properties plugin and type', () => {
          expect(plugins[0]).to.have.property('plugin');
          expect(plugins[0]).to.have.property('type');
        });
        it('Plugin type is "bpmn.modeler.moddleExtensions"', () => {
          expect(plugins[0].type).to.be.equal('bpmn.modeler.moddleExtensions');
        });
        it('Plugin object contains only one property with the moddle', () => {
          expect(plugins[0].plugin).to.be.an('object').that.has.property('magic');
          expect(Object.keys(plugins[0].plugin).length).to.equal(1);
        });
    });

    describe('Should not register the moddle', () => {
      window.plugins = [];

      it('Throw error "moddleName should be a string"', () => {
        expect(() => camundaPluginHelper.registerBpmnJSModdle({}, {})).to.throw(Error, 'should be a string');
      });
      it('Throw error "moddlePackage should be the moddle object"', () => {
        expect(() => camundaPluginHelper.registerBpmnJSModdle('YADA', 'YADA')).to.throw(Error, 'should be the moddle object');
      });
    });
});
