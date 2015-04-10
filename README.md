# serverside
Server address: http://serenity-valley.ddns.net  
If the server's not running, it can be started by executing /home/hermes/serverside/server.js

Routes

/ - Debug UI  
/submit/newop - Creates new OP. Expects a JSON object with fields corresponding to columns in the HeadMessage table (see schema, messageID should be omitted since it auto-increments)  
/submit/newreply - Same as /submit/newop, but inserts into the ReplyMessage table  
/getPostsByRange - Gets OPs within a certain latitute and longitute. Expects latMin, lonMin, latMax, lonMax.  
/getRepliesTo - Does exactly what you'd expect. Expects parentID.  

http://stackoverflow.com/questions/15778572/preventing-sql-injection-in-node-js
