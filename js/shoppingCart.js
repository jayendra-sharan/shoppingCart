var ShoppingCart = (function($) {

	var cartItems;

	function getCartItems() {
		var jsonObj;
		$.ajax({
				'method' : 'POST',
				'url' : 'js/cart.json',
				'dataType' : "json",
				'success' : function (data) {
					// console.log(data);
					// return data;
					jsonObj = data;
				}
			});
		$(document).ajaxComplete(function() {
			console.log("h");
			console.log(jsonObj);
			
		});
	}
	/*
	function loadCart(callback) {
		var url = "js/cart.json";
		var http_request = new XMLHttpRequest();
		

		http_request.onreadystatechange = function () {
			if (http_request.readyState == 4) {
					this.cartItems = http_request.responseText;
					callback(http_request.responseText);
				}	
		}
		http_request.open("GET", url, true);
		http_request.send();

		
	}
	*/

	function calculateSubTotal(obj) {
		var sum=0;
		for (var i = 0; i < obj.productsInCart.length; i++) {
			sum += parseInt(obj.productsInCart[i].p_price);
		}
	  return sum;
	}

	//function to calcuate discount based on number of items in cart
	
	function calculateDiscount(obj){
		var totalItems = obj.productsInCart.length;
		//if more than 10 items, give 25% discount
		if (length >= 10 ) {
			return 0.25;
		} 
		//if more than 3 and less than 3 items, give 10% discount
		else if (totalItems < 10 && totalItems > 3) {
			return 0.10;
		} 
		//otherwise 5% discount
		else {
			return 0.05;
		}
	}

	//function to calculate the discount based on the promocode applied

	function calculatePromoCode() {
		return "None";
	}

	//function to calculate the shipping charge based on the total cart value

	function calculateShipping() {
		return "Free";
	}

	//function to display currence in $11.11 format

	function displayCurrency(cur) {
		if(isNaN(cur)) {
			return cur;
		}else {
			return '<span class="dollar_sign">$</span>'+('0'+cur.toFixed(2)).slice(-5);
		}
	}


	/*
	*	initialization function, loads the cart items and
	*	calculates the cart value along considering the 
	*	promotional code applied, shipping charge and other
	*	discounts.
	*/
	/*
	function init() {

			loadCart(){

			}

			loadCart(function(response){

			var context = JSON.parse(response);
			var source = $("#my-cart-template").html();
			var template = Handlebars.compile(source);
			$("#my-cart").append(template(context));

			//calculation part goes here

			var subTotalAmount = calculateSubTotal(context);
			var discountAmount = subTotalAmount * calculateDiscount(context);
			var pcv = calculatePromoCode();
			var promoCodeValue = isNaN(pcv) ? 0 : pcv;
			var sa = calculateShipping();
			var shippingAmount = isNaN(sa) ? 0: sa;

			var estimatedTotal = subTotalAmount - discountAmount - promoCodeValue + shippingAmount;


			//display calculated values here
			$(".count").html(context.productsInCart.length);
			$(".subtotal_amount").html(displayCurrency(subTotalAmount));
			$("._discount_amount").html('-'+displayCurrency(discountAmount));
			// $(".promo_applied_amount").html(displayCurrency(pcv));
			$(".shipping_amount").html(displayCurrency(sa));
			$(".estimated_total_amount").html(displayCurrency(estimatedTotal));
		});

	} */
	function init() {
		this.cartItems = getCartItems();
		console.log("hello"+this.cartItems);
	}
	function removeItem(item) {
		loadCart(function(response){
			var context = JSON.parse(response);
			var products = context.productsInCart;
			for (var i = 0; i < products.length; i++) {
					if (products[i].p_id == item) {
						console.log("match");
						delete products[i];
						// init();
						// console.log(context);
						return;
					}
			}
		});
	}

	return {
		init : init,
		removeItem: removeItem
		
	};

})(jQuery);
