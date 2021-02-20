<?php require_once('dbs.php');
    session_start();
    // $data content depends on $request_type / $_GET
    $isDev = true;

    if($isDev) {
        $request_type = $_GET;
    } else {
        $request_type = $_POST;
    }

    $data = [];

    if(isset($request_type['users'])) {

        // build sql statement - be sure no sql injection can be made
        $sql_stmt = 'SELECT * FROM `person` WHERE ';

        $limit = $request_type['limit'];

        $page_limit = $request_type['page'] * $limit - $limit;
        
        if(isset($request_type['page'])) {
            $limit_sql = ($request_type['page'] * $request_type['limit'] - $request_type['limit']).','.$request_type['limit'];
        } else if (isset($request_type['savedPage'])) {
            $limit_sql = $request_type['savedPage'];
        }

        $filter_list = [
            'lf_quadratmeter',
            'lf_zimmer',
            'lf_kaltmiete',
            'lf_warmmiete'
        ];

        $filter_values = [];
        $prep_sql = null;
        

        foreach($request_type as $key => $value) {
            foreach ($filter_list as $val) {
                if($key == $val) {
                    $prep_sql .= $key.' = :'.$key.' AND ';
                    $filter_values[$key] = $value;
                }
            }
        }

        if(isset($request_type['address'])) {
            $prep_sql .= " lf_adresse LIKE '%".$request_type['address']."%' AND ";
        }
        
        if($prep_sql) {
            $prep_sql = rtrim($prep_sql, " AND ");
            $sql_stmt = 'SELECT person.p_id, person.name, person.email, person.beschreibung, person.job, person.lf_quadratmeter, person.lf_zimmer, person.lf_kaltmiete, person.lf_warmmiete, person.lf_adresse, person.lookingfor, person.profilepic, person.lookingfrom, person.gender FROM `person` WHERE '.$prep_sql.' ORDER BY registration_date DESC LIMIT '.$limit_sql;

            $data = $db->prep_exec($sql_stmt, $filter_values, 'all');
        } else {
            $sql_stmt = 'SELECT person.p_id, person.name, person.email, person.beschreibung, person.job, person.lf_quadratmeter, person.lf_zimmer, person.lf_kaltmiete, person.lf_warmmiete, person.lf_adresse, person.lookingfor, person.profilepic, person.lookingfrom, person.gender FROM `person` ORDER BY registration_date DESC LIMIT '.$limit_sql;
            
            $data = $db->prep_exec($sql_stmt, $filter_values, 'all');
        }

        
        
    }

    if(isset($request_type['wohnungen'])) {

        // smaller or greater? returns operand and value without min or max string
        function sm_or_gr($str) {  
            $arr = explode('-', $str);
            if($arr[0] == 'min') {
                return ' >= '.$arr[1].' AND ';
            } else if($arr[0] == 'max') {
                return ' <= '.$arr[1].' AND ';
            } 
        }

        // build sql statement - be sure no sql injection can be made
        $sql_stmt = 'SELECT * FROM objekt WHERE ';

        
        foreach($request_type as $key => $val) {
            switch($key) {
                case 'quadratmeter':
                case 'zimmer':
                case 'kalt':
                case 'etage':
                    $sql_stmt .= $key.sm_or_gr($val);
                    break;
                case 'address':
                    $search_str = $val;

                    $sql_stmt .= " adresse LIKE '%".$search_str."%' AND ";
                    break;
                // limit always on the end
                case 'limit':
                    if(isset($request_type['page'])) {
                        $limit_sql = ($request_type['page'] * $request_type['limit'] - $request_type['limit']).','.$request_type['limit'];
                    } else if (isset($request_type['savedPage'])) {
                        $limit_sql = $request_type['savedPage'];
                    }
                    $sql_stmt .= 'ORDER BY einstellungsdatum DESC LIMIT '.$limit_sql;
                    break;     
            }
        }
        
        // delete AND && WHERE statement when no parameter (except page and limit) is given
        $pos = strrpos($sql_stmt, 'AND');

        if($pos != 0) {
            $sql_stmt = substr_replace($sql_stmt, '', $pos, 3);
        } else if (!isset($request_type['address'])) {
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
            $sql_stmt = 'SELECT chat.c_id, chat.* FROM chat WHERE rec_p_id = :u_id1 OR send_p_id = :u_id2 ORDER BY chat.timestamp ASC';
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

            // letzter chat
            // // var_dump($chat);

            // foreach($data as $user => $chats) {

            //     var_dump($user);
            //     var_dump($chats[0]['timestamp']);   
            // }
            //     // var_dump($data);
            // function date_compare($a, $b)
            // {   
            //     $t1 = strtotime(end($a)['timestamp']);
            //     $t2 = strtotime(end($b)['timestamp']);
            //     return $t1 - $t2;
            // }    
            
            // // usort($data, 'date_compare');

            // foreach($data as $p => $val) {
            //     var_dump($p);
            // }


            // if('2020-09-11 17:18:26' > "2020-09-11 18:27:41") {
            //     echo 'neuer';
            // } else {
            //     echo 'älter';
            // }

            // die;
            
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

    if(isset($request_type['users_by_id'])) {
        $s_p_ids = $request_type['users_by_id'];
        $a_p_ids = explode("-", $s_p_ids);

        foreach($a_p_ids as $val) {
            $data[] = $db->prep_exec('SELECT person.name, person.profilepic, person.job, person.p_id, person.beschreibung FROM `person` WHERE p_id = ?', [$val], 'one');
        }
    }

    $db->close_connect();

    // create JSON from $data variable
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
