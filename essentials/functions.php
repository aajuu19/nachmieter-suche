<?php require_once('contents.php'); require_once('dbs.php');

    class Website {

        protected $debug = false;

        public function __construct($metaDatas, $db) {
            // GET META DATAS
            $this->meta = $metaDatas;

            $this->webname = 'nachmieter-suche.de';
            $this->current_dir = basename(dirname($_SERVER['PHP_SELF']));

            // GET SITE ROOT DIRECTORY
            $this->root = (!empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/nachmieter-suche';

            // GET CURRENT FULL LINK
            $this->full_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

            // GET FILE NAME DESPITE ON SUBDOMAIN
            $this->file_path = $_SERVER['PHP_SELF'];
            $this->file_name = pathinfo($this->file_path)['basename'];

            // LINK WITHOUT EXTENSION - COMMONLY USED AS BODYCLASS
            $this->body_class = basename($this->file_name, '.php');
            $this->db = $db;
        }

        public function build_body_class() {
            return $this->current_dir . ' ' . basename($this->file_name, '.php');
        }

        public function is_valid_email($email) {
            return filter_var($email, FILTER_VALIDATE_EMAIL) 
                && preg_match('/@.+\./', $email);
        }

        public function build_nav() {
            $nav = '<nav><ul class="navi">';

            forEach($this->meta as $key => $val) {
                if($val['include_nav']) {
                    $isActive = ($key == $this->file_name) ? 'active' : '';
                    $nav .= '<li class="navItem '.$isActive.'"><a href="'.$this->root.'/'.$key.'" title="'.$val['title'].'">'.$val['name'].'</a></li>';
                }
            }

            $nav .= '</ul></nav>';

            echo $nav;
        }

        public function build_cms_meta() {
            $object = $this->db->get_this_one("SELECT * FROM `objekt` WHERE link='".$this->file_name."'");
            $title = $object['name'].' - '.$this->webname;
            $desc = $object['beschreibung'];

            echo '<meta charset="utf-8">';
            echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
            echo '<meta name="theme-color" content="#344b58">';
            echo '<link rel="shortcut icon" type="image/x-icon" href="'.$this->root.'/favicon.ico">';
            echo '<title>'.$title.'</title>';
            echo '<meta name="description" content="'.$desc.'">';
        }

        public function build_meta() {
            $title = $this->meta[$this->file_name]['title'];
            $desc = $this->meta[$this->file_name]['desc'];

            echo '<meta charset="utf-8">';
            echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
            echo '<meta name="theme-color" content="#344b58">';
            echo '<link rel="shortcut icon" type="image/x-icon" href="'.$this->root.'/favicon.ico">';
            echo '<title>'.$title.'</title>';
            echo '<meta name="description" content="'.$desc.'">';
        }

        public function format_link($str) {
            $tempstr = ["Ä" => "ae", "Ö" => "oe", "Ü" => "ue", "ä" => "ae", "ö" => "oe", "ü" => "ue", ' ' => '-']; 
            return strtolower(trim(strtr($str, $tempstr)));
        }

        public function format_date($date) {
            $time = DateTime::createFromFormat ("Y-m-d H:i:s", $date);
            return $time->format('d.m.y - H:i');
        }

        public function shorten_str($str, $len) {
            return (strlen($str) >= $len) ? substr($str, 0, $len). " ... " :  $str;
        }

        private function random_color_part() {
            return str_pad( dechex( mt_rand( 0, 160 ) ), 2, '0', STR_PAD_LEFT);
        }

        public function random_hex_color() {
            return '#'.$this->random_color_part() . $this->random_color_part() . $this->random_color_part();
        }

        public function create_acronym($word) {
            $words = explode(" ", $word);
            $acronym = $words[0][0];

            if (count($words) > 1) {
                $acronym .= $words[1][0];
            }

            return $acronym;
        }

        public function get_own_user() {
            if (isset($_SESSION['person'])) {
                unset($_SESSION['person']['password']); 
                return $_SESSION['person'];
            
            } else {
                return false;
            }
        }
        
        public function get_from_url($url):string {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_URL, $url);
            $result = curl_exec($ch);
            curl_close($ch);

            $obj = json_decode($result);
            return $obj;
        }

        public function get_upl_img($src, $alt, $class = "fluid") {
            return '<img src="//:0" data-src="'.$this->root.'/uploads/'.$src.'" alt="'.$alt.'" class="lazyImg '.$class.'">';
        }

        // Prevent XSS (cross-site-scripting)
        public function htmlchar($userInput):string {
            return htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
        }
    }

    $web = new Website($meta, $db);

    session_start();
    
    if(isset($meta[$web->file_name]['login_required'])) {
        if($meta[$web->file_name]['login_required']) {
            require_once('secure_page.php');
        }
    }