<?php require_once('dbs.php');
    session_start();
    // $data content depends on $request_type / $_GET
    $isDev = false;

    if($isDev) {
        $request_type = $_GET;
    } else {
        $request_type = $_POST;
    }

    $data = [];

    if(isset($request_type['wohnungen'])) {

        // smaller or greater? returns operand and value without min or max string
        function sm_or_gr($str) {  
            $arr = explode('-', $str);
            if($arr[0] == 'min') {
                return '>='.$arr[1].' AND ';
            } else if($arr[0] == 'max') {
                return '<='.$arr[1].' AND ';
            } 
        }

        // build sql statement - be sure no sql injection can be made
        $sql_stmt = 'SELECT * FROM `objekt` WHERE ';

        
        foreach($request_type as $key => $val) {
            switch($key) {
                case 'quadratmeter':
                case 'zimmer':
                case 'kalt':
                case 'etage':
                    $sql_stmt .= $key.sm_or_gr($val);
                    break;
                // limit always on the end
                case 'limit':
                    if(isset($request_type['page'])) {
                        $sql_stmt .= 'ORDER BY einstellungsdatum DESC LIMIT '.($request_type['page'] * $request_type['limit'] - $request_type['limit']).','.$request_type['limit'];
                    } else {
                        // ?page-parameter has to be set
                        die('Seitenanzahl muss angegeben werden.');
                    }
                    break;     
            }
        }
        

        // delete AND && WHERE statement when no parameter (except page and limit) is given
        $pos = strrpos($sql_stmt, 'AND');

        if($pos != 0) {
            $sql_stmt = substr_replace($sql_stmt, '', $pos, 3);
        } else {
            $pos2 = strrpos($sql_stmt, 'WHERE');
            $sql_stmt = substr_replace($sql_stmt, '', $pos2, 5);
        }

        $data = $db->get_this_all($sql_stmt);
    }

    // check if chats json is requested and if requested session p_ID is actual Session p_ID
    if(isset($request_type['chats'])) {
        $user_id = $request_type['user'];
        $user_id_int = (is_numeric($user_id) ? (int)$user_id : 0);

        if($user_id_int == $_SESSION['person']['p_id']) {
            // build sql statement - be sure no sql injection can be made
            // fetch all user based chats
            $sql_stmt = 'SELECT chat.c_id, chat.* FROM chat WHERE rec_p_id = :u_id1 OR send_p_id = :u_id2';
            $chat_data = $db->prep_exec($sql_stmt, ['u_id1' => $user_id_int, 'u_id2' => $user_id_int], 'all');

            // create array with all foreign p_id's
            $chat_with_users = [];
            foreach($chat_data as $key) {
                if($key['rec_p_id'] != $user_id) {
                    if(!in_array($key['rec_p_id'], $chat_with_users)) {
                        array_push($chat_with_users, $key['rec_p_id']);
                    }
                } else if($key['send_p_id'] != $user_id) {
                    if(!in_array($key['send_p_id'], $chat_with_users)) {
                        array_push($chat_with_users, $key['send_p_id']);
                    }
                }
            }

            // create associative array $data with all chats based on their p_id
            foreach($chat_with_users as $p_id) {
                foreach($chat_data as $chat) {
                    if($chat['send_p_id'] == $p_id || $chat['rec_p_id'] == $p_id) {
                        $data[$p_id][] = $chat;
                    }
                }
            }
            
            // $attributes = array('fat', 'quantity', 'ratio', 'label');

            // foreach ($levels as $key => $level) {
            //     foreach ($attributes as $k =>$attribute) {
            //         $variables[$level][] = $attribute . '_' . $level; // changed $variables[] to $variables[$level][]
            //     }
            // }
            // echo '<pre>' . print_r($variables,1) . '</pre>';  
            // die();

        } else {
            die('Anfrage konnte nicht ausgeführt werden.');
        }
    }

    if(isset($request_type['flat_by_id'])) {
        $o_id = $request_type['flat_by_id'];
        $data[] = $db->prep_exec('SELECT * FROM `objekt` WHERE o_id = :o_id', ['o_id' => $o_id], 'one');
    }

    if(isset($request_type['user_by_id'])) {
        $p_id = $request_type['user_by_id'];
        $data[] = $db->prep_exec('SELECT * FROM `person` WHERE p_id = :p_id', ['p_id' => $p_id], 'one');
        unset($data[0]['password']);
    }

    $db->close_connect();

    // create JSON from $data variable
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
