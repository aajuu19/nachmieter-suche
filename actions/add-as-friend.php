<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $rec = $_GET['send_to_user'];
    $send = $_GET['i_am_user'];

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
        echo true;
    } else {
        echo false;
    }
        