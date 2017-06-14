/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function (req, res) {
    //console.log(req.param('username'));
    return res.login({
      username: req.param('username'),
      password: req.param('password'),
      successRedirect: '/',
      invalidRedirect: '/login'
    });
  },

    logout: function (req, res) {
    req.session.me = null;
    req.session.authenticated = false;
    var auth_token = req.headers['authorization'].split(' ');
    User.logout(auth_token[1],function(err){
        if(err){
          return res.badRequest(err);
        }
        if (req.wantsJSON) {
          return res.ok({
          "code": "200",
          "message": "Logged out successfully!"
        });
        }
        return res.redirect('/');
    });
  }
  
};

