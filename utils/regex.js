'use strict';

function matchGroups(regex, str) {
    var match = str.match(regex);
    return match ? match.slice(1) : '';
}

exports.matchGroups = matchGroups;
