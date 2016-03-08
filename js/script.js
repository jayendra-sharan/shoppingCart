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

				
				var subTotalAmount = calculateSubTotal(context);
				var discountAmount = calculateDiscount(context);
				var promoCodeValue = calculatePromoCode();
				var shippingAmount = calculateShipping();

				var estimatedTotal = subTotalAmount - discountAmount - promoCodeValue + shippingAmount;

				shippingAmountD = (shippingAmount === 0) ? "FREE" : '<span class="dollar_sign">$</span>'+shippingAmount.toFixed(2); 
				$(".count").html(context.productsInCart.length);
				$(".subtotal_amount").html('<span class="dollar_sign">$</span>'+subTotalAmount.toFixed(2));
				$("._discount_amount").html('-'+'<span class="dollar_sign">$</span>'+(subTotalAmount*discountAmount).toFixed(2));
				$(".promo_applied_amount").html('<span class="dollar_sign">$</span>'+promoCodeValue.toFixed(2));
				$(".shipping_amount").html(shippingAmountD);
				$(".estimated_total_amount").html('<span class="dollar_sign">$</span>'+estimatedTotal.toFixed(2));

				


			});

			function calculateSubTotal(obj) {
				var sum=0;
				for (var i = 0; i < obj.productsInCart.length; i++) {
					sum += parseInt(obj.productsInCart[i].p_price);
				}
			  return sum;
			}

			function calculateDiscount(obj){
				var totalItems = obj.productsInCart.length;

				if (length >= 10 ) {
					return 0.25;
				} else if (totalItems < 10 && totalItems > 3) {
					return 0.10;
				} else {
					return 0.05;
				}
			}

			function calculatePromoCode() {
				return 0;
			}
			function calculateShipping() {
				return 0;
			}
			
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

var Modal = function() {
	
}
 
