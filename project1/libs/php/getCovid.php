<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://covid19-data.p.rapidapi.com/?iso2=".$_REQUEST['iso'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: covid19-data.p.rapidapi.com",
		"x-rapidapi-key: c0979b1d79mshd8a80cb8e2a7fa9p17a4b6jsn2c9e96fcb8e1"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

$decode = json_decode($response, true);


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";

$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);