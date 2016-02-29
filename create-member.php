<?php 
/**
 * create-member.php
 * Creates new members in MemberMouse via checkout with Infusionsoft.
 *
 * Copyright (C) 2016  Mike Kong
 *
 * This program is not free software: redistribute and/or modification
 * is prohibited.
 *
 * @author      Mike Kong
 * @category    Abstraction Layer
 * @package     EasyMVC
 * @license     Rights Reserved
 * @version     1.0
 * @link        my.public.repo
 * @since       File available since
 */


// ERROR LOGGING FUNCTIONS
function writeError($errorDescription){
	$filename = '../../../../logs/infusionsoft-MM-errors.txt';
	$date = date_create();
	$datePST = date_timezone_set($date, timezone_open('America/Los_Angeles'));
	$timeStamp = date_format($datePST, 'm-d-Y H:i:s');
	$errorMessage= $timeStamp .": " .$errorDescription ."\n";
	
	if (is_writable($filename)) {

		if (!$handle = fopen($filename, 'a')) {
			exit;
		}
	
		if (fwrite($handle, $errorMessage) === FALSE) {
			exit;
		}
		fclose($handle);
	} else { 
		echo "The file $filename is not writable";
	}
}


/* INFUSIONSOFT API SDK
 * Load the Infusionsoft PHP SDK by Novak Solutions:
 * https://github.com/novaksolutions/infusionsoft-php-sdk
 * This allows us to communicate with the Infusionsoft API.
 * API credentials are stored in XXXXXXXXXX.
 */
require_once('xxxxxxxxx/Infusionsoft/infusionsoft.php');


// POST VARIABLES
$emailAddress		= 	$_POST['Email'];
$firstName 			= 	$_POST['FirstName']; 
$lastName 			= 	$_POST['LastName']; 
$contactId 			= 	$_POST['Id'];
$userPass			= 	$_POST['userPass'];



// Creates a new member using the standard MemberMouse "Create Member" API call.
function createMember($firstName, $lastName, $emailAddress, $userPass){
	$API_Key 			= 	"XXXXXXXXXXXXXX"; 
	$API_Secret 		= 	"XXXXXXXXXXXXXX";
	$membershipLevel_ID = 	"2";
	$mm_password		=	$userPass;

		
	// Input Parameters ready
	$inputParams  = "apikey=$API_Key&apisecret=$API_Secret&"; 
	$inputParams .= "first_name=$firstName&"; 
	$inputParams .= "last_name=$lastName&";
	$inputParams .= "password=$mm_password&";
	$inputParams .= "email=$emailAddress&"; 
	$inputParams .= "membership_level_id=$membershipLevel_ID";
	
	// Run the MemberMouse "Create Member" API Call
	$apiCallUrl = "http://20minutebody.com/wp-content/plugins/membermouse/api/request.php?q=/createMember";
	$ch = curl_init($apiCallUrl); 
	
	curl_setopt($ch, CURLOPT_POST, 1); 
	curl_setopt($ch, CURLOPT_POSTFIELDS, $inputParams); 
	curl_setopt($ch, CURLOPT_HEADER, 0); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	$result = curl_exec($ch); 
	curl_close($ch);
	 
	$data = json_decode($result); 
	$responseCode = $data->response_code;
	$user_id = $data->response_data->member_id;
	
	if($responseCode == 200){
		return $user_id;
	}else{
		echo "<p>The Member could not be created.</p>";
		echo "<p>RAW Response: ".$result."</p>"; 
		// LOG ERROR
		$errorDescription = "The Member could not be created. RAW Response: $result";
		writeError($errorDescription);
	}
}


// DATABASE CONNECT
function db_connect(){
	static $connection;
	
	if(!isset($connection)) {
		$config = parse_ini_file('xxxxx/_wpeprivate/db_config.ini');
		$connection = mysqli_connect('127.0.0.1', $config['username'], $config['password'], $config['dbname']);
	}
	
	/* check connection */
	if($connection === false) {
        //LOG ERROR
		$errorDescription = mysqli_connect_error();
		writeError($errorDescription);
        return mysqli_connect_error(); 
    }
	return $connection;
}

