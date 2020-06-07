<?php require_once('../essentials/functions.php'); 

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $rec = $_POST['rec'];
    $send = $_POST['send'];
    $msg = $_POST['msg'];
    $o_id = $_POST['o_id'];

    if($send == $user_id['p_id'] && isset($rec) && isset($send) && isset($msg)) {
        $db->prep_exec(
            // sql statement here
            'INSERT INTO chat (rec_p_id, send_p_id, message, o_id) VALUES (?,?,?,?)'
            ,
            // execute here
            [
                $rec,
                $send,
                $msg,
                $o_id,
            ]
        );
        echo true;
    } else {
        echo false;
    }
        