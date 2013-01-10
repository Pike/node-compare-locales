#! /usr/bin/env node

var path = require('path');
var fsutils = require('./fsutils');
var diff = require("./diff");
var Tree = require("./tree");
var api = require("./api");

var userArgs = process.argv.slice(2);
var refdir = userArgs[0], l10ndir = userArgs[1];

var refFiles = false, l10nFiles = false;
fsutils.getFiles(refdir, function(files) {
    files = files.map(function(p) {
        return path.relative(refdir, p);
    })
    refFiles = files;
    if (l10nFiles !== false) {
        compare_dirs();
    }
});
fsutils.getFiles(l10ndir, function(files) {
    files = files.map(function(p) {
        return path.relative(l10ndir, p);
    })
    l10nFiles = files;
    if (refFiles !== false) {
        compare_dirs();
    }
});

function compare_dirs() {
    var diffs = diff.array_diff(refFiles, l10nFiles);
    var t = new Tree();
    var pending = 0;
    function maybeDone() {
      --pending;
      if (pending <= 0) {
        t.compact();
        console.log(JSON.stringify(t));
      }
    }
    function gatherPaths(p) {
        var data;
        if (this == 'compare') {
            data = {value: {missingEntity: ["confirm-clear-priv", "foo"]}};
            ++pending;
            api.compare_file(path.resolve(refdir, p), path.resolve(l10ndir, p),
                             function(val) {
                              if (Object.keys(val).length)
                                t.setData(p, {value: val});
                              maybeDone();
                            });
        }
        if (this == 'missing') {
            ++pending;
            api.getEntities(path.resolve(refdir, p),
                            function(ents){
                              t.setData(p, {"value": {"missingFile": "error", "strings": ents.length}})
                              maybeDone()
                              })
        }
        if (this == 'obsolete') {
            data = {"value": {"obsoleteFile": "error"}};
            t.setData(p, data);
        }
    }
    diffs.forEach(function (tpl) {
        tpl[1].forEach(gatherPaths, tpl[0]);
    })
}
