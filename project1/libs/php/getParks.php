<?php
$url = 'https://www.triposo.com/api/20220104/location.json?type=national_park&countrycode='.$_REQUEST['iso'].'&token=8y2yrtv66bawcwgajp03ouu9r2xmw3dg&account=ZKT1O97R&count=60';

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

$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);