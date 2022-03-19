<?php

use PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer as PHPMailerPHPMailer;

require './php_mailer/src/Exception.php';
require './php_mailer/src/PHPMailer.php';
require './php_mailer/src/SMTP.php';

$mail = new PHPMailerPHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('en', './php_mailer/language/');
$mail->isSMTP();

$uName = $_REQUEST['userName'];
$uEmail = $_REQUEST['userEmail'];
$uSubject = $_REQUEST['userSubject'];
$body = $_REQUEST['userMessage'];

if (!filter_var($uEmail, FILTER_VALIDATE_EMAIL)) {
    echo 'Invalid email format';
    exit;
}
if (empty($uName) || empty($uEmail) || empty($uSubject) || empty($body)) {
    echo '*Please fill all required fields.';
    exit;
}

$mail->setFrom($uEmail, $uName);
$mail->addAddress('ilia.m.composer@gmail.com');
$mail->Subject = $uSubject;

$mail->Body = $body;




if (!$mail->send()) {
    echo "Unable to send email!";
    exit;
} else {
    echo "Email has been send!";
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];


echo json_encode($output);
