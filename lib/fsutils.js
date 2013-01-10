/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var dive = require('dive');


module.exports.getFiles = function getFiles(path, callback) {
        var files = [];
        dive(path, {},
             function (err, file) {
                if (err) console.error(err)
                else files.push(file)
             },
             function () {callback(files);})
    };
