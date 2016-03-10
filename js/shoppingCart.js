var ShoppingCart = (function($) {
	
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

		//display total price per item

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
			sum += parseInt(obj.productsInCart[i].p_total_price);
		}
		return sum;
	}

	//function to calcuate discount based on number of items in cart
	
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

	function findItem(item) {
		var cart = sessionStorage.getItem('cartItems');
		var prdcts = JSON.parse(cart);
		for (var i = 0; i < prdcts.productsInCart.length; i++) {
			if (prdcts.productsInCart[i].p_id == item) {
				return [prdcts.productsInCart[i], i];
			}
		}
	}

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
				return;

			}

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

			return {
				init : init,
				removeItem: removeItem,
				viewItemToEdit : viewItemToEdit,
				editItem : editItem

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
