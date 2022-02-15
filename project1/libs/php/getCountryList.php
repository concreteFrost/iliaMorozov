<?php

$executionStartTime = microtime(true);

$country_list_json = file_get_contents('../js/countryBorders.geo.json');
$decode = json_decode($country_list_json, true);
foreach($decode['features'] as $res){
echo $res['properties']['name'].'!';
}


