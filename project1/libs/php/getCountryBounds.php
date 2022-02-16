<?php

$country_list_json = file_get_contents('../js/countryBorders.geo.json');
$decode = json_decode($country_list_json, true);
$bounds = [];
foreach ($decode['features'] as $res) {
    array_push($bounds,(object)['iso'=>$res['properties']['iso_a2'],'bounds'=>$res['geometry']]);
}
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output['data'] = $bounds;
header('Content-type: application/json; charset=UTF-8');
echo json_encode($output);
