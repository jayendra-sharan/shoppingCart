(function ($){
	$.Shop = function (element) {
		this.$element = $( element );
		this.init();
	}

	$.Shop.prototype = {
		init: function () {		

			//cart Initialization
			$.get('js/cart.json', function(data) {
				$("#my_cart").html(Mustache.render( $("#my_cart_template").html(), data));
			});

			console.log(this._JSONtoObject());
		},

		_JSONtoObject: function () {
			$.ajax({
				'async' : true,
				'global' : false,
				'url' : 'js/cart.json',
				'dataType' : "json",
				'success' : function (data) {
					json = data;
				}
			});
			
		},


		
	}



	$(function () {
		var shop = new $.Shop ("#my_cart")	
		// console.log(shop.$element);
	});


})(jQuery);

 
