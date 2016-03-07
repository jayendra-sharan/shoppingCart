window.onload = function() {
	// var obj = loadCartItems();
	// console.log(obj);
	loadCartItems(function(response){
		// ;
		// console.log(response);
	});
};

function loadCartItems(callback) {
	var url = "js/cart.json";
	var http_request = new XMLHttpRequest();
	

	http_request.onreadystatechange = function () {
		if (http_request.readyState == 4) {
			var jsonObj = http_request.responseText;
			callback(jsonObj);
		}	
	}

	http_request.open("GET", url, true);
	http_request.send();
}