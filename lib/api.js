/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var Parser = require('./l20n_parser').Parser;
var diff = require("./diff");

module.exports.compare_file = function(ref, l10n, callback) {
    var refAST = false, l10nAST = false;
    fs.readFile(ref, 'utf-8', function(err, content) {
        if (err) throw err;
        var parser = new Parser();
        refAST = parser.parse(content);
        if (l10nAST !== false) {
            compareAST(refAST, l10nAST, callback);
        }
    });
    fs.readFile(l10n, 'utf-8', function(err, content) {
        if (err) throw err;
        var parser = new Parser();
        l10nAST = parser.parse(content);
        if (refAST !== false) {
            compareAST(refAST, l10nAST, callback);
        }
    });
};

module.exports.getEntities = function(path, callback) {
    fs.readFile(path, 'utf-8', function(err, content) {
        if (err) throw err;
        var parser = new Parser();
        var AST = parser.parse(content);
        var entities = [];
        AST.body.forEach(function(node) {
            if (node.type && node.type == 'Entity' && (node.local === false)) {
                entities.push(node.id.name);
            }
        });
        callback(entities);
    });
};

function compareAST(refAST, l10nAST, callback) {
    var refs = [], l10ns = [], missingEntity = [];
    refAST.body.forEach(function(node) {
        if (node.type && node.type == 'Entity' && (node.local === false)) {
            refs.push(node.id.name);
        }
    });
    l10nAST.body.forEach(function(node) {
        if (node.type && node.type == 'Entity' && (node.local === false)) {
            l10ns.push(node.id.name);
        }
    });
    var diffs = diff.array_diff(refs, l10ns);
    diffs.forEach(function(tpl){
        var op = tpl[0], keys = tpl[1];
        if (op == 'missing')
            missingEntity = missingEntity.concat(keys);
    });
    var data = {};
    if (missingEntity.length) {
        data.missingEntity = missingEntity;
    }
    callback(data);
}
