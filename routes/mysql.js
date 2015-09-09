var mysql = require('mysql');

var pool = mysql.createPool({
    host     : 'mydbinstance.chca9pd2o96e.us-east-1.rds.amazonaws.com',
    user     : 'awsanirudh',
    password : 'awsanirudh',
    database : 'quiz'
});

exports.pool = pool;
