/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var db_prefix = sails.config.styfi.db_prefix;
var db_sl_prefix = sails.config.styfi.db_sl_prefix;
module.exports = {
  attributes: {
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  /**
  * Check validness of a login using the provided inputs.
  * But encrypt the password first.
  *
  * @param  {Object}   inputs
  *                     • username    {String}
  *                     • password {String}
  * @param  {Function} cb
  */

  attemptLogin: function (inputs, cb)
  {
    if (inputs.username && inputs.password) {
      User.query('SELECT salt FROM '+db_prefix+'user WHERE username = "'+inputs.username+'"',function(err, rawRes){
        if(err){
          console.log(err);
        }
        //console.log(inputs);
        if(rawRes.length == 1)
        {
          var salt = rawRes[0].salt;
          var saltedPass = sails.sha1js(salt+sails.sha1js(salt+sails.sha1js(inputs.password)));

          User.query('SELECT * FROM '+db_prefix+'user WHERE username = "'+inputs.username+'" AND password ="'+saltedPass+'"',function(error, rawResult){
            if(error){
              console.log(error);
            }

            if(rawResult.length == 1){
              //login success

                User.query('INSERT INTO '+db_sl_prefix+'admin_api_token (token,user_id,create_date,expires,status) values (MD5(NOW()),'+rawResult[0].user_id+',NOW(),NOW()+INTERVAL 15 DAY,1)',function(err,res)
                {
                  if(err)
                  {
                    cb('Invalid Username/Password');
                  }
                  else
                  {
                      User.query('SELECT * FROM '+db_prefix+'user ou ,'+db_sl_prefix+'admin_api_token adt WHERE ou.user_id= adt.user_id and adt.admin_api_id='+res.insertId,function(error, adminData)
                      {
                        if (error)
                        {
                          cb('Invalid Username/Password');
                        }
                        else
                        {
                          cb(false,adminData);
                        }
                      });
                  }
                });
            }else{
              cb('Invalid Username/Password');
            }
          });

        }else{
          cb('Invalid Username/Password');
        }
      });
    }else
    {
      cb({
        "code":"403",
        "message": "Required Parameters Missing",
      });
    }
  },


    logout: function(auth_token,cb) {
    if (auth_token) {
      User.query('UPDATE sl_admin_api_token SET status=0 WHERE token="'+auth_token+'"',function(err, rawRes){
        if(err){
          console.log(err);
          cb(err);
        }else{
          cb(false);
        }
      });
    }else
    {
      cb({
        "code":"403",
        "message": "Required Parameters Missing",
      });
    }
  }







};
