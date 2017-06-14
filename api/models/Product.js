/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  },
  
  getorderstatuses:function(cb){
    Product.query("select * from oc_order_status order by order_status_id asc",function(error, resStatus1){
      if (error) { cb(true,error); }
      cb(false,{
        "code":"200",
        "message": "success",
        "data": resStatus1,
      });
    });
  }


};

