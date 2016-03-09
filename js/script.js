//Initialize the cart with the items available in
//cart.json file.


ShoppingCart.init();

$("#my-cart").on("click", "#remove", function(event){
	var tar = event.target;
	var par = $(tar).parents(".col-sm-9");
	var itemToBeRemoved = par.attr("id");
	ShoppingCart.removeItem(itemToBeRemoved);
	
});
