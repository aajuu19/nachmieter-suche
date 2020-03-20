<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">

	<title>Nachmieter gesucht</title>
	<style>
		* {
			padding: 0;
			margin: 0;
			font-family: "Roboto";
			box-sizing: border-box;
		}
		label {
			display: block;
			margin-top: 1rem;
			padding-bottom: 1rem;
		}
		input {
			padding: 1.5rem 1rem;
			display: block;
			width: 100%;
		}
		main {
			width: 1000px;
			margin: 0 auto;
		}
		.btn {
			margin-top: 2rem;
			padding: 1.5rem 1rem;
			display: block;
			width: 100%;
			background: #efefef;
			border: none;
			transition: .4s;
		}
		.btn:hover {
			background: #d8d8d8;
			cursor: pointer;
		}
	</style>
</head>
<body>

	<?php
		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "nachmieter_gesucht";

		try {
			$connect = new PDO ("mysql:host=$host;dbname=$database", $user, $password);
			$connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			echo 'Database connected';

		} catch (PDOException $error) {
			echo 'Database connection failed';
			echo $error->getMessage();
		}

		$connect = null;
	?>

	<main>
		<form action="insert-object.php" method="POST">
			<label for="objektname">Name des Objektes</label>
			<input name="objektname" id="objektname" type="text" placeholder="Geben Sie den Namen des Objektes ein">

			<label for="quadratmeter">Quadratmeter</label>
			<input name="quadratmeter" id="quadratmeter" type="number" placeholder="Geben Sie die Qaudratmeter ein">

			<label for="zimmer">Zimmer</label>
			<input name="zimmer" id="zimmer" type="number" placeholder="Geben Sie die Anzahl der Zimmer ein">
			
			<label for="kaltmiete">Kaltmiete</label>
			<input name="kaltmiete" id="kaltmiete" type="decimal" placeholder="Geben Sie die Kaltmiete ein">

			<label for="warmmiete">Warmmiete</label>
			<input name="warmmiete" id="warmmiete" type="number" placeholder="Geben Sie die Warmmiete ein">

			<label for="einzugsdatum">Einzugsdatum</label>
			<input name="einzugsdatum" id="einzugsdatum" type="date" placeholder="Geben Sie das Voraussichtliche Einzugsdatum ein">
			
			<label for="strasse">Straße</label>
			<input name="strasse" id="strasse" type="text" placeholder="Geben Sie die Straße des Objektes ein">

			<label for="plz">Postleitzahl</label>
			<input name="plz" id="plz" type="text" placeholder="Geben Sie die Postleitzahl ein">

			<label for="ort">Ort</label>
			<input name="ort" id="ort" type="text" placeholder="Geben Sie den Ort an">
			
			<label for="beschreibung">Beschreibung</label>
			<input name="beschreibung" id="beschreibung" type="text" placeholder="Geben Sie eine Beschreibung des Objektes ein">

			<input type="submit" class="btn">
		</form>
	</main>
</body>
</html>