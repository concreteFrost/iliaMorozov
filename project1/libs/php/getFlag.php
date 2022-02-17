<?php
$flag_json = file_get_contents('../js/getFlag.json');
$decode = json_decode($flag_json, true);
$flag_iso = [];
foreach ($decode['data'] as $res) {
    array_push($flag_iso, (object)['name' => $res['name'], 'iso' => $res['iso2'],'flag'=>$res['flag']]);
}
$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";
$output['data'] = $flag_iso;
header('Content-type: application/json; charset=UTF-8');
echo json_encode($output);