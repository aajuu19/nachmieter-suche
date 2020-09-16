<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    // Abfrage der Nutzer ID vom Login
    $user_id = $web->get_own_user();

    // required entries
    $own_user = $_GET['i_am_user'];
    $foreign_user_id = $_GET['confirm_user'];

    $sql = "SELECT * FROM friendship_request WHERE send_p_id = ".$foreign_user_id;
    $is_request_sender = $db->get_this_one($sql);
    if ($own_user == $user_id['p_id'] && $is_request_sender && $own_user != $foreign_user_id && isset($own_user) && isset($foreign_user_id)) {
        
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
        echo "HAT WOHL GEKLAPPT";
    } else {
        echo "HAT WOHL Nicht GEKLAPPT";
        echo false;
    }
        