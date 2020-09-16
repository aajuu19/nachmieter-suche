<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');


    // required entries
    $lookingfor = $web->htmlchar($_POST['pers-lookingfor']);
    $gender = $web->htmlchar($_POST['pers-gender']);
    $description = $_POST['pers-desc'] == "" ? null : $web->htmlchar($_POST['pers-desc']);
    $job = $_POST['pers-job'] == "" ? null : $web->htmlchar($_POST['pers-job']);
    $lookingfrom = $_POST['pers-lookingfrom'] == "" ? null : $web->htmlchar($_POST['pers-lookingfrom']);
    $birthdate = $_POST['pers-birthdate'] == "" ? null : $web->htmlchar($_POST['pers-birthdate']);

    $profilepic = $_FILES['pers-profilepic']['name'][0] == "" ? null : $_FILES['pers-profilepic'];
    
    if ($profilepic && $profilepic['error'] !== UPLOAD_ERR_OK) {
        $error_message = rawurlencode('Dein Profilbild konnte nicht hochgeladen werden, bitte probiere es noch einmal.');
        header('Location: '.$web->root.'/user/profil-bearbeiten.php&error='.$error_message);
    } else if ($profilepic) {
        $info = getimagesize($profilepic['tmp_name']);

        if ($info === FALSE) {
            $error_message = rawurlencode('Dein Profilbild ist nicht vom Typ jpg, jpeg, png oder gif.');
            header('Location: '.$web->root.'/user/profil-bearbeiten.php&error='.$error_message);
        }
    
        if (($info[2] !== IMAGETYPE_GIF) && ($info[2] !== IMAGETYPE_JPEG) && ($info[2] !== IMAGETYPE_PNG)) {
            $error_message = rawurlencode('Dein Profilbild ist nicht vom Typ jpg, jpeg, png oder gif. Bitte probieres es noch einmal mit einem anderen Bild.');
            header('Location: '.$web->root.'/user/profil-bearbeiten.php&error='.$error_message);
        }
    }

    
    $own_user = $web->get_own_user();
    
    if ($profilepic['name'][0]) {   
        $filename = $web->format_link($profilepic['name'][0]);
        $new_id = uniqid();
        $img_link = $new_id.'-'.$filename;
    }

    if ($profilepic) {
        $sql = 'UPDATE person SET lookingfor = ?, gender = ?, profilepic = ?, beschreibung = ?, job = ?, lookingfrom = ?, birthdate = ? WHERE p_id = ?';
        
        // if record was found
        $db->prep_exec(
            // sql statement here
            'UPDATE person SET lookingfor = ?, gender = ?, profilepic = ?, beschreibung = ?, job = ?, lookingfrom = ?, birthdate = ? WHERE p_id = ?'
            ,
            // execute here
            [
                $lookingfor,
                $gender,
                $img_link,
                $description,
                $job,
                $lookingfrom,
                $birthdate,
                $own_user['p_id'],
            ]
        );

        // if copy worked
        if($img_link != "") {   
            // Upload file
            copy($profilepic['tmp_name'][0], '../uploads/'.$img_link);
        }
        
        $success_message = rawurlencode('Dein Profil wurde erfolgreich bearbeitet.');
        header('Location: '.$web->root.'/user/user.php?id='.$user['p_id'].'&bestaetigung='.$success_message);

    } else {
        $sql = 'UPDATE person SET lookingfor = ?, gender = ?, beschreibung = ?, job = ?, lookingfrom = ?, birthdate = ? WHERE p_id = ?';
        $db->prep_exec(
            // sql statement here
            'UPDATE person SET lookingfor = ?, gender = ?, beschreibung = ?, job = ?, lookingfrom = ?, birthdate = ? WHERE p_id = ?'
            ,
            // execute here
            [
                $lookingfor,
                $gender,
                $description,
                $job,
                $lookingfrom,
                $birthdate,
                $own_user['p_id'],
            ]
        );
        
        $success_message = rawurlencode('Dein Profil wurde erfolgreich bearbeitet.');
        header('Location: '.$web->root.'/user/user.php?id='.$user['p_id'].'&bestaetigung='.$success_message);
        
    }
