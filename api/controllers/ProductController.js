/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getorderstatuses: function (req, res) {
		return Product.getorderstatuses(function(err,data) {
			if(err){
				res.badRequest(data);
			}else{
			//console.log(req.permission.data.product.ADD);

				res.send(data);
			}
		});	
	  },
};

