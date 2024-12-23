<?php require_once('../essentials/functions.php'); 

	$error = false;

	$name = $web->htmlchar($_POST['reg-name']);
	$mail = $web->htmlchar($_POST['reg-mail']);
	$password = $web->htmlchar($_POST['reg-pw']);
	$gender = $web->htmlchar($_POST['reg-gender']);
	$lookingfor = $web->htmlchar($_POST['reg-lookingfor']);

	if(strlen($name) >= 50) {
		$error_message = rawurlencode('Dein Name ist zu lang.');
		header('Location: '.$web->root.'/registrierung-login.php?registrierung&error='.$error_message);
	}

	// check, if mail is already registered
	if(!$error) { 

		$res = $db->prep_exec("SELECT * FROM person WHERE email = :email", [':email' => $mail], 'one');

		if($res !== false) {
			$error = true;
			$error_message = rawurlencode('Diese E-Mail-Adresse ist bereits vergeben.');
			header('Location: '.$web->root.'/registrierung-login.php?error='.$error_message);
			die();
		}
	}
	
	// no errors, go on and register user
	if(!$error) {

		$password_hash = password_hash($password, PASSWORD_DEFAULT);
		
		$res = $db->prep_exec("INSERT INTO person (name, email, password, gender, lookingfor) VALUES (:name, :email, :password, :gender, :lookingfor)", 
			[
				'name' => $name,
				'email' => $mail, 
				'password' => $password_hash, 
				'gender' => $gender, 
				'lookingfor'=>$lookingfor
			]
		);
		
		$success_message = rawurlencode('Dein Benutzeraccount wurde erfolgreich angelegt.');
		header('Location: '.$web->root.'/registrierung-login.php?bestaetigung='.$success_message);
		die();
	} 

	$db->close_connect();
?>

