<?php


    $url = 'https://countriesnow.space/api/v0.1/countries?country='.$_REQUEST['iso'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
    
	curl_close($ch);
    
	$decode = json_decode($result,true);	
 

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";

	$output['data'] = $decode['data'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 