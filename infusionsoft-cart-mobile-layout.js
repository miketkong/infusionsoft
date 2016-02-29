/**
 * infusionsoft-cart-mobile-layout.js
 * Layout modifications to make an Infusionsoft Shopping Cart Template
 * mobile friendly. Works with custom CSS definitions also in Cart Template.
 *
 * Copyright (C) 2016  Mike Kong
 *
 * This program is not free software: redistribute and/or modification
 * is prohibited.
 *
 * @author      Mike Kong
 * @category    Frontend development
 * @package     Infusionsoft
 * @license     Rights Reserved
 * @version     1.0
 * @link        my.public.repo
 * @since       File available since Feb 2016
 */

/* BUTTON CODE REPLACEMENTS
*  Need to replace the anchor and onclick functions since they cause layout changes after AJAX execution. 
---------------------------------------------*/
function mkdUpdateCart(){
	Infusion.ManageCart.ajaxSubmitForm(jQuery('.viewCart').closest('form').attr('id'), false, 0, 0, ['BRIEF_PRODUCT_SUMMARY','UP_SELLS','PAYMENT_PLANS', 'SHIPPING_OPTIONS', 'SHIPPING_ENTRY', 'BILLING_ENTRY','PAYMENT_SELECTION','CHECKOUT_LINKS','CHECKOUT_LINKS_TOP']);
	reloadPage();
}
function replaceCartUpdateCode(){
	var updateCartLink = document.getElementsByClassName("updateCart");
	for (var i = 0, max = updateCartLink.length; i < max; i++) { 
		updateCartLink[i].setAttribute('href', 'javascript:mkdUpdateCart();');
	}
}
	  
function mkdExecutePromoCode(){
	Infusion.ManageCart.ajaxSubmitForm('checkout', false, 0, 0, ['BRIEF_PRODUCT_SUMMARY','PAYMENT_PLANS', 'PROMO_CODE', 'UP_SELLS']);
	reloadPage();
}
function replaceCartPromoCode(){
  	var promoCodeButtonLink = document.getElementsByClassName("codeButton");
	for (var i = 0, max = promoCodeButtonLink.length; i < max; i++) { 
		promoCodeButtonLink[i].setAttribute('href', 'javascript:mkdExecutePromoCode();');
	}
}

function reloadPage(){
	location.reload();
}
function replaceShippingCheckboxCode(){
	var addressTableInfo = document.getElementsByClassName("addressTableInfo");
	for (var i = 0, max = addressTableInfo.length; i < max; i++) { 
		addressTableInfo[i].firstChild.nextElementSibling.setAttribute("onclick", "Infusion.ManageCart.copyShipping(this, 'checkout', 'onestep', 'State', false); setTimeout(reloadPage, 2000);");
	}
}

function replaceRemoveItemCode(){
	var cartItemWrapper_td = document.getElementsByClassName("cartItemWrapper");
	for (var i = 0, max = cartItemWrapper_td.length; i < max; i++) { 
		var originalRemoveCode = cartItemWrapper_td[i].firstChild.nextElementSibling.nextElementSibling.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.getAttribute("href");
		//alert(originalRemoveCode);
		var newRemoveCode = originalRemoveCode.concat(" setTimeout(reloadPage, 500);");
		cartItemWrapper_td[i].firstChild.nextElementSibling.nextElementSibling.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("href", newRemoveCode);
	}
}

/* LAYOUT MODIFICATIONS
** Mods are separated by Cart Page in order of the Checkout Process.
---------------------------------------------*/
// Modify Tax tables
function modifyTaxTables_ManageCartPage(){
	var viewCart_table = document.getElementsByClassName("viewCart");
		for (var i = 0, max = viewCart_table.length; i < max; i++) { 
			var taxAmount_tr = viewCart_table[i].firstChild.nextElementSibling.lastChild.previousElementSibling.previousElementSibling;
			taxAmount_tr.setAttribute("class", "taxAmount_tr");
			taxAmount_tr.firstChild.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
			taxAmount_tr.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
			taxAmount_tr.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "taxAmount");
		}
}

