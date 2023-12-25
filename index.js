var config = require(process.env.CONFIG_PATH || './config.json');
var request = require('request');

var mysql = require('mysql'),
    connection = mysql.createConnection({
      host: config.db_host,
      user: config.db_user,
      password: config.db_pass,
      database: config.db_name,
      port: 3306
    }),
  POLLING_INTERVAL = 5000,
  pollingTimer,
  lastID=process.env.lastID || config.lastID,
  headersOpt = { "content-type": "application/json" };

var pollingLoop = function() {

  // Doing the database query
  var query = connection.query('SELECT t1.*,t2.username,trim(t4.discord) as discord,t3.name as hostname,inet_ntoa(t3.ip) as ipaddr,TS_AGO(t1.ts) as ts_ago FROM stream as t1 LEFT JOIN player as t2 on t1.player_id=t2.id LEFT JOIN target as t3 on t3.id=t1.model_id left join profile as t4 on t4.player_id=t2.id WHERE t1.id > '+lastID+' and model="headshot" order by t1.ts, t1.id'),
  activity_stream = [];
  var content="";

  // setting the query listeners
  query
    .on('error', function(err) {
      console.log(err);
    })
    .on('result', function(entry) {
      content='`'+entry.username+'` got a headshot :skull: on `'+entry.hostname+'`, '+entry.ts_ago+'. Well done!!! [`ID: '+entry.id+'`]';
      console.log(content);
      request({
        url: config.DiscordHook,
        json: true,
        body: { "content": content,  "username": config.botName,   "avatar_url": config.botAvatarUrl },
        headers: headersOpt,
        method: "post"
      });
      lastID=entry.id;
    })
    .on('end', function() {
        pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);
    });

};


connection.connect(function(err) {
  // FIXME: If lastID is not set then determine the last entry
  pollingLoop();
});
