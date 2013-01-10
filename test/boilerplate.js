var requirejs = exports.requirejs = require("requirejs");

requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/../lib',
    paths: {
        treehugger: '../node_modules/treehugger/lib/treehugger'
    }
});
