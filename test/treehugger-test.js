var assert = require("assert");
var requirejs = require("./boilerplate").requirejs;

describe("treehugger", function () {
    describe("#tree", function () {
        it('should be possible to load tree', function () {
            var tree = requirejs("treehugger/tree");
        });
    });
    describe("#properties", function () {
        it('should be possible to load properties parser', function () {
            var parser = requirejs("properties_parser");
        });
    });
});
