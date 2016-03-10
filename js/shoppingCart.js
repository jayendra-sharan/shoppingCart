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
		var currency = products.productsInCart[0].c_currency;
		var subTotalAmount = calculateSubTotal(products);
		var discountAmount = subTotalAmount * calculateDiscount(products);
		var pcv = calculatePromoCode();
		// var promoCodeValue = isNaN(pcv) ? 0 : pcv;
		var sa = calculateShipping();
		// var shippingAmount = isNaN(sa) ? 0: sa;

		var estimatedTotal = subTotalAmount - discountAmount - pcv + sa;


		//display calculated values here
		$("#count").html(products.productsInCart.length);
		$("._cur").html(currency);
		$(".subtotal_amount").html(displayCurrency(subTotalAmount));
		$("._discount_amount").html(displayCurrency(discountAmount));
		$(".promo_applied_amount").html(displayCurrency(pcv));
		$(".shipping_amount").html(displayCurrency(sa));
		$(".estimated_total_amount").html(displayCurrency(estimatedTotal));
		$("#e_o_l").prev().css("display", "none");;
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
		return 0;
	}

	//function to calculate the shipping charge based on the total cart value

	function calculateShipping() {
		return 0;
	}

	//function to display currence in $11.11 format

	function displayCurrency(cur) {
		if(isNaN(cur)) {
			return cur;
		}else {
			// return '<span class="dollar_sign">$</span>'+('0'+cur.toFixed(2)).slice(-5);
			return ('0'+cur.toFixed(2)).slice(-5);
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
		
	}

	

	function viewItemToEdit(item) {
		OverlayModule.enableOverlay();
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		for (var i = 0; i < prdcts.productsInCart.length; i++) {
			if (prdcts.productsInCart[i].p_id == item) {
				var div = document.getElementById("itemImage");
				div.src = "images/"+item+".jpg";

				var itemDetailDocFrag = document.createDocumentFragment();

				var itemFullName = prdcts.productsInCart[i].p_variation + " " + prdcts.productsInCart[i].p_name;
				var itemCurrency = prdcts.productsInCart[i].c_currency;
				var itemName = prdcts.productsInCart[i].p_name;
				var itemMRPrice = prdcts.productsInCart[i].p_originalprice;
				var itemPrice = prdcts.productsInCart[i].p_price;
				var itemAvailSizes = prdcts.productsInCart[i].p_available_options.sizes;
				var itemAvailColors = prdcts.productsInCart[i].p_available_options.colors;

				$("#iFullName").html(itemFullName);	
				$("#iCurrency").html(itemCurrency);
				$("#iName").html(itemName);				
				$("#iMRPrice").html(itemMRPrice);				
				$("#iPrice").html(itemPrice);				

				if (itemMRPrice === itemPrice) {
					$("#iMRPrice").css("visibility", "hidden");
					// $("#iMRPrice").css("width", "0px");
					$("#iMRPrice").html("");
				}

				for (var i=0; i < itemAvailColors.length; i++){
					// console.log(itemAvailColors[i].name);
					$('ul#iColorOption').append("<li id='"+itemAvailColors[i].hexcode+"' class='colorOps' style = 'background-color:"+itemAvailColors[i].hexcode+"' title='"+itemAvailColors[i].name+"'></li>");
				}
				for (var i=0; i < itemAvailSizes.length; i++){
					// console.log(itemAvailSizes[i].name);
					$('#iSizeOption').append(new Option(itemAvailSizes[i].code.toUpperCase(), itemAvailSizes[i].name));
					// $('ul#iSizeOption').append("<li class='sizeOps'>"+ itemAvailSizes[i].code.toUpperCase() +"</li>");
				}

				// console.log(itemAvailColors.length);




					// console.log(prdcts.productsInCart[i].p_available_options.colors[2]);
					// prdcts.productsInCart[i].p_selected_color = {"name":"green", "hexcode":"#A3D2A1"};
					// var editedItem = prdcts.productsInCart[i];
					// prdcts.productsInCart.splice(i, 1, editedItem);
					// sessionStorage.setItem('cartItems', JSON.stringify(prdcts));
					// // window.location.reload();
					return;
				}	
			}	
	}

	function newColor(hc, c) {
		var selectedColor = {"name": c, "hexcode": hc };

	}

	function newValues(size, sizeName) {
		var selectedSize = {"name" : sizeName, "code" : size};
		var 

	}

	return {
		init : init,
		removeItem: removeItem,
		viewItemToEdit : viewItemToEdit,
		newColor : newColor,
		newValues : newValues

	};

})(jQuery);

var OverlayModule = (function() {
	function enableOverlay() {
		var el = document.getElementById("overlay");
		var ed = document.getElementById("editProduct");
		el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
		ed.style.display = (ed.style.display == "block") ? "none" : "block";
	}

	return {
		enableOverlay: enableOverlay
	};
})();
