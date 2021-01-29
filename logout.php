<?php 
    require_once('essentials/functions.php');
    session_start();
    session_destroy();
    
    $success_message = rawurlencode('Du bist nun abgemeldet, bis zum nächsten mal.');
    header('Location: '.$web->root.'/registrierung-login.php?login&bestaetigung='.$success_message);
