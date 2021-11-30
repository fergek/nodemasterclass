/*
Create and export env variables
*/ 

// container for all env variables
var environments = {};

// staging object
environments.staging={
    'httpport' : 3000,
    'httpsport' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'mysecret'
};

environments.production={
    'httpport' : 5000,
    'httpsport' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'anothersecret'
};

// export the appropriate one
var currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the currentEnv is a valid environment
var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments['staging'];

module.exports = environmentToExport;