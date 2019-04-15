const rsaWrapper = require('./rsa-wrapper');

rsaWrapper.generate('server');
rsaWrapper.generate('client');

console.log('Keys generated ...');