// Modify Subtotal tables
function modifySubtotalLayout(){
	var cartSubtotal_td = document.getElementsByClassName("subtotal");
	for (var i = 0, max = cartSubtotal_td.length; i < max; i++) { 
		cartSubtotal_td[0].firstChild.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
		cartSubtotal_td[0].firstChild.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
		cartSubtotal_td[0].firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "cartSubtotalAmount");
	}
}

function mobilizeManageCartLayout(){
	// Modify Cart Items tables
	var cartItem_tr = document.getElementsByClassName("cartThumb");
	for (var i = 0, max = cartItem_tr.length; i < max; i++) {
		cartItem_tr[i].parentNode.parentNode.setAttribute("class", "cartItemWrapper");
	}
	var quantity_td = document.getElementsByClassName("qtyField");
	for (var i = 0, max = quantity_td.length; i < max; i++) {
		quantity_td[i].parentNode.setAttribute("class", "quantity_td");
	}
	var priceClass = document.getElementsByClassName("price");
	for (var i = 0, max = priceClass.length; i < max; i++) {
	  	priceClass[i].parentNode.setAttribute("style", "text-align:left !important; padding-left:65px");
	}
	var subTotal_td = document.getElementsByClassName("cartItemWrapper");
	for (var i = 0, max = subTotal_td.length; i < max; i++) {
		subTotal_td[i].firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "cartItemSubTotal");
		subTotal_td[i].firstChild.nextElementSibling.setAttribute("class", "cartItemImage_td");
	}
	
	modifySubtotalLayout();
  	
	// Modify Promo Code tables
	var promoCode_table = document.getElementsByClassName("promoCode");
	for (var i = 0, max = promoCode_table.length; i < max; i++) { 
		promoCode_table[0].firstChild.nextElementSibling.firstChild.setAttribute("class", "promoCode_tr");
		promoCode_table[0].firstChild.nextElementSibling.firstChild.firstChild.nextElementSibling.setAttribute("class", "promoCodeLabel");
		promoCode_table[0].firstChild.nextElementSibling.firstChild.firstChild.nextElementSibling.nextElementSibling.setAttribute("class", "promoField_td");	
	}
	
	// Make Shipping sam as Billing Checkbox bigger
	var checkboxInput = document.getElementsByTagName("input");
	for (var i = 0, max = checkboxInput.length; i < max; i++) { 
		if(checkboxInput[i].type == "checkbox"){
			checkboxInput[i].setAttribute("class", "checkbox");
		}
	}
	
	// Modify Payment Info Tables 
	var paymentInfoTable = document.getElementsByClassName("paymentMethodTable");
	for (var i = 0, max = paymentInfoTable.length; i < max; i++) { 
		paymentInfoTable[i].firstChild.nextElementSibling.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
	}

	// Check the customer billing state. If it's California, then modify tax tables
	var customerBillingState = document.getElementById("state");
	//alert(customerBillingState.value);
	if(customerBillingState.value == "CALIFORNIA" || customerBillingState.value == "CA"){
		modifyTaxTables_ManageCartPage();
	}else{
		//alert("false");
	}
	replaceCartUpdateCode();
	replaceCartPromoCode();
	replaceShippingCheckboxCode();
	replaceRemoveItemCode();
}
/*======================
** CART SUMMARY PAGE
**======================*/
// Common Functions
function checkTax_CartSummaryPage(){
	var subtotal_tr = document.getElementsByClassName("subtotal");
	for (var i = 0, max = subtotal_tr.length; i < max; i++) {
		var previousNode = subtotal_tr[i].parentNode.lastChild.previousElementSibling.previousElementSibling
		var previousNodeText = previousNode.firstChild.nextElementSibling.textContent;
		//alert(previousNode);
		if(previousNodeText == "Tax"){
			//alert("There is tax.");
			modifyTaxTables_CartSummaryPage(previousNode);
		}
	}
}
function modifyTaxTables_CartSummaryPage(previousNode){
	previousNode.setAttribute("class", "taxAmount_tr");
	var taxAmount_tr = document.getElementsByClassName("taxAmount_tr");
	for (var i = 0, max = taxAmount_tr.length; i < max; i++) {
			taxAmount_tr[i].firstChild.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
			taxAmount_tr[i].firstChild.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
			taxAmount_tr[i].firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "taxAmount");
	}
}

function checkShipping_CartSummaryPage(){
	var taxAmount_tr = document.getElementsByClassName("taxAmount_tr");
	for (var i = 0, max = taxAmount_tr.length; i < max; i++) {
			var shipping_tr = taxAmount_tr[i].parentNode.lastChild.previousElementSibling.previousElementSibling.previousElementSibling;
			var shippingText = shipping_tr.firstChild.nextElementSibling.textContent;
			if(shippingText == "Shipping"){
				modifyShippingTables_CartSummaryPage(shipping_tr);
			}
	}
}
function modifyShippingTables_CartSummaryPage(shipping_tr){
	shipping_tr.setAttribute("class", "shipping_tr");
	shipping_tr.firstChild.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
	shipping_tr.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "mobile_hidden");
	shipping_tr.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "shippingAmount");
}

// Cart Summary Page Layout Modifications
function mobilizeCartSummaryLayout(){	
	// Modify Cart Items tables
	var cartItem_tr = document.getElementsByClassName("cartThumb");
	for (var i = 0, max = cartItem_tr.length; i < max; i++) {
		cartItem_tr[i].parentNode.parentNode.setAttribute("class", "cartItemWrapper");
	}
	var priceClass = document.getElementsByClassName("price");
	for (var i = 0, max = priceClass.length; i < max; i++) {
	  	priceClass[i].parentNode.setAttribute("class", "itemPrice_td");
	}
	var subTotal_td = document.getElementsByClassName("cartItemWrapper");
	for (var i = 0, max = subTotal_td.length; i < max; i++) {
		subTotal_td[i].firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.setAttribute("class", "cartItemSubTotal");
		subTotal_td[i].firstChild.nextElementSibling.setAttribute("class", "cartThumb_td");
	}
	var cartItemWrapper = document.getElementsByClassName("cartItemWrapper")
	for (var i = 0, max = cartItemWrapper.length; i < max; i++) {
		cartItemWrapper[i].lastChild.previousElementSibling.previousElementSibling.setAttribute("class", "quntity_td_summaryPage");
		var quantityNode = cartItemWrapper[i].lastChild.previousElementSibling.previousElementSibling;
		var itemQuantity = quantityNode.firstChild.textContent;
		quantityNode.firstChild.nodeValue = "Quantity: ".concat(itemQuantity);
	}
	
	// Hide unecessary table headers
	var summaryCart_table = document.getElementsByClassName("summaryCart");
	for (var i = 0, max = summaryCart_table.length; i < max; i++) { 
		summaryCart_table[i].firstChild.nextElementSibling.firstChild.setAttribute("class", "mobile_hidden");
	}
	
	modifySubtotalLayout();
	checkTax_CartSummaryPage();
	// Hide the item price if there's only one item
	hideIfSingleItem();
	checkShipping_CartSummaryPage();
	
}

function hideIfSingleItem(){
	var cartItems = document.getElementsByClassName("cartItemWrapper");
	if(cartItems.length == 1){
		// itemPrice_td
		var itemPrice_td = document.getElementsByClassName("itemPrice_td");
		for(var i = 0, max = itemPrice_td.length; i < max; i++){
			itemPrice_td[i].setAttribute("class", "mobile_hidden");
		}
	}
}

/*======================
** RECEIPT PAGE
**======================*/
function mobilizeReceiptPageLayout(){
	var shipInfoElements = document.getElementsByClassName("shipInfo");
	for (var i = 0, max = shipInfoElements.length; i < max; i++) { 
		shipInfoElements[i].setAttribute("class", "shipInfo_receiptPage");
	}
	
	// Hide the item price if there's only one item
	hideIfSingleItem();
}

// Check if we're on the Manage Cart page and mobilize layout if so
var checkoutLinksTop = document.getElementById("CHECKOUT_LINKS_TOP");
if(checkoutLinksTop != null){
	mobilizeManageCartLayout();
}

// Check if we're on the Cart Summary page and mobilize layout if so
var summaryCartTitle = document.getElementById("FULL_PRODUCT_SUMMARY");
if(summaryCartTitle != null){
	mobilizeCartSummaryLayout();
}

// Check if we're on the Receipt page and mobilize layout if so
var successfulPurchaseElements = document.getElementsByClassName("successfulPurchase");
if(successfulPurchaseElements[0] != null){
	mobilizeReceiptPageLayout();
}

checkItemCount();