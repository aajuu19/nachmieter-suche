<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');
	
	$mail = $_POST['log-mail'];
	$password = $_POST['log-pw'];
	
	// fetch person with certain email
	$person = $db->prep_exec("SELECT * FROM person WHERE email = :email", ['email' => $mail], 'one');	        

	// check if password is correct
	if (password_verify($password, $person['password'])) {
		$_SESSION['person'] = $person;
		unset($person['password']);
		header('Location: '.$web->root.'/user/user.php?id='.$person['p_id']);
	} else {
		$error_message = rawurlencode('Falsche E-Mail-Adresse oder falsches Passwort eingegeben.');
		header('Location: '.$web->root.'/registrierung-login.php?login&error='.$error_message);
	}
	
	$db->close_connect();
?>