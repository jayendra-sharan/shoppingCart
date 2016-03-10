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
	var viewItem = par.attr("id");
	ShoppingCart.viewItemToEdit(viewItem);
	
});

$("#iColorOption").on("click", ".colorOps", function(event){
	var tar = event.target;
	$("#iColorOption li").css("border", "0");
	$(tar).css("border", "1px solid #000000");
	$(tar).addClass("active");
	// var selectedColHexcode = $(tar).attr("id");
	// var selectedColName = $(tar).attr("title");
	//ShoppingCart.newColor(selectedColHexcode, selectedColName);
});

$("#edit").on("click", function(event) {
	var selectedSize = $( "#iSizeOption option:selected" ).text();
	var selectedSizeName = $( "#iSizeOption option:selected" ).attr("value");
	var selectedQty = $( "#iQty option:selected" ).val();
	// console.log(selectedSize+selectedSizeName);
	ShoppingCart.editItem(selectedSize, selectedSizeName, selectedQty);
});

$("#overlay").on("click", OverlayModule.enableOverlay);
