<?php

$country_list_json = file_get_contents('../js/countryBorders.geo.json');
$decode = json_decode($country_list_json, true);
$name_iso = [];
foreach ($decode['features'] as $res) {
    array_push($name_iso, (object)['name' => $res['properties']['name'], 'iso' => $res['properties']['iso_a2']]);
}
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output['data'] = $name_iso;
header('Content-type: application/json; charset=UTF-8');
echo json_encode($output);
