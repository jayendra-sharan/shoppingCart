/*
* Initialize the cart with the items available in
* cart.json file.
*/
ShoppingCart.init();


/*
*	Handles the click when remove link is clicked for any product.
* Also calls the removeItem function of ShoppingCart Module.
*/
$("#my-cart").on("click", ".remove", function(event){
	var tar = event.target;
	var par = $(tar).parents(".product");
	var itemToBeRemoved = par.attr("id");
	ShoppingCart.removeItem(itemToBeRemoved);
	
});

/*
*	Handles the click on the edit link.
*	Calls the viewItemToEdit function of Shopping Cart.
*/

$("#my-cart").on("click", ".edit", function(event){
	var tar = event.target;
	var par = $(tar).parents(".product");
	var viewItem = par.attr("id");
	ShoppingCart.viewItemToEdit(viewItem);
	
});

/*
*	When one product is in edit mode, the following handler
*	selects a color pallete by changing it's style as following.
*/

$("#iColorOption").on("click", ".colorOps", function(event){
	var tar = event.target;
	$("#iColorOption li").css("border", "0");
	$(tar).css("border", "1px solid #000000");
	$(tar).addClass("active");
});

/*
*	Handles the EDIT button, when clicked, calls the editItem
*	function of ShoppingCart with values, size, sizename and quantity
*	passed to it.
*/

$("#edit").on("click", function(event) {
	var selectedSize = $( "#iSizeOption option:selected" ).text();
	var selectedSizeName = $( "#iSizeOption option:selected" ).attr("value");
	var selectedQty = $( "#iQty option:selected" ).val();
	// console.log(selectedSize+selectedSizeName);
	ShoppingCart.editItem(selectedSize, selectedSizeName, selectedQty);
});

$("#overlay").on("click", OverlayModule.enableOverlay);
