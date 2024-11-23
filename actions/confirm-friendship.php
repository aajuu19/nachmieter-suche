<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    if(($_POST['csrf-token'] == $web->get_csrf_token())) {
        // Abfrage der Nutzer ID vom Login
        $user_id = $web->get_own_user();

        // required entries
        $own_user = $_POST['i_am_user'];
        $foreign_user_id = $_POST['confirm_user'];
        $decline_friendship = isset($_POST['decline-friendship']);

        $sql = "SELECT * FROM friendship_request WHERE send_p_id = ".$foreign_user_id;
        $is_request_sender = $db->get_this_one($sql);

        if (!$decline_friendship && $own_user == $user_id['p_id'] && $is_request_sender && $own_user != $foreign_user_id && isset($own_user) && isset($foreign_user_id)) {
            
            $db->prep_exec(
                // sql statement here
                'INSERT INTO friendships (p1_id, p2_id) VALUES (?,?)'
                ,
                // execute here
                [
                    $own_user,
                    $foreign_user_id,
                ]
            );
            $db->prep_exec(
                'DELETE FROM friendship_request WHERE send_p_id = ? AND rec_p_id = ?',
                [
                    $foreign_user_id,
                    $own_user
                ]
            );
            $db->close_connect();
            $success_message = rawurlencode('Du hast die Freunschaftsanfrage angenommen.');
            header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&bestaetigung='.$success_message);
            die;
        } else if($decline_friendship && $own_user == $user_id['p_id'] && $is_request_sender && $own_user != $foreign_user_id && isset($own_user) && isset($foreign_user_id)) {
            $db->prep_exec(
                'DELETE FROM friendship_request WHERE send_p_id = ? AND rec_p_id = ?',
                [
                    $foreign_user_id,
                    $own_user
                ]
            );
            $success_message = rawurlencode('Du hast die Freundschaftsanfrage abgelehnt.');
            header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&bestaetigung='.$success_message);
            die;
        } else {
            $error_message = rawurlencode('Ein Fehler ist aufgetreten, bitte versuche es noch einmal.');
            header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&error='.$error_message);
            die;
        }
    } else  {
        $error_message = rawurlencode('Ein Fehler ist aufgetreten, bitte versuche es noch einmal.');
        header('Location: '.$web->root.'/user/user.php?id='.$user_id['p_id'].'&error='.$error_message);
        die;
    }