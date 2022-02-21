<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => 'https://test.ezconnect.link/v1/static/hotels?skip=600&limit=10&order=desc&destinationId=5c431ec518524947e1f0197a&countryISO2='.$_REQUEST['iso'].'&createdUpdated=2018-12-19',
	
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
	CURLOPT_HTTPHEADER => [
		'Authorization: 5bf69c8a9343440687c8c873.8eb80e100a00b35456921cb8fd04e5',
		'Content-Type: application/json'
	],
]);

$response = curl_exec($curl);

curl_close($curl);

echo $response;

// $decode = json_decode($response,true);	

// $output['status']['code'] = "200";
// $output['status']['name'] = "ok";
// $output['status']['description'] = "success";
// $output['data'] = $decode;

// header('Content-Type: application/json; charset=UTF-8');
// echo json_encode($output);