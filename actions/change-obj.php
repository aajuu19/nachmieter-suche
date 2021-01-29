<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $flat_id = $web->htmlchar($_POST['flat_id']);
    $flat_data = $db->get_flat($flat_id);

    $name = $web->htmlchar($_POST['obj-name']);
    $desc = $web->htmlchar($_POST['obj-beschreibung']);
    $quadratmeter = $web->htmlchar($_POST['obj-quadratmeter']);
    $zimmer = $web->htmlchar($_POST['obj-zimmer']);
    $bad = $web->htmlchar($_POST['obj-bad']);
    $adresse = $web->htmlchar($_POST['obj-adresse']);
    $kalt = $web->htmlchar($_POST['obj-kalt']);
    $typ = $web->htmlchar($_POST['obj-typ']);



    // optional entries
    $warm = $_POST['obj-warm'] == "" ? null : $web->htmlchar($_POST['obj-warm']);
    $etage = $_POST['obj-etage'] == "" ? null : $web->htmlchar($_POST['obj-etage']);
    $einzug = $_POST['obj-einzug'] == "" ? null : $web->htmlchar($_POST['obj-einzug']);
    
    $p_id = $user_id['p_id'];
    
    $address = explode(' ', $adresse);
    $address_json = json_decode(file_get_contents("../js/json/plz-ort-min.json"));

    foreach($address_json as $key => $val) {
        if($address[0] == $val->plz) {
            $addressIsValid = true;
            break;
        }
    }

     // if record was found
     if($addressIsValid) {
        
        $update_sql = 'UPDATE objekt SET ';
        $update_data = [];

        if ($_POST['obj-name'] != $flat_data['name']) {
            $update_sql .= ' name = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-name']);
        }
        if ($_POST['obj-quadratmeter'] != $flat_data['quadratmeter']) {
            $update_sql .= ' quadratmeter = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-quadratmeter']);
        }
        if ($_POST['obj-zimmer'] != $flat_data['zimmer']) {
            $update_sql .= ' zimmer = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-zimmer']);
        }
        if ($_POST['obj-bad'] != $flat_data['bad']) {
            $update_sql .= ' bad = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-bad']);
        }
        if ($_POST['obj-kalt'] != $flat_data['kalt']) {
            $update_sql .= ' kalt = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-kalt']);
        }
        if ($_POST['obj-warm'] != $flat_data['warm']) {
            $update_sql .= ' warm = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-warm']);
        }
        if ($_POST['obj-typ'] != $flat_data['typ']) {
            $update_sql .= ' typ = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-typ']);
        }
        if ($_POST['obj-etage'] != $flat_data['etage']) {
            $update_sql .= ' etage = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-etage']);
        }
        if ($_POST['obj-einzug'] != $flat_data['einzug']) {
            $update_sql .= ' einzug = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-einzug']);
        }
        if ($_POST['obj-adresse'] != $flat_data['adresse']) {
            $update_sql .= ' adresse = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-adresse']);
        }
        if ($_POST['obj-beschreibung'] != $flat_data['beschreibung']) {
            $update_sql .= ' beschreibung = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-beschreibung']);
        }
        if ($_POST['obj-einzug'] != $flat_data['einzug']) {
            $update_sql .= ' einzug = ?, ';
            $update_data[] = $web->htmlchar($_POST['obj-einzug']);
        }

        // Looping all files
        $image_files = [];
        for($i=1;$i<=7;$i++) {
            $image_file = $_FILES['obj-image-'.$i];
            if ($image_file && $image_file['size'] >= 1) {
                $info = getimagesize($image_file['tmp_name']);
                
                if (($image_file['error'] == UPLOAD_ERR_OK) && ($info !== FALSE) && ($info[2] === IMAGETYPE_GIF) || ($info[2] === IMAGETYPE_JPEG) || ($info[2] === IMAGETYPE_PNG)) {
                    
                    $filename = $web->format_link($image_file['name']);
                    $new_id = uniqid();
                    $img_link = $new_id.'-'.$filename;
                    ${"image_$i"} = $img_link;
                    $image_file['name'] = $img_link;
                    $image_files[] = $image_file;
                    
                    // add to sql query and data
                    $update_sql .= ' image_'.$i.' = ?, ';
                    $update_data[] = $web->htmlchar($img_link);
                } else {
                    $error_message = rawurlencode('Beim hochladen einer Bilddatei ist ein Fehler aufgetreten. Bitte versuche es noch einmal.');
                    header('Location: '.$web->root.'/user/neues-objekt.php?flat_id='.$flat_data['o_id'].'&error='.$error_message);
                }
            } else {
                $active_image = $_POST['act_image_'.$i];
                if ($i == 1 && $active_image == '') {
                    $update_sql .= ' image_1 = ?, ';
                    $update_data[] = 'placeholder.jpg';        
                } else if ($flat_data['image_'.$i] !== $active_image && $active_image !== '') {
                    $update_sql .= ' image_'.$i.' = ?, ';
                    $update_data[] = $active_image;
                } else if (!is_null($flat_data['image_'.$i]) && $flat_data['image_'.$i] !== $active_image) {
                    $update_sql .= ' image_'.$i.' = ?, ';
                    $update_data[] = NULL;
                }
            }
        }

        $countfiles = count($image_files);

        if($countfiles >= 1) {   
            // Looping all files
            for($i=1;$i<=$countfiles;$i++) {
                $current_image = $image_files[$i-1];
                // Upload file
                $web->compress_image(1200, 850, $image_files[$i-1]['tmp_name'], '../uploads/'.$current_image['name'], 70);
            }
        }

        // delete last comma from sql query for syntactic reasons
        $update_sql = rtrim($update_sql, ", ");

        if(count($update_data) <= 1) {
            $success_message = rawurlencode('Das Objekt wurde erfolgreich geändert.');
            header('Location: '.$web->root.'/objekte/'.$flat_data['link'].'?bestaetigung='.$success_message);
        } 
        
        $update_sql .= ' WHERE o_id = ?';
        $update_data[] = $flat_id;

        $db->prep_exec(
            // sql statement here
            $update_sql
            ,
            // execute here
            $update_data
        );

        $success_message = rawurlencode('Das Objekt wurde erfolgreich geändert.');
        header('Location: '.$web->root.'/objekte/'.$flat_data['link'].'?bestaetigung='.$success_message);

    } else {
        // if record was not found
        $error_message = rawurlencode('Bitte gib eine gültige Postleitzahl ein.');
	    header('Location: '.$web->root.'/user/neues-objekt.php?flat_id='.$flat_data['o_id'].'&error='.$error_message);
    }
        