const babelOptions = require('./preset');
require('@babel/polyfill');
require('@babel/register')(babelOptions());
require('./index');
