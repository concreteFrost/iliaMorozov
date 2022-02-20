<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?search_type=HOTEL&name=".$_REQUEST['city'],
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: priceline-com-provider.p.rapidapi.com",
		"x-rapidapi-key: c0979b1d79mshd8a80cb8e2a7fa9p17a4b6jsn2c9e96fcb8e1"
	],
]);

$response = curl_exec($curl);

curl_close($curl);

$decode = json_decode($response,true);	

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);

