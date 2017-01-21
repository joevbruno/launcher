require('babel-core/register');
var generateProductionConfiguration = require('./config');

module.exports = generateProductionConfiguration();
