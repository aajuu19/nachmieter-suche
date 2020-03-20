<?php require_once('essentials/functions.php');
	
	$mail = $_POST['log-mail'];
	$password = $_POST['log-pw'];
	
	// fetch person with certain email
	$person = $db->prep_exec("SELECT * FROM person WHERE email = :email", ['email' => $mail], 'one');		        
	
	// check if password is correct
	if (password_verify($password, $person[1]['password'])) {
		$_SESSION['person'] = $person[1];
		unset($_SESSION['person']['password']);
		header('Location: '.$web->root.'/user/dashboard.php');
	} else {
		$error_message = rawurlencode('Falsche E-Mail-Adresse oder falsches Passwort eingegeben');
		header('Location: '.$web->root.'/registrierung-login.php?login&error='.$error_message);
	}
	
	$db->close_connect();
?>