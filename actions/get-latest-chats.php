<?php require_once('../essentials/functions.php'); require_once('../essentials/secure_page.php');
if(($_POST['csrf-token'] == $web->get_csrf_token())) {

    $user = $web->get_own_user();
    $sql_q = 'SELECT c_id, last_visited, send_p_id, rec_p_id, timestamp FROM chat AS c WHERE c_id=(SELECT MAX(c1.c_id) FROM chat AS c1 WHERE c.send_p_id = c1.send_p_id) AND rec_p_id = ? AND last_visited IS NULL ORDER BY timestamp';
    $result = $db->prep_exec($sql_q,
        [
            $user['p_id']
        ],
        'all'
    );

    $data = [];
    foreach($result as $key) {
        if(!isset($key['last_visited'])){
            $data[] = $key; 
        }
    }

    // create JSON from $data variable
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
    
} else {
    return false;
    die;
}