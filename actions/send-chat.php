<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');

    // Abfrage der Nutzer ID vom Login
    $user_id = $_SESSION['person'];

    // required entries
    $rec = $_POST['rec'];
    $send = $_POST['send'];
    $msg = $web->htmlchar($_POST['msg']);
    
    $o_id = isset($_POST['o_id']) == "" ? null : $_POST['o_id'];

    
    if($send == $user_id['p_id'] && isset($rec) && isset($send) && isset($msg)) {
        
        if ($o_id) {
            $sql = 'INSERT INTO chat (rec_p_id, send_p_id, message, o_id) VALUES (?,?,?,?)';
            $data_vals = [$rec, $send, $msg, $o_id];
        } else {
            $sql = 'INSERT INTO chat (rec_p_id, send_p_id, message) VALUES (?,?,?)';
            $data_vals = [$rec, $send, $msg];
        }

        $db->prep_exec($sql,$data_vals);

        echo true;
    } else {
        echo false;
    }
        