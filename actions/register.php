<?php require_once('essentials/functions.php');
	$conn = $db->pdo;

	$error = false;

	$name = $_POST['reg-name'];
	$mail = $_POST['reg-mail'];
	$password = $_POST['reg-pw'];

	// check, if mail is already registered
	if(!$error) { 

		$res = $db->prep_exec("SELECT * FROM person WHERE email = :email", [':email' => $mail], 'one');

		if($res[1] !== false) {
			$error = true;
			$error_message = rawurlencode('Diese E-Mail-Adresse ist bereits vergeben.');
			header('Location: '.$web->root.'/registrierung-login.php?error='.$error_message);
			die();
		}
	}
	
	// no errors, go on and register user
	if(!$error) {

		$password_hash = password_hash($password, PASSWORD_DEFAULT);
		
		$res = $db->prep_exec("INSERT INTO person (name, email, password) VALUES (:name, :email, :password)", ['name' => $name,'email' => $mail, 'password' => $password_hash]);
		
		$success_message = rawurlencode('Dein Benutzeraccount wurde erfolgreich angelegt.');
		header('Location: '.$web->root.'/registrierung-login.php?bestaetigung='.$success_message);
		die();
	} 

	$db->close_connect();
?>

