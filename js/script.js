//Initialize the cart with the items available in
//cart.json file.


ShoppingCart.init();

$("#my-cart").on("click", ".remove", function(event){
	var tar = event.target;
	var par = $(tar).parents(".product");
	var itemToBeRemoved = par.attr("id");
	ShoppingCart.removeItem(itemToBeRemoved);
	
});

$("#my-cart").on("click", ".edit", function(event){
	var tar = event.target;
	var par = $(tar).parents(".product");
	var itemToBeEdited = par.attr("id");
	ShoppingCart.editItem(itemToBeEdited);
	
});

$("#overlay").on("click", OverlayModule.enableOverlay);
