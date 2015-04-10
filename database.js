
var mysql = require('mysql');

/* DATABASE CONFIGURATION */
exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'hermes',
    password: 'apollo11'
});

var dbToUse = 'Hermes';

//use the database for any queries run
exports.useDatabaseQry = 'USE ' + dbToUse;

