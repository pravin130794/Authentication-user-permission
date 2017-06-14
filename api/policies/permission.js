

module.exports = function (req,res,next,cb){

	if (req.headers['authorization']) {
  		//console.log(req.headers['authorization']);
  		var auth_token = req.headers['authorization'].split(' ');
  		var Query;
		Query ="select * from sl_admin_api_token sa where sa.token='"+auth_token[1]+"'";
		User.query(Query,function(err,output){
			if (err) {
				return res.forbidden(err);
			}else {
				//console.log(output[0].user_id);
				var userQuery;
				userQuery = 'select * from oc_user where user_id="'+output[0].user_id+'"';
				User.query(userQuery,function(err,permission){
					if (err) {
						return res.forbidden(err);
					}else {
						var permissionQuery;
						permissionQuery = 'select op.*,ro.route_name,og.name,ac.`action` from  oc_group og ,oc_permission op,oc_action ac , oc_route ro where og.user_group_id='+permission[0].user_group_id+' and og.user_group_id=op.user_group_id and ac.action_id=op.action_id and op.route_id=ro.route_id';
						User.query(permissionQuery,function(err,action){
							if (err) {
								return res.forbidden(err);
							}else {
								//var  permission_object = {};
								var permission = action;
								var data ={};
								//console.log(permission);

								for (var i =0; i < permission.length; i++) {
									var arrStr = 'data.'+permission[i].route_name+'= {}';
									var checkStr = 'data.'+permission[i].route_name;
									if (eval(checkStr)) {

									}else{
										eval(arrStr);
									}

									// permission_object = { [permission[i].action] :permission[i].allowed };
									//   permission_object = [permission[i].route_name];
									var pushStr = checkStr+'.'+permission[i].action+' = permission[i].allowed';
									eval(pushStr);	
								}
								req.permission = {
													'code':200,
													'message':'No Error',
													'data':data			
												 }
								//console.log(req.permission.data.product.ADD);
								console.log(req.permission);
							}
						});
					}
				});
				return next();
			}
		});
	}else {
		console.log('Error');
		}
};