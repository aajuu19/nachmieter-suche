<?php

// get user array
$user = $_SESSION['person'];

// check if user is logged in
if(!isset($user)) {
    $error_message = rawurlencode('Bitte logge dich zuerst ein.');
    header('Location: '.$web->root.'/registrierung-login.php?login&error='.$error_message);
}