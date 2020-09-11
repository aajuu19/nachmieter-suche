<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $rec = $web->htmlchar($_POST['rec']);
    $send = $web->htmlchar($_POST['send']);
    $msg = $web->htmlchar($_POST['msg']);
    $o_id = $web->htmlchar($_POST['o_id']);

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
        