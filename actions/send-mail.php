<?php require_once('../essentials/functions.php');
if(($_POST['cont-name'] == '') || !$web->is_valid_email($_POST['cont-email']) || !isset($_POST['cont-data-policy']) || ($_POST['cont-message'] == '')) {
    $error_message = rawurlencode('Deine Nachricht konnte nicht abgesendet werden, bitte überprüfe noch einmal deine Angaben.');
    header('Location: '.$web->root.'/kontakt.php?error='.$error_message);    
} else {
    $to      = $config['mail'];
    $subject = 'Nachricht von '.$_POST['cont-name'].' - '.$_POST['cont-email'];
    $message = $_POST['cont-message'] . '<br>';
    $message .= 'Datenschutzerklärung akzeptiert:' . $_POST['cont-data-policy'];
    $headers = 'From: '. $_POST['cont-email'] . "\r\n" .
        'Reply-To: '. $_POST['cont-email'] . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    
    mail($to, $subject, $message, $headers);
    
    $success_message = rawurlencode('Deine Nachricht wurde erfolgreich abgesendet.');
    header('Location: '.$web->root.'/kontakt.php?bestaetigung='.$success_message);
}

