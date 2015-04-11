# serverside
Server address: http://serenity-valley.ddns.net  

Routes

/ - Debug UI  
/submit/newop - Creates new OP. Expects a JSON object with fields corresponding to columns in the HeadMessage table (see schema, messageID should be omitted since it auto-increments)  
/submit/newreply - Same as /submit/newop, but inserts into the ReplyMessage table  
/getPostsByRange - Gets OPs within a certain latitute and longitute. Expects latMin, lonMin, latMax, lonMax.  
/getRepliesTo - Does exactly what you'd expect. Expects parentID.  

Database credentials are stored in an external file which has the following structure:
```javascript
var mysql = require('mysql');

/* DATABASE CONFIGURATION */
exports.connection = mysql.createConnection({
    host: 'MySQL server address, usually localhost',
    user: 'MySQL username',
    password: 'MySQL password'
});

var dbToUse = 'Hermes';

//use the database for any queries run
exports.useDatabaseQry = 'USE ' + dbToUse;
```
