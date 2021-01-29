<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');
    $user_sess = $web->get_own_user();
    $user = $db->get_user($user_sess['p_id'], true);
    $p_id = $user_sess['p_id'];

    if (password_verify($_POST['user_del_pw'], $user['password'])) {
        
        $all_objects = $db->prep_exec('SELECT * FROM objekt WHERE p_id = ?', [$p_id], 'all');
        $from_another_src = true;
        include './delete-flat.php';
        foreach($all_objects as $key) {
            $_POST['flat_id'] = $key['o_id'];
            $_POST['flat_link'] = $key['link'];
            deleteFlat($db, $user, $from_another_src);
        }

        $sql_q = "DELETE FROM friendship_request WHERE rec_p_id = ? OR send_p_id = ?";
        $db->prep_exec(
            $sql_q,
            [$p_id, $p_id]
        );
        
        $sql_q = "DELETE FROM friendships WHERE p1_id = ? OR p2_id = ?";
        $db->prep_exec(
            $sql_q,
            [$p_id, $p_id]
        );
        
        $sql_q = "DELETE FROM chat WHERE rec_p_id = ? OR send_p_id = ?";
        $db->prep_exec(
            $sql_q,
            [$p_id, $p_id]
        );

        $sql_q = "DELETE FROM person WHERE p_id = ?";
        $db->prep_exec(
            $sql_q,
            [$p_id]
        );


        if ($user['profilepic'] !== 'placeholder.jpg') {
            $file = './../uploads/'.$user['profilepic'];
            if(file_exists($file)) {
                unlink($file);
            }
        }

        session_destroy();
        $success_message = rawurlencode('Dein Benutzeraccount wurde erfolgreich gelöscht.');
		header('Location: '.$web->root.'/registrierung-login.php?bestaetigung='.$success_message);
		die();

    } else {
        $error_message = rawurlencode('Bitte überprüfe noch einmal dein Passwort.');
        header('Location: '.$web->root.'/user/settings.php?error='.$error_message);
        die;
    }
