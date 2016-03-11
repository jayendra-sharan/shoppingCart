//Shopping Cart Module has all the functions to load, view or edit items

var ShoppingCart = (function($) {
	
	/*
	*	Initialization function is called as soon as the document is ready.
	* It makes an AJAX call and loads .json file into an object, this object
	*	is later saved in a session storage variable. This object is used till
	*	the session runs, for any modification or view operation.
	* Two properties, total price and total original price is added to the
	*	the object. Total price is equal to number of each item multiplied by
	*	the price per unit. Same logic for total original price. 
	* A temporary variable, load is set in session storage when the AJAX
	* call is done for the first time. Whenever the page is reloaded (for 
	*	example) when an item is either edited, or removed, the the load
	*	variable prevents further AJAX call, otherwise the items in the cart
	*	will be reset to initial version.
	*/

	function init() {
		var loadItems = sessionStorage.getItem('load');
		if(loadItems == null) {
			$.when($.ajax({
				'url' : 'js/cart.json',
				'method' : 'POST',
				'dataType' : 'json',
				'success' : function(data){

					for(var i=0; i < data.productsInCart.length; i++) {
						data.productsInCart[i].p_total_price = (+data.productsInCart[i].p_quantity * +data.productsInCart[i].p_price);
						data.productsInCart[i].p_total_originalprice = (+data.productsInCart[i].p_quantity * +data.productsInCart[i].p_originalprice);
					}
					// data.productsInCart
					console.log(data.productsInCart);
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

	/*
	*	Function reloadCart is called in init function, whose primary job is
	*	to retrieve the products data stored in the session and pass it to the
	*	loadCart function
	*/

	function reloadCart() {
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		loadCart(prdcts);
	}

	/*
	*	Function loadCart accepts an object and populate the html cart page
	*	with the help of Handlebars Template Engine.
	*	Furthermore, elements, like subtotal, discounts, and so on is
	*	populated using this function.
	*/

	function loadCart(products){
		var source = $("#my-cart-template").html();
		var template = Handlebars.compile(source);
		$("#my-cart").append(template(products));

		var currency = products.productsInCart[0].c_currency;
		var subTotalAmount = calculateSubTotal(products);
		var discountAmount = subTotalAmount * calculateDiscount(products);
		var pcv = calculatePromoCode();
		var sa = calculateShipping();
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

	/*
	*	Function calculateSubTotal calculates the total cart value.
	*/

	function calculateSubTotal(obj) {
		var sum=0;
		for (var i = 0; i < obj.productsInCart.length; i++) {
			sum += parseInt(obj.productsInCart[i].p_total_price);
		}
		return sum;
	}

	/*
	*	function calcuateDiscount accepts an object containing all items
	*	available in cart and returns a discount multiplier based on total
	*	number of items in cart.
	*/
	
	function calculateDiscount(obj){

		var totalItems = 0;
		for(var i=0; i< obj.productsInCart.length; i++) {
			totalItems += +obj.productsInCart[i].p_quantity;
		}
		//if more than 10 items, give 25% discount
		if (totalItems >= 10 ) {
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

	/*
	*	function to calculate the discount based on the promocode applied
	*	Logic for this function can be written as per specification.
	*/
	function calculatePromoCode() {
		return 0;
	}

	/*
	*	Function to calculate the shipping charge based on the total cart value.
	*	Logic for this function can be written as per specification.
	*/

	function calculateShipping() {
		return 0;
	}

	/*
	*	function to display currence in $11.11 format
	*/

	function displayCurrency(cur) {
		/*
		*	If cur is not a number, e.g. FREE, return it, else modify to 
		*	get the above format
		*/
		if(isNaN(cur)) {
			return cur;
		}else {
			// return '<span class="dollar_sign">$</span>'+('0'+cur.toFixed(2)).slice(-5);
			return ('0'+cur.toFixed(2)).slice(-5);
		}
	}

	/*
	*	Function removeItem deletes an object that is available in the
	*	session storage to be used by the application. The item that needs
	*	to be deleted is passed to this function as argument.
	*/

	function removeItem(item) {
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		for (var i = 0; i < prdcts.productsInCart.length; i++) {
			if (prdcts.productsInCart[i].p_id == item) {
				console.log("match");

				// Deletes the item at index i
				prdcts.productsInCart.splice(i, 1);
				sessionStorage.setItem('cartItems', JSON.stringify(prdcts));
				window.location.reload();
				return;
			}	
		}
	}

	/*
	*	Function findItem returns an object when the product id is provided
	*	to it. This function returns an array containing the product (object)
	*	and index on which it finds a match.
	*/

	function findItem(item) {
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		for (var i = 0; i < prdcts.productsInCart.length; i++) {
			if (prdcts.productsInCart[i].p_id == item) {
				return [prdcts.productsInCart[i], i];
			}
		}
	}

	/*
	*	Function viewItemToEdit accepts the product id and displays
	*	the detail of the product in a modal window, giving user
	*	an option to modify the detail of the product purchased.
	*/

	function viewItemToEdit(item) {
		OverlayModule.enableOverlay();
		var viewProduct = findItem(item)[0];
		var div = document.getElementById("itemImage");
		div.src = "images/"+item+".jpg";


		var itemFullName = viewProduct.p_variation + " " + viewProduct.p_name;
		var itemCurrency = viewProduct.c_currency;
		var itemName = viewProduct.p_name;
		var itemMRPrice = viewProduct.p_originalprice;
		var itemPrice = viewProduct.p_price;
		var itemAvailSizes = viewProduct.p_available_options.sizes;
		var itemAvailColors = viewProduct.p_available_options.colors;
		$("#iId").attr("value", viewProduct.p_id);
		$("#iFullName").html(itemFullName);	
		$("#iCurrency").html(itemCurrency);
		$("#iName").html(itemName);				
		$("#iMRPrice").html(itemMRPrice);				
		$("#iPrice").html(itemPrice);				

		if (itemMRPrice === itemPrice) {
			$("#iMRPrice").css("visibility", "hidden");
			$("#iMRPrice").html("");
		}

		for (var i=0; i < itemAvailColors.length; i++){
			$('ul#iColorOption').append("<li id='"+itemAvailColors[i].hexcode+"' class='colorOps' style = 'background-color:"+itemAvailColors[i].hexcode+"' title='"+itemAvailColors[i].name+"'></li>");
		}
		for (var i=0; i < itemAvailSizes.length; i++){
			$('#iSizeOption').append(new Option(itemAvailSizes[i].code.toUpperCase(), itemAvailSizes[i].name));
		}
		return;
	}

	/*
	*	Function editItem is called when the EDIT button is clicked.
	*	It updates the cart with the new values selected by the user.
	*/

	function editItem(size, sizeName, qty) {
		var selectedSize = {"name" : sizeName, "code" : size};
		var selectedQty = qty;
		var div = $("#iColorOption li.active");
		var selectedItem = $("#iId").val();
		var selectedColHexcode = $(div).attr("id");
		var selectedColName = $(div).attr("title");
		var newItem = findItem(selectedItem)[0];
		var index = findItem(selectedItem)[1];

		newItem.p_selected_color = {"name" : selectedColName, "hexcode": selectedColHexcode};
		newItem.p_selected_size = selectedSize;
		newItem.p_quantity = selectedQty;
		newItem.p_total_price = +selectedQty * +newItem.p_price;

		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		prdcts.productsInCart.splice(index, 1, newItem);
		sessionStorage.setItem('cartItems', JSON.stringify(prdcts));
		window.location.reload();
	}

	/*
	*	Returns pointer/reference to method which are considered
	*	to be public. 
	*/

	return {
		init : init,
		removeItem: removeItem,
		viewItemToEdit : viewItemToEdit,
		editItem : editItem

	};

})(jQuery);

var OverlayModule = (function() {

	/*
	*	when the edit link is clicked and overlay is displayed
	*	with help of enableOverlay function
	*/
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
