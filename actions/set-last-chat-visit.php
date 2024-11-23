<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');
if(($_POST['csrf-token'] == $web->get_csrf_token())) {
    // Abfrage der Nutzer ID vom Login
    $user = $web->get_own_user();
    
    $sent_user_id = $_POST['user_id'];
    $last_chat_id = $_POST['c_id'];

    if ($sent_user_id == $user['p_id']) {
        
        $sql_q = 'UPDATE chat SET last_visited = now() WHERE c_id = ?';
        $db->prep_exec($sql_q,
            [
                $last_chat_id
            ]
        );

        echo true;
    } else {
        echo false;
    }
} else {
    return false;
    die;
}