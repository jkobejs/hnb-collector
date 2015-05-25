var streams = require('./streams'),
    es      = require('event-stream');

function collectData(startDate, endDate, dateFormat) {
    startDate = startDate || new Date(1997, 9, 1); // 1.10.1997
    endDate = endDate || new Date(); // today
    dateFormat = dateFormat || 'DDMMYY';

    var url = 'http://www.hnb.hr/tecajn/f%s.dat';
    var regex   = /\d{3}(\w{3})(\d{3})\s*(\d+,\d+)\s*(\d+,\d+)\s*(\d+,\d+)/;

    return streams.dateProducer(startDate, endDate, dateFormat)
        .pipe(streams.mapResponseBodies(url))
        .pipe(es.split())
        .pipe(streams.extract(regex));
}

exports.collectData = collectData;
