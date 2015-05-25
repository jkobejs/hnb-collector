'use strict';

var collectData = require('./utils/collector').collectData;

var stream = collectData(null, new Date(1997, 9, 3));

stream.pipe(process.stdout);
