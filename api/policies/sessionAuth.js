/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  if (req.headers['authorization']) {
  //console.log(req.headers['authorization']);
  var auth_token = req.headers['authorization'].split(' ');
  var authQuery;
  authQuery = 'SELECT * FROM sl_admin_api_token WHERE token = "'+auth_token[1]+'" AND status = 1 AND expires > NOW()';
  //("select sat.* from "+db_sl_prefix+"admin_api_token sat , "+db_prefix+"user ou where sat.token='"+auth_token+"' and ou.store_id="+store_id+" and sat.`status`=1 and ou.user_id= sat.user_id"
  User.query(authQuery,function(err, rawRes){
    if(err) return res.forbidden(err);
    //console.log(rawRes);
    if(rawRes.length==1){
      return next();
    }else{
      return res.forbidden('You are not permitted to perform this action.');
    }
  });
}
else
{
  return res.forbidden({
      "code":"403",
      "message": "Invalid Request!",
    });
}
};
