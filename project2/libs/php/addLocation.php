<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
	// SQL does not accept parameters and so is not prepared
	
    $name = $_REQUEST['name'];
	if(empty($name)){
		$err = '*Please fill all required fields';
		echo $err;
		exit;
	}

    $checkName = $conn->prepare('SELECT name FROM location WHERE name=?');
	$checkName->bind_param('s',$name);
	$checkName->execute();
	$checkName->store_result();

    $res = $checkName->num_rows;

    if($res>0){
        $err='*Location already exists';
        echo $err;
        exit;
    }
	
	$query = $conn->prepare('INSERT INTO location (name) VALUES(?)');

    $query->bind_param("s",$name);

    $query->execute();
	
	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>