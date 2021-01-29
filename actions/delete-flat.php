<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    function deleteFlat($db,  $user, $from_another_src) {
        $o_id = $_POST['flat_id'];
        $o_link = $_POST['flat_link'];

        $flat = $db->prep_exec(
            'SELECT * FROM objekt WHERE o_id = ?',
            [
                $o_id,
            ],
            'one'
        );
        
        $imageArray = [];

        if($flat['image_1'] != 'placeholder.jpg') {
            for($i=1; $i<8; $i++) {
                $key = 'image_'.$i;
                if(isset($flat[$key])){
                    $imageArray[] = $flat[$key];
                }
            }
        }

        if ($user['p_id'] == $flat['p_id']) {
            
            $db->prep_exec(
                'DELETE FROM objekt WHERE o_id = ?',
                [
                    $o_id,
                ]
            );

            if(!empty($imageArray)){
                foreach($imageArray as $key) {
                    $file = './../uploads/'.$key;
                    if(file_exists($file)) {
                        unlink($file);
                    }
                }    
            }
            
            if(!isset($from_another_src)) {
                $success_message = rawurlencode('Dein Objekt wurde erfolgreich gelöscht.');
                header('Location: '.$web->root.'/user/user.php?id='.$user['p_id'].'&bestaetigung='.$success_message);
                die();
            }
        } else {
            $error_message = rawurlencode('Ups, etwas ist schief gelaufen. Probiere es noch mal.');
            header('Location: '.$o_link.'?error='.$error_message);
            die();
        }

    }

    if(!isset($from_another_src)) {
        deleteFlat($db, $user);
    }
?>

