
exports.list = function (req, res) {
    
    var renderAdmin = function (err, conn) {
        conn.query("select * from USER", function (err, rows, fields) {
            if (!err) {
                console.log('The solution is: ', rows);
                var sample1 = [];
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var a = [row.answer1, row.answer2, row.answer3];
                    var f = [row.feedback1, row.feedback2, row.feedback3];
                    var user1 = { name: row.name, answers: a, feedback: f };
                    sample1.push(user1);
                }
                console.log('Admin Login Successful');
                res.render('admin', {
                    title: 'Easy Math Quiz',
                    sample: sample1
                });
            }
            else {
                console.log('Error while performing Query.');
            }
        })
        conn.release();
    }
    
    var renderUser = function ()
    {
        console.log(ses.user + 'User Login Successful');
        res.render('user', {
            greetText: "Login Successful.",btlgvisible: "hidden",
            answer1: "", autofocus: "autofocus", feedback1 : "",
            answer2: "", feedback2 : "", answer3: "", feedback3 : "", btsbvisible:"submit",
        });
    }

    console.log("User credentials obtained");
    var usr = req.body.username;
    var pass = req.body.pwd;
    
    var ses = req.session;
    ses.user = usr;
    console.log(ses.user+'has initiated LOGIN request');
    var mysql = require('./mysql.js').pool;
    
    mysql.getConnection(function (err, conn) 
    {
        conn.query("select pwd from USERS where uname=?",usr, function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    if (pass == "admin" && usr == "jadmin") {
                        console.log(ses.user+'Admin Login Successful');
                        mysql.getConnection(renderAdmin)
                    }   
                    else if (pass == rows[0].pwd) {
                        renderUser();
                    }
		    else {
                    console.log(ses.user +'Login unsuccessful');
                    res.render('index', { title: 'Easy Math Quiz', greetText: 'Invalid user credentials entered. Please enter again.' });
                    }
                }
                else {
                    console.log(ses.user +'Login unsuccessful');
                    res.render('index', { title: 'Easy Math Quiz', greetText: 'Invalid user credentials entered. Please enter again.' });
                }
            }
            else {
                console.log('Error while performing login Query.'+err);
            }               
        })
        conn.release();
     })
};

exports.list2 = function (req, res) {
    var ses = req.session;
    var usr = ses.user;
    var mysql = require('./mysql.js').pool;

        console.log("User answers obtained");
        var a1 = req.body.a1;
        var a2 = req.body.a2;
        var a3 = req.body.a3;
       
       if(a1!=undefined && a2!=undefined && a3!=undefined)    
       {
        console.log("Answers are"+a1 + " " + a2 + " " + a3);
        var f1 = "False", f2 = "False", f3 = "False";
        if (a1 == 4) {
            f1 = "True";
        }
        if (a2 == 12) {
            f2 = "True";
        }
        if (a3 == 1) {
            f3 = "True";
        }
        console.log("Feedback is"+f1 + " " + f2 + " " + f3);
       }
    
    var insertAnswers = function (err, conn) {
        conn.query('insert into USER values ("' + usr + '", "' + a1 + '","' + a2 + '","' + a3 + '","' + f1 + '","' + f2 + '","' + f3 + '")',
            function (err, results, fields) {
            if (!err) {
                console.log("Answers inserted successfully for " + ses.user);
                res.render('user', {
                    greetText: "Quiz completed successfully. Check your feedback.",btlgvisible: "submit",
                    answer1: "Your answer is: "+a1, autofocus: "", feedback1 : f1,
                    answer2: "Your answer is: "+a2, feedback2 : f2, answer3: "Your answer is: "+a3, feedback3 : f3, btsbvisible:"hidden"
                });
            }
            else {
                console.log('Error while performing Query.');
            }
        });
        conn.release();
    }
    
    var updateAnswers = function (err, conn) {
        conn.query('update USER set answer1="' + a1 + '",answer2="' + a2 + '",answer3="' + a3 +
             '",feedback1="' + f1 + '",feedback2="' + f2 + '",feedback3="' + f3 + '"where name="' + usr + '"',
            function (err, results, fields) {
            if (!err) {
                console.log("Answers updated successfully for " + ses.user);
                res.render('user', {
                    greetText: "Quiz completed successfully. Check your feedback.",btlgvisible: "submit",
                    answer1: "Your answer is: "+a1, autofocus: "", feedback1 : f1,
                    answer2: "Your answer is: "+a2, feedback2 : f2, answer3: "Your answer is: "+a3, feedback3 : f3, btsbvisible:"hidden"
                });
            }
            else {
                console.log('Error while performing Query.');
            }
        });
        conn.release();
    }

     if(a1==undefined || a2==undefined || a3==undefined)    
    {
      res.render('user', {
            greetText: "All questions must be answered!!",btlgvisible: "hidden",
            answer1: "", autofocus: "autofocus", feedback1 : "",
            answer2: "", feedback2 : "", answer3: "", feedback3 : "", btsbvisible:"submit",
        });
    } 
    else
    {
      mysql.getConnection(function (err, conn) {
        conn.query("select * from USER where name=?", usr, function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    mysql.getConnection(updateAnswers); 
                }
                else {
                    mysql.getConnection(insertAnswers); 
                }
            }
            else {
                console.log('Error while performing Query.');
            }
        })
        conn.release();
    })

    ses.destroy();
  //  console.log("Session is"+req.session.user);
    }
   

};
