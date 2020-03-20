<?php
    class Database {
        protected $dsn = 'mysql:host=localhost;dbname=nachmieter_gesucht';
        protected $user = 'root';
        protected $pw = 'root';

        public function __construct() {
            try {
                $this->pdo = new PDO($this->dsn, $this->user, $this->pw);
                $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $error) {
                echo 'Database connection failed';
                die($error->getMessage());
            }
        }

        // $sql = SQL-Searchcommand which returns associative array
        public function get_this_all($sql) {
            $stmt = $this->pdo->query($sql);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // return first object of sql-command
        // $sql = sql-command
        public function get_this_one($sql) {
            $stmt = $this->pdo->query($sql);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        // prepare and execute
        // $prep = sql-command 
        // $exec = array
        // $fetch = Bool / if true, fetch exec

        public function prep_exec($prep, $exec, $fetch = false) {
            
            $stmt = $this->pdo->prepare($prep);
            $res = $stmt->execute($exec);

            if($fetch == 'one') {
                $fetched = $stmt->fetch(PDO::FETCH_ASSOC);
                return [$res, $fetched];
            } else if($fetch == 'all') {
                $fetched = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return [$res, $fetched];
            } else {
                return $res;
            } 
        }

        // close connection
        public function close_connect() {
            $this->pdo = null;
        }
    }

    $db = new Database();