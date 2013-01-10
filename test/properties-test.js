var assert = require("assert");
var requirejs = require("./boilerplate").requirejs;

describe("treehugger", function () {
    describe("#properties", function () {
        it('should be possible to load properties parser', function () {
            var parser = requirejs("properties_parser");
            assert.ok(parser);
            //console.dir(parser);
            var nd = parser('  \n  \nkey thingie = value thingie\nfoo:bar');
            assert.ok(nd);
            //console.log(nd.toPrettyString());
            console.log(nd.getPos());
            console.log(nd.findNode({line:2, col:3}).toPrettyString());
        });
    });
});
