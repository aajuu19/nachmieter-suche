<?php require_once('../essentials/functions.php'); 

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $name = $_POST['obj-name'];
    $desc = $_POST['obj-desc'];
    $quadratmeter = $_POST['obj-quadratmeter'];
    $zimmer = $_POST['obj-zimmer'];
    $adresse = $_POST['obj-adresse'];
    $kalt = $_POST['obj-kalt'];

    // optional entries
    $warm = $_POST['obj-warm'] == "" ? null : $_POST['obj-warm'];
    $etage = $_POST['obj-etage'] == "" ? null : $_POST['obj-etage'];
    $einzug = $_POST['obj-einzugsdatum'] == "" ? null : $_POST['obj-einzugsdatum'];
    $uniq_id = uniqid();

    $p_id = $user_id['p_id'];
    $next_o_id = $db->get_this_one("SELECT * FROM objekt ORDER BY o_id DESC LIMIT 1")['o_id'] + 1;
    $link = $web->format_link($name).'-'.$uniq_id.'.php';

    $address_obj = $web->get_from_url('https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q='.rawurlencode($adresse));

    if($address_obj->records) {
        // if record was found
        $db->prep_exec(
            // sql statement here
            'INSERT INTO objekt (name, beschreibung, quadratmeter, zimmer, adresse, kalt, warm, etage, einzug, link, p_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
            ,
            // execute here
            [
                $name,
                $desc,
                $quadratmeter,
                $zimmer,
                $adresse,
                $kalt,
                $warm,
                $etage,
                $einzug,
                $link,
                $p_id
            ]
        );

        // create php file from blueprint
        $src_file = '../objekte/object-page.php';
        $new_file = '../objekte/'.$link;
        
        if (copy($src_file, $new_file)) { 
            // if copy worked
            $success_message = rawurlencode('Das Objekt wurde erfolgreich eingefügt.');
            header('Location: '.$web->root.'/user/neues-objekt.php?bestaetigung='.$success_message);
        } 
        else { 
            // if copy doesnt worked
            // delete last record because file could not be created
            
            $db->prep_exec("DELETE FROM `objekt` WHERE `objekt`.`link` = ?", [$link]);
            $db->close_connect();

            // print out error message
            $error_message = rawurlencode('Das Objekt konnte nicht angelegt werden, bitte informiere den Administrator oder probiere es mit anderen Angaben.');
            header('Location: '.$web->root.'/user/neues-objekt.php?error='.$error_message);
        } 

    } else {
        // if record was not found
        $error_message = rawurlencode('Bitte gib eine gültige Postleitzahl ein.');
	    header('Location: '.$web->root.'/user/neues-objekt.php?bestaetigung='.$error_message);
    }
        