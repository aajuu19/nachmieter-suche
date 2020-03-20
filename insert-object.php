<?php
		session_start();
		if(!isset($_SESSION['userid'])) {
		    die('Bitte zuerst <a href="login.php">einloggen</a>');
		}
		 
		//Abfrage der Nutzer ID vom Login
		$userid = $_SESSION['userid'];
		 
		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "nachmieter_gesucht";

		try {
			$connect = new PDO ("mysql:host=$host;dbname=$database", $user, $password);
			$connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			// prepare sql and bind parameters
		    $stmt = $connect->prepare("INSERT INTO mietobjekt (name, quadratmeter, zimmer, kalt, warm, einzug, strasse, plz, ort, beschreibung, p_id) 
		    VALUES (:name, :quadratmeter, :zimmer, :kalt, :warm, :einzug, :strasse, :plz, :ort, :beschreibung, :userid)");

		    $stmt->bindParam(':name', $objektname);
		    $stmt->bindParam(':quadratmeter', $quadratmeter);
		    $stmt->bindParam(':zimmer', $zimmer);
		    $stmt->bindParam(':kalt', $kaltmiete);
		    $stmt->bindParam(':warm', $warmmiete);
		    $stmt->bindParam(':einzug', $einzugsdatum);
		    $stmt->bindParam(':strasse', $strasse);
		    $stmt->bindParam(':plz', $plz);
		    $stmt->bindParam(':ort', $ort);
		    $stmt->bindParam(':beschreibung', $beschreibung);
		    $stmt->bindParam(':userid', $userid);

		    // insert a row
		    $objektname = $_POST['objektname'];
			$quadratmeter = $_POST['quadratmeter'];
			$zimmer = $_POST['zimmer'];
			$kaltmiete = $_POST['kaltmiete'];
			$warmmiete = $_POST['warmmiete'];
			$einzugsdatum = $_POST['einzugsdatum'];
			$strasse = $_POST['strasse'];
			$plz = $_POST['plz'];
			$ort = $_POST['ort'];
			$beschreibung = $_POST['beschreibung'];
			
		    $stmt->execute();

		} catch (PDOException $error) {
			echo 'Database connection failed';
			echo $error->getMessage();
		}

		$connect = null;

		header("Location: http://localhost/nachmieter-gesucht.de/formularbestaetigung.php");
		die();
	?>