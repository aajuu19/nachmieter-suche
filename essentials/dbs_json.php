<?php require_once('dbs.php');
    // $data content depends on $_POST / $_GET
    $data = [];

    // $_GET / $_POST consists of 
    // operation => which should be shown?
    // limit => how much should be shown?
    // page => which page am I?

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

    if(isset($_GET)) {
        foreach($_GET as $key => $val) {
            switch($key) {
                case 'quadratmeter':
                case 'zimmer':
                case 'kalt':
                case 'etage':
                    $sql_stmt .= $key.sm_or_gr($val);
                    break;
                // limit always on the end
                case 'limit':
                    if(isset($_GET['page'])) {
                        $sql_stmt .= 'ORDER BY einstellungsdatum DESC LIMIT '.($_GET['page'] * $_GET['limit'] - $_GET['limit']).','.$_GET['limit'];
                    } else {
                        // ?page-parameter has to be set
                        die('Seitenanzahl muss angegeben werden.');
                    }
                    break;     
            }
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


    // $_POST WHEN PRODUCTION
    // switch ($_GET) {
    //     case [
    //         'operation' => 'all-objects',
    //     ]:
    //         $data = $db->get_this_all("SELECT * FROM `objekt`");
    //         break;
    //     case [
    //         'operation' => 'all-objects',
    //         'limit' => $_GET['limit'],
    //         'page'  => $_GET['page']
    //     ]:
    //         $data = $db->get_this_all("SELECT * FROM `objekt` LIMIT ".($_GET['page'] * $_GET['limit'] - $_GET['limit']).','.$_GET['limit']);
    //         break;
    //     case [
    //         'operation' => 'last-object',
    //     ]:
    //         $data = $db->get_this_one("SELECT * FROM `objekt`");
    //         break;
    // }
    
    // create JSON from $data variable
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
