/**
 * res.login([inputs])
 *
 * @param {String} inputs.username
 * @param {String} inputs.password
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function login(inputs) {
  inputs = inputs || {};

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Look up the user
  User.attemptLogin({
    username: inputs.username,
    password: inputs.password
  }, function (err, user) {
    if (err) return res.negotiate(err);
    if (!user) {
      req.session.authenticated = false;
      if (req.wantsJSON || !inputs.invalidRedirect) {
        return res.badRequest('Invalid username/password combination.');
      }
      return res.redirect(inputs.invalidRedirect);
    }
    if(user[0].token){
      //req.session.me = user[0].store_id;
      req.session.authenticated = true;
      var is_admin = false;
      var store_id;
      if (req.wantsJSON || !inputs.successRedirect) {

        if (user[0].user_group_id == 1) {
           is_admin = true;
           user[0].store_id = -1;
        }
        return res.ok({
          "code": 200,
          "message": "No Error",
          "data": {
            "user_id":user[0].user_id,
            "store_id":user[0].store_id,
            "username":user[0].username,
            "user_group_id":user[0].user_group_id,
            "email":user[0].email,
            "logged_in":user[0].status,
            "is_admin" : is_admin,
            "auth_token":user[0].token 
                }
        });
      }
      return res.redirect(inputs.successRedirect);
    }else{
      req.session.authenticated = false;
      res.json(401, { error: 'Invalid username/password combination.' });
    }
  });

};
