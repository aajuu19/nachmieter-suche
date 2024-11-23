<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    if(($_POST['csrf-token'] == $web->get_csrf_token())) {
        // Abfrage der Nutzer ID vom Login
        $user_id = $_SESSION['person'];

        // required entries
        $rec = $_POST['send_to_user'];
        $send = $_POST['i_am_user'];

        if ($send == $user_id['p_id'] && isset($rec) && isset($send)) {
            $db->prep_exec(
                // sql statement here
                'INSERT INTO friendship_request (rec_p_id, send_p_id) VALUES (?,?)'
                ,
                // execute here
                [
                    $rec,
                    $send,
                ]
            );
            $success_message = rawurlencode('Deine Freundschaftsanfrage wurder erfolgreich verschickt.');
            header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&bestaetigung='.$success_message);
            die;
        } else {
            $error_message = rawurlencode('Ein Fehler ist aufgetreten, bitte versuche es noch einmal.');
            header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&error='.$error_message);
            die;
        }
    } else {
        $error_message = rawurlencode('Ein Fehler ist aufgetreten, bitte versuche es noch einmal.');
        header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&error='.$error_message);
        die;
    }