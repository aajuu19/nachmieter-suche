<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');
if(($_POST['csrf-token'] == $web->get_csrf_token())) {
    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
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
    $uniq_id = uniqid();
    
    $p_id = $user_id['p_id'];
    $link = $web->format_link($name).'-'.$uniq_id.'.php';
    
    $address = explode(' ', $adresse);
    $address_json = json_decode(file_get_contents("../js/json/plz-ort-min.json"));

    foreach($address_json as $key => $val) {
        if($address[0] == $val->plz) {
            $addressIsValid = true;
            break;
        }
    }

    $image_files = [];

    // Looping all files
    for($i=1;$i<=7;$i++) {
        $image_file = $_FILES['obj-image-'.$i];
        if ($image_file && $image_file['size'] >= 1) {
            $info = getimagesize($image_file['tmp_name']);
             
            if (($image_file['error'] == UPLOAD_ERR_OK) && ($info !== FALSE) && ($info[2] === IMAGETYPE_GIF) || ($info[2] === IMAGETYPE_JPEG) || ($info[2] === IMAGETYPE_PNG)) {
                $image_files[] = $image_file;
                $filename = $web->format_link($image_file['name']);
                $new_id = uniqid();
                $img_link = $new_id.'-'.$filename;
                ${"image_$i"} = $img_link;
            } else {
                $error_message = rawurlencode('Beim hochladen einer Bilddatei ist ein Fehler aufgetreten. Bitte versuche es noch einmal.');
                header('Location: '.$web->root.'/user/neues-objekt.php?error='.$error_message);
            }
        } else {
            ${"image_$i"} = NULL;
        }
    }

    $countfiles = count($image_files);

    // if record was found
    if($addressIsValid) {
        
        // create php file from blueprint
        $src_file = '../objekte/object-page.php';
        $new_file = '../objekte/'.$link;
        
        if (copy($src_file, $new_file)) { 
            // if copy worked

            if($countfiles >= 1) {   
                // Looping all files
                for($i=1;$i<=$countfiles;$i++) {
                    // Upload file
                    // copy($image_files['tmp_name'][$i-1], '../uploads/'.${"image_$i"});
                    $web->compress_image(1200, 850, $image_files[$i-1]['tmp_name'], '../uploads/'.${"image_$i"}, 70);
                }
            }

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

            $success_message = rawurlencode('Das Objekt wurde erfolgreich eingefügt.');
            header('Location: '.$web->root.'/user/neues-objekt.php?bestaetigung='.$success_message);
        } 
        else { 
            // if copy doesnt worked
            // print out error message
            $error_message = rawurlencode('Das Objekt konnte nicht angelegt werden, bitte informiere den Administrator oder probiere es mit anderen Angaben.');
            header('Location: '.$web->root.'/user/neues-objekt.php?error='.$error_message);
        } 

    } else {
        // if record was not found
        $error_message = rawurlencode('Bitte gib eine gültige Postleitzahl ein.');
	    header('Location: '.$web->root.'/user/neues-objekt.php?error='.$error_message);
    }
} else  {
    $error_message = rawurlencode('Ein Fehler ist aufgetreten, bitte versuche es noch einmal.');
    header('Location: '.$web->root.'/user/neues-objekt.php?error='.$error_message);
    die;
}