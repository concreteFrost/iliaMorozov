<?php


$url = "http://api.weatherapi.com/v1/forecast.json?key=a28699a9b4244619b4e194830222202&q=".$_REQUEST['lat'].','.$_REQUEST['lon']."&days=3&aqi=no&alerts=no";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);


$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";

$output['data'] = $decode['forecast']['forecastday'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
