(function ($){
	$.Shop = function (element) {
		this.$element = $( element );
		this.init();
	}

	$.Shop.prototype = {
		init: function () {		
			$.get("js/cart.json", function (data) {
				// console.log(data);
				var context = JSON.parse(data);
				console.log(context);
				var source = $("#my-cart-template").html();
				var template = Handlebars.compile(source);
				$("#my-cart").append(template(context));
			});
			
		}
	}

	$(function () {
		var shop = new $.Shop ("#my_cart")	
		// console.log(shop.$element);
	});


})(jQuery);

 
