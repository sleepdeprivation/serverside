var mysql = require('mysql');

/* DATABASE CONFIGURATION */
exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'groovy',
    password: 'groovyPassword'
});

var dbToUse = 'groovy';

//use the database for any queries run
exports.useDatabaseQry = 'USE ' + dbToUse;
