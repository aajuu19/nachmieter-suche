<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $name = $web->htmlchar($_POST['obj-name']);
    $desc = $web->htmlchar($_POST['obj-desc']);
    $quadratmeter = $web->htmlchar($_POST['obj-quadratmeter']);
    $zimmer = $web->htmlchar($_POST['obj-zimmer']);
    $bad = $web->htmlchar($_POST['obj-bad']);
    $adresse = $web->htmlchar($_POST['obj-adresse']);
    $kalt = $web->htmlchar($_POST['obj-kalt']);
    $typ = $web->htmlchar($_POST['obj-typ']);

    // optional entries
    $warm = $_POST['obj-warm'] == "" ? null : $web->htmlchar($_POST['obj-warm']);
    $etage = $_POST['obj-etage'] == "" ? null : $web->htmlchar($_POST['obj-etage']);
    $einzug = $_POST['obj-einzugsdatum'] == "" ? null : $web->htmlchar($_POST['obj-einzugsdatum']);
    $uniq_id = uniqid();
    
    $p_id = $user_id['p_id'];
    $next_o_id = $db->get_this_one("SELECT * FROM objekt ORDER BY o_id DESC LIMIT 1")['o_id'] + 1;
    $link = $web->format_link($name).'-'.$uniq_id.'.php';
    
    $address = explode(' ', $adresse);
    var_dump($address);
    $address_json = json_decode(file_get_contents("../js/src/plz-ort-min.json"));
    foreach($address_json as $key => $val) {
        if($address[0] == $val->plz) {
            $addressIsValid = true;
            break;
        }
    }
    
    $image_files = $_FILES['obj-images'];
    $img_names = $image_files['name'];
    if($img_names[0] != "") {   
        // Count total files
        $countfiles = count($img_names);

        if($countfiles > 7) {
            $error_message = rawurlencode('Bitte lade maximal 7 Bilder hoch.');
            header('Location: '.$web->root.'/user/neues-objekt.php?bestaetigung='.$error_message);
        } else {
            // Looping all files
            for($i=1;$i<=7;$i++) {
                if($i <= $countfiles) {
                    $filename = $web->format_link($image_files['name'][$i-1]);
                    $new_id = uniqid();
                    $img_link = $new_id.'-'.$filename;
                    ${"image_$i"} = $img_link;
                } else {
                    ${"image_$i"} = null;
                }
            }
        }   
    } else {
        $image_1 = "placeholder.jpg";
        $image_2 = null;
        $image_3 = null;
        $image_4 = null;
        $image_5 = null;
        $image_6 = null;
        $image_7 = null;
    }

    if($addressIsValid) {
        // if record was found
        $db->prep_exec(
            // sql statement here
            'INSERT INTO objekt (o_id, name, beschreibung, quadratmeter, zimmer, bad, adresse, kalt, typ, warm, etage, einzug, link, image_1, image_2, image_3, image_4, image_5, image_6, image_7, p_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            ,
            // execute here
            [
                $uniq_id,
                $name,
                $desc,
                $quadratmeter,
                $zimmer,
                $bad,
                $adresse,
                $kalt,
                $typ,
                $warm,
                $etage,
                $einzug,
                $link,
                $image_1,
                $image_2,
                $image_3,
                $image_4,
                $image_5,
                $image_6,
                $image_7,
                $p_id
            ]
        );

        // create php file from blueprint
        $src_file = '../objekte/object-page.php';
        $new_file = '../objekte/'.$link;
        
        if (copy($src_file, $new_file)) { 
            // if copy worked

            if($img_names[0] != "") {   
                // Looping all files
                for($i=1;$i<=$countfiles;$i++) {
                    // Upload file
                    copy($image_files['tmp_name'][$i-1], '../uploads/'.${"image_$i"});
                }
            }

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
	    header('Location: '.$web->root.'/user/neues-objekt.php?error='.$error_message);
    }
        