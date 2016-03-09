var ShoppingCart = (function($) {

	// XHR to load the JSON then store it into locastorage

	// function getCartItems() {
	// 	$.ajax({
	// 		'url' : 'js/cart.json',
	// 		'method' : 'POST',
	// 		'dataType' : 'json',
	// 		'success' : function(data){
	// 			sessionStorage.setItem('cartItems', JSON.stringify(data));
	// 		}
	// 	});
	// }
	
	function loadCart(products){
		var source = $("#my-cart-template").html();
		var template = Handlebars.compile(source);
		$("#my-cart").append(template(products));

		//calculation part goes here

		var subTotalAmount = calculateSubTotal(products);
		var discountAmount = subTotalAmount * calculateDiscount(products);
		var pcv = calculatePromoCode();
		var promoCodeValue = isNaN(pcv) ? 0 : pcv;
		var sa = calculateShipping();
		var shippingAmount = isNaN(sa) ? 0: sa;

		var estimatedTotal = subTotalAmount - discountAmount - promoCodeValue + shippingAmount;


		//display calculated values here
		$(".count").html(products.productsInCart.length);
		$(".subtotal_amount").html(displayCurrency(subTotalAmount));
		$("._discount_amount").html('-'+displayCurrency(discountAmount));
		// $(".promo_applied_amount").html(displayCurrency(pcv));
		$(".shipping_amount").html(displayCurrency(sa));
		$(".estimated_total_amount").html(displayCurrency(estimatedTotal));
	}

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

	function reloadCart() {
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		loadCart(prdcts);
	}

	function init() {
					// getCartItems();
		var loadItems = sessionStorage.getItem('load');
		if(loadItems == null) {
			 $.when($.ajax({
				'url' : 'js/cart.json',
				'method' : 'POST',
				'dataType' : 'json',
				'success' : function(data){
					sessionStorage.setItem('cartItems', JSON.stringify(data));
				}
			})).done(function(){
				reloadCart();	
				sessionStorage.setItem('load', true);
			});
		}else{
			reloadCart();
		}
		
		
		
		
		
	}

	function removeItem(item) {
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		for (var i = 0; i < prdcts.productsInCart.length; i++) {
			if (prdcts.productsInCart[i].p_id == item) {
				console.log("match");
				prdcts.productsInCart.splice(i, 1);
				sessionStorage.setItem('cartItems', JSON.stringify(prdcts));
				window.location.reload();
				return;
			}	
			
		}
		// console.log(prdcts.productsInCart[item-1]);
	}

	return {
		init : init,
		removeItem: removeItem
		
	};

})(jQuery);
