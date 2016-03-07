(function ($){
	$.Shop = function (element) {
		this.$element = $( element );
		this.init();
	}

	$.Shop.prototype = {
		init: function () {		
			this.loadCartItems(function(response){
				var context = JSON.parse(response);
				var source = $("#my-cart-template").html();
				var template = Handlebars.compile(source);
				$("#my-cart").append(template(context));
			});
			
		},

		loadCartItems: function(callback) {
			var url = "js/cart.json";
			var http_request = new XMLHttpRequest();
			

			http_request.onreadystatechange = function () {
				if (http_request.readyState == 4) {
					callback(http_request.responseText);
					}	
			}

			http_request.open("GET", url, true);
			http_request.send();
		}
	}

	$(function () {
		var shop = new $.Shop ("#my_cart")	
		// console.log(shop.$element);
	});


})(jQuery);

 
