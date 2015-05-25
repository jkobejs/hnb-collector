'use strict';

require('date-utils');

var request     = require('request'),
    es          = require('event-stream'),
    util        = require('util'),
    fecha       = require('fecha'),
    matchGroups = require('./regex').matchGroups;


function skipLines(lineArray) {
    var lines = 1;
    return through(
        function write(data) {
            if (!lineArray || !lineArray.length || lineArray.indexOf(lines) == -1) {
                this.emit('data', data);
            }
            lines++;
        },
        function end() {
            this.emit('end', '');
        }
    );
}

function extract(regex) {
    var dateString;
    return es.through(
        function write(data) {
            if (data.length == 21) {
                dateString = fecha.parse(data.slice(11, 19), 'DDMMYYYY').toDateString();
                return;
            }
            if (!data) {
                return;
            }
            this.emit('data', matchGroups(regex, data).join('\t').replace(/,/g, '.') + '\t' + dateString + '\n');
        }
    );
}

function append(value) {
    return es.through(
        function write(data) {
            this.emit('data', [data, value].join('\t') + '\n');
        }
    );
}

function dateProducer(startDate, endDate, dateFormat) {
    var count = 0;
    return es.readable(function (count, callback) {
        var dateStr;

        if (count++ === 0)
            dateStr = startDate.toFormat(dateFormat);
        else
            dateStr = startDate.add({days: 1}).toFormat(dateFormat);

        this.emit('data', dateStr);
        callback();

        if (!endDate || startDate >= endDate) {
            this.emit('end');
            callback();
            return;
        }
    });
}

function mapResponseBodies(url) {
   return es.map(function (data, callback) {
        request.get(util.format(url, data), function (error, response, body) {
            if (response.statusCode === 200) {
                callback(null, body);
            } else {
                callback();
            }
        });
    });
}

exports.skipLines = skipLines;
exports.extract = extract;
exports.append = append;
exports.dateProducer = dateProducer;
exports.mapResponseBodies = mapResponseBodies;
