<h1>Shopping Cart</h1>
<h4>Code base for Client Side "my cart" page of a shopping site</h4>
<hr />

<p>The page loads a JSON file, which has information of products that have been added to cart by the customer. 
The page displays the value of cart after calculating the discount, shipping amount etc.</p>

<hr />
<h2>LINKS</h2>
<b>CHECKOUT :</b> This option is disabled. Click on this button will have no effect on the page.
<br />
<b>EDIT(link) :</b> This link gives the user/customer, the option to view a particular product, then if wishes can make the
changes in the quantity, color or size of the product added to the cart.
<br />
<b>EDIT (button) : </b> This button is only visible when a user clicks the EDIT link for a product. When clicked
it changes the cart with the new values of size, color, quantity selected by the customer.
<br />
<b>REMOVE :</b> This link, when clicked, removes and item from the cart.

<hr />
<h2>CODE</h2>
<b>Shopping Cart</b> Module has functions that will loads the cart after making an AJAX call to the JSON file stored in 
the application directory. There is going to be only one AJAX call to load the content of the JSON file. The object of the
JSON file is stored in a <i>Session Storage</i> variable. Throughout the application this <i>Session Storage</i> variable
is used for any modification or deletion operation.
<br /><br />

When user tries to edit an item/product, a modal box is displayed for the customer with the options to change the values of 
the item which is present in cart. <i>(Note: The validation logic has not been applied to the form that is being displayed to
the customer. At the moment, the application presumes user makes valid choices)</i>.

<br /><br />
<b>Discount</b> is calculated by this logic:
<ul>
  <li>If number of items bought is more than 10, discount is 25%</li>
  <li>If number of items bought is more than 3 but less than 10, discount is 10%</li>
  <li>If number of items bought is less than or equals to 3, discount is 5%</li>
  
  <br /><br />
At the moment, <b>Shipping Amount, Promotion Code Option and Discount using Promotion Code</b> is not implemented, however,
methods for these functionality has been declared in the Shopping Cart Module.
<hr />
It is intended that once the user clicks the CHECKOUT button another AJAX call can/will be made to update the cart.json file. 

