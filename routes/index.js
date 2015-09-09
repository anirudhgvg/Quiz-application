
/*
 * GET home page.
 */

exports.loadHomepage = function (req, res) {
    res.render('index', { greetText: 'Please login to start the quiz' });
};