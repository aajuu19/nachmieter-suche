<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');
    
    if(($_POST['csrf-token'] == $web->get_csrf_token())) {
        $user_sess = $web->get_own_user();
        $user = $db->get_user($user_sess['p_id'], true);
        $p_id = $user_sess['p_id'];

        if (password_verify($_POST['acc_pw_old'], $user['password'])) {
            
            if ($_POST['acc_pw_new'] !== $_POST['acc_pw_new_rep']) {
                $error_message = rawurlencode('Deine Passwörter stimmen nicht überein.');
                header('Location: '.$web->root.'/user/settings.php?error='.$error_message);
            } else {
                $password_hash = password_hash($_POST['acc_pw_new'], PASSWORD_DEFAULT);
                $sql = 'UPDATE person SET password = ? WHERE p_id = ?';
                $db->prep_exec(
                    // sql statement here
                    $sql
                    ,
                    // execute here
                    [
                        $password_hash,
                        $p_id
                    ]
                );
            }

            $success_message = rawurlencode('Dein Passwort wurde geändert.');
            header('Location: '.$web->root.'/user/settings.php?bestaetigung='.$success_message);

        } else {
            $error_message = rawurlencode('Bitte überprüfe noch einmal dein Passwort.');
            header('Location: '.$web->root.'/user/settings.php?error='.$error_message);
            die;
        }
    } else {
        $error_message = rawurlencode('Ein Fehler ist aufgetreten, bitte versuche es noch einmal.');
        header('Location: '.$web->root.'/user/settings.php?error='.$error_message);
        die;
    }