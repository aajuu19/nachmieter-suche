<?php require_once('config_data.php');
    $dsn = "mysql:host=localhost;dbname=".$config['dbName'];
    $user = $config['dbUser'];
    $pw = $config['dbPw'];

    class Database {

        public function __construct($dsn, $user, $pw) {
            try {
                $this->pdo = new PDO($dsn, $user, $pw);
                $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $error) {
                echo 'Database connection failed';
                die($error->getMessage());
            }
        }

        // $sql = SQL-Searchcommand which returns associative array
        public function get_this_all($sql, $pdo_fetch = PDO::FETCH_ASSOC) {
            $stmt = $this->pdo->query($sql);
            return $stmt->fetchAll($pdo_fetch);
        }

        // return first object of sql-command
        // $sql = sql-command
        public function get_this_one($sql, $pdo_fetch = PDO::FETCH_ASSOC) {
            $stmt = $this->pdo->query($sql);
            return $stmt->fetch($pdo_fetch);
        }

        // prepare and execute
        // $prep = sql-command 
        // $exec = array
        // $fetch = Bool / if true, fetch exec

        public function prep_exec($prep, $exec, $fetch = false, $fetch_mode = PDO::FETCH_ASSOC) {
            
            $stmt = $this->pdo->prepare($prep);
            $res = $stmt->execute($exec);

            if($fetch == 'one') {
                $fetched = $stmt->fetch($fetch_mode);
                return $fetched;
            } else if($fetch == 'all') {
                $fetched = $stmt->fetchAll($fetch_mode);
                return $fetched;
            } else {
                return $res;
            } 
        }

        public function get_user($user_id, $include_pw = false) {
            if ($user_id !== "") {
                $user = $this->get_this_one('SELECT * FROM `person` WHERE p_id='.$user_id);
                if(!$include_pw) {
                    unset($user['password']);
                }
                return $user;
            } else {
                return false;
            }
        }

        public function get_flat($o_id) {
            $flat = $this->prep_exec(
                'SELECT * FROM objekt WHERE o_id = ?',
                [
                    $o_id,
                ],
                'one'
            );

            return $flat;
        } 

        // close connection
        public function close_connect() {
            $this->pdo = null;
        }
    }

    $db = new Database($dsn, $user, $pw);