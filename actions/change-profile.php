<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');


    // required entries
    
    $lookingfor = $web->htmlchar($_POST['pers-lookingfor']);
    $gender = $web->htmlchar($_POST['pers-gender']);
    $description = !isset($_POST['pers-desc']) || empty($_POST['pers-desc']) ? null : $web->htmlchar($_POST['pers-desc']);
    $job = !isset($_POST['pers-job']) || empty($_POST['pers-job']) ? null : $web->htmlchar($_POST['pers-job']);
    $lf_quadratmeter = !isset($_POST['pers-lf-quadratmeter']) ? null : $web->htmlchar($_POST['pers-lf-quadratmeter']);
    $lf_zimmer = !isset($_POST['pers-lf-zimmer']) ? null : $web->htmlchar($_POST['pers-lf-zimmer']);
    $lf_kaltmiete = !isset($_POST['pers-lf-kalt']) ? null : $web->htmlchar($_POST['pers-lf-kalt']);
    $lf_warmmiete = !isset($_POST['pers-lf-warm']) ? null : $web->htmlchar($_POST['pers-lf-warm']);
    $lookingfrom = !isset($_POST['pers-lookingfrom']) || empty($_POST['pers-lookingfrom']) ? null : $web->htmlchar($_POST['pers-lookingfrom']);
    $birthdate = !isset($_POST['pers-birthdate']) || empty($_POST['pers-birthdate']) ? null : $web->htmlchar($_POST['pers-birthdate']);
    $lf_adresse = !isset($_POST['pers-address']) || empty($_POST['pers-address']) ? null : $web->htmlchar($_POST['pers-address']);

    $profilepic = $_FILES['pers-profilepic']['name'][0] == "" ? null : $_FILES['pers-profilepic'];
    
    if($lf_adresse) {

        $address = explode(' - ', $lf_adresse);
        $address_json = json_decode(file_get_contents("../js/json/orte.json"));
        
        foreach($address_json as $key => $val) {
            if ($lf_adresse == $val->ort) {
                $addressIsValid = true;
                break;
            } else if(array_key_exists(0, $address) || ($address[0] == $val->ort)) {
                $addressIsValid = true;
                break;
            } else if(array_key_exists(1, $address) || ($address[1] == $val->ort)) {
                $addressIsValid = true;
                break;
            }
        }
    
        if(!$addressIsValid) {
            $error_message = rawurlencode('Die von dir eingegebene Adresse ist nicht gültig. Bitte probieres es noch einmal mit einer gültigen Adresse aus der Liste.');
            header('Location: '.$web->root.'/user/profil-bearbeiten.php?error='.$error_message);
            die;
        }
    }

    if ($profilepic && $profilepic['error'] == UPLOAD_ERR_OK) {
        $error_message = rawurlencode('Dein Profilbild konnte nicht hochgeladen werden, bitte probiere es noch einmal.');
        header('Location: '.$web->root.'/user/profil-bearbeiten.php?error='.$error_message);
        die;
    } else if ($profilepic) {
        $info = getimagesize($profilepic['tmp_name'][0]);

        if ($info === FALSE) {
            $error_message = rawurlencode('Dein Profilbild ist nicht vom Typ jpg, jpeg, png oder gif.');
            header('Location: '.$web->root.'/user/profil-bearbeiten.php?error='.$error_message);
            die;
        }
    
        if (($info[2] !== IMAGETYPE_GIF) && ($info[2] !== IMAGETYPE_JPEG) && ($info[2] !== IMAGETYPE_PNG)) {
            $error_message = rawurlencode('Dein Profilbild ist nicht vom Typ jpg, jpeg, png oder gif. Bitte probieres es noch einmal mit einem anderen Bild.');
            header('Location: '.$web->root.'/user/profil-bearbeiten.php?error='.$error_message);
            die;
        }
    }

    $own_user = $web->get_own_user();
    
    if ($profilepic['name'][0]) {   
        $filename = $web->format_link($profilepic['name'][0]);
        $new_id = uniqid();
        $img_link = $new_id.'-'.$filename;
    }

    if ($profilepic) {
        $sql = 'UPDATE person SET lookingfor = ?, gender = ?, profilepic = ?, beschreibung = ?, job = ?, lf_quadratmeter = ?, lf_zimmer = ?, lf_kaltmiete = ?, lf_warmmiete = ?, lookingfrom = ?, birthdate = ? WHERE p_id = ?';
        
        // if record was found
        $db->prep_exec(
            // sql statement here
            $sql
            ,
            // execute here
            [
                $lookingfor,
                $gender,
                $img_link,
                $description,
                $job,
                $lf_quadratmeter,
                $lf_zimmer,
                $lf_kaltmiete,
                $lf_warmmiete,
                $lookingfrom,
                $birthdate,
                $own_user['p_id'],
            ]
        );

        // if copy worked
        if($img_link != "") {   
            // Upload file
            // copy($profilepic['tmp_name'][0], '../uploads/'.$img_link);
            $web->compress_image(500, 500, $profilepic['tmp_name'][0], '../uploads/'.$img_link, 70);
        } else {
            $error_message = rawurlencode('Dein Profilbild konnte nicht hochgeladen werden. Bitte probieres es noch einmal mit einem anderen Bild.');
            header('Location: '.$web->root.'/user/profil-bearbeiten.php?error='.$error_message);
            die;
        }
        
        $success_message = rawurlencode('Dein Profil wurde erfolgreich bearbeitet.');
        header('Location: '.$web->root.'/user/user.php?id='.$user['p_id'].'&bestaetigung='.$success_message);
        die;

    } else {
        $sql = 'UPDATE person SET lookingfor = ?, gender = ?, beschreibung = ?, job = ?, lf_quadratmeter = ?, lf_zimmer = ?, lf_kaltmiete = ?, lf_warmmiete = ?, lf_adresse = ?, lookingfrom = ?, birthdate = ? WHERE p_id = ?';
        $db->prep_exec(
            // sql statement here
            $sql
            ,
            // execute here
            [
                $lookingfor,
                $gender,
                $description,
                $job,
                $lf_quadratmeter,
                $lf_zimmer,
                $lf_kaltmiete,
                $lf_warmmiete,
                $lf_adresse,
                $lookingfrom,
                $birthdate,
                $own_user['p_id'],
            ]
        );
        
        $success_message = rawurlencode('Dein Profil wurde erfolgreich bearbeitet.');
        header('Location: '.$web->root.'/user/user.php?id='.$user['p_id'].'&bestaetigung='.$success_message);
        die;
    }
