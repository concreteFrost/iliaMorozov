
<?php





header('Content-Type: application/json; charset=UTF-8');

$uName = $_REQUEST['userName'];
$uEmail = $_REQUEST['userEmail'];
$uSubject = $_REQUEST['userSubject'];
$body = $_REQUEST['userMessage'];

if (!filter_var($uEmail, FILTER_VALIDATE_EMAIL)) {

    echo '*Invalid email format';
    exit;
}
if (empty($uName) || empty($uEmail) || empty($uSubject) || empty($body)) {

    echo '*Please fill all required fields.';
    exit;
}

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
$headers .= "From: " . $uEmail . "\r\n" .
    "Reply-To: " . $uEmail . "\r\n" .
    "X-Mailer: PHP/" . phpversion();

$mail = 'admin@iliamorozov.co.uk';

if (mail($mail, $uSubject, $body, $headers)) {

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";

    echo json_encode($output);

} else {
    echo 'Unable to send email';
}