// GET PRODUCT IDs
function getProductIDs($contactId){
	
	$invoices = getInvoicesForContact($contactId);
	
	if(count($invoices) == 0){
		$errorDescription = "No invoices found for customer: $contactId.";
		writeError($errorDescription);
		exit;
	}
	
	$i = 0;
	foreach($invoices as $invoice){
		$orders[$i] = $invoice->ProductSold;
		$i++;
	}
	
	$orderCount = count($orders);
	$latestInvoice = $orderCount-1;
	$recentPurchaseItems = $orders[$latestInvoice];
	
	/* Infusionsoft API returns Products Sold as a string. The loops below turn it into an array. */
	$k = 0;
	$h = 0;
	$productIDs = array();
	
	while($recentPurchaseItems[$k] != ""){
		
		if($recentPurchaseItems[$k] != ","){
			$productIDs[$h] = $productIDs[$h].$recentPurchaseItems[$k];
			$k++;
		}else{
			$k++;
			$h++;
		}
	}
	return $productIDs;
}

// GET INVOICES (Infusionsoft API)
function getInvoicesForContact($contactId){
			
	$invoices = Infusionsoft_DataService::findByField(new Infusionsoft_Invoice(), 'ContactId', $contactId);
	return $invoices;
}


// APPLY BUNDLES (MemberMouse Database)
function apply_MM_bundles($contactId, $emailAddress, $firstName, $lastName, $user_id, $userPass){
	
	$user_id = createMember($firstName, $lastName,  $emailAddress, $userPass);
	
	$productIDs = getProductIDs($contactId);
	
	$connection = db_connect();
	
	foreach($productIDs as $productID){
		
		$MM_ProductID = get_MM_ProductID($productID);
		
		$user_email = mysqli_real_escape_string($connection, $emailAddress);
		$memberMouse_Bundle = mysqli_real_escape_string($connection, $MM_ProductID); 
		
		$query = "INSERT INTO `wp_twentyminute`.`mm_applied_bundles` (`access_type`, `access_type_id`, `bundle_id`, `days_calc_method`, `days_calc_value`, `status`, `pending_status`, `imported`, `status_updated`, `subscribed_provider_id`, `subscribed_list_id`,`cancellation_date`, `expiration_date`, `apply_date`) VALUES ('user', '$user_id', '$memberMouse_Bundle', 'join_date', '0', '1', '0', '0', CURRENT_DATE(), NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP);";
		
		if ($result = mysqli_query($connection, $query)) {
			echo "<p>Applied Bundles was successful.</p>";
		}else{
			//LOG ERROR
			$errorDescription = "apply_MM_bundles() FAILED. There was a problem with the database query or connection.";
			writeError($errorDescription);
			echo "<p>$errorDescription</p>";
		}
	}
}

// CONVERT PRODUCT IDs from Infusionsoft to MemberMouse Bundle IDs
function get_MM_ProductID($productID){
	
	// TRILOGY DVDs
	if($productID == "11"){
		$MM_ProductID = "5";
	}
	
	// Program I DVDs
	if($productID == "5"){
		
		$MM_ProductID = "10";
	}
	
	// Complete the TRILOGY DVDs
	if($productID == "18"){
		$MM_ProductID = "5";
	}
	
	// 20 Minute Body Book (Physical)
	if($productID == "13"){
		
		$MM_ProductID = "7";
	}
	
	// TRILOGY Downloads
	if($productID == "9"){
		$MM_ProductID = "4";
	}
	
	// Program I Downloads
	if($productID == "3"){
		$MM_ProductID = "1";
	}
	
	// Complete the TRILOGY Downloads
	if($productID == "20"){
		$MM_ProductID = "4";
	}
	
	// 20 Minute Detox
	if($productID == "15"){
		$MM_ProductID = "6";
	}
	
	// 20 Minute Body Book Gifts
	if($productID == "13"){
		$MM_ProductID = "7";
	}
	
	// Booty by Brett
	if($productID == "7"){
		$MM_ProductID = "15";
	}
	
	return $MM_ProductID;
}

apply_MM_bundles($contactId, $emailAddress, $firstName, $lastName, $user_id, $userPass);

mysqli_close($connection);

exit;
?>
