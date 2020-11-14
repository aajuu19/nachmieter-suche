<?php require_once('functions.php'); ?>
<!DOCTYPE html>
<html lang="de">
<head>
    <?php 
        if($web->current_dir == 'objekte') {
            $web->build_cms_meta(); 
        } else {
            $web->build_meta(); 
        }
    ?>

	<link rel="stylesheet" href="<?php echo $web->root; ?>/dist/main.css">
	<link href="https://fonts.googleapis.com/css?family=Barlow:400,700,900&display=swap" rel="stylesheet">

</head>
<body class="<?php echo $web->build_body_class(); ?>">
    <div class="navi-ctn">
        <div class="row">
            <div class="col">
                <input type="checkbox" name="menuToggle" id="menuToggle">
                <div class="menuLabel">
                    <label for="menuToggle">
                        <span class="middle"></span>
                    </label>
                </div>
                <div class="head-ctn">
                    <a href="<?php echo $web->root; ?>/index.php"  class="branding" title="zur Nachmieter-Suche Startseite"><span class="highlight">nachmieter</span>-suche.de</a>
                    <div class="user-data">
                        <div class="navigation">
                            <?php $web->build_nav(); ?>

                            <?php if(isset($_SESSION['person'])) { ?>
                                <div class="user-panel">
                                    <span class="user-name">Hallo <?php echo $_SESSION['person']['name']; ?></span> 
                                    <ul class="user-list">
                                        <li>Mein Bereich <i class="fa fa-angle-down"></i>
                                            <ul class="sub-navi">
                                                <li><a href="<?php echo $web->root; ?>/user/user.php?id=<?php echo $_SESSION['person']['p_id']; ?>" title="<?php echo $meta['user.php']['title'] ?>">Mein Profil</a></li>
                                                <li><a href="<?php echo $web->root; ?>/user/neues-objekt.php" title="<?php echo $meta['neues-objekt.php']['title'] ?>">Neues Objekt einfügen</a></li>
                                                <li><a href="<?php echo $web->root; ?>/user/nachrichten-center.php" title="<?php echo $meta['nachrichten-center.php']['title'] ?>">Nachrichtencenter</a></li>
                                                <li><a class="friends" href="<?php echo $web->root; ?>/user/freundschaftsanfragen.php" title="<?php echo $meta['freundschaftsanfragen.php']['title'] ?>">Freundschaftsanfragen <?php 
                                                        $sql = "SELECT COUNT(*) FROM person, friendship_request WHERE friendship_request.rec_p_id = ".$_SESSION['person']['p_id']." AND person.p_id = friendship_request.send_p_id";
                                                        $friendship_request_amount = $db->get_this_one($sql);
                                                        $friendship_request_amount = $friendship_request_amount['COUNT(*)'];
                                                        if ($friendship_request_amount >= 1) {
                                                            echo '<span class="friend-request-amount">'.$friendship_request_amount.'</span>';
                                                        }
                                                    ?></a></li>
                                                <li><a href="<?php echo $web->root; ?>/user/settings.php" title="<?php echo $meta['settings.php']['title'] ?>">Einstellungen</a></li>
                                                <li><a href="<?php echo $web->root; ?>/logout.php" title="<?php echo $meta['logout.php']['title'] ?>">Abmelden</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            <?php } else {?>
                                <div class="reg-log">
                                    <a class="btn" href="<?php echo $web->root;?>/registrierung-login.php?registration" title="<?php echo $meta['registrierung-login.php']['title'];?>">Registrieren</a>
                                    <a class="btn secondary" href="<?php echo $web->root;?>/registrierung-login.php?login" title="<?php echo $meta['registrierung-login.php']['title'];?>">Login</a>
                                </div>
                            <?php } ?>

                        </div>
                    </div>
                </div>
            </div>   
        </div>
    </div>
    <header class="primaryOverlay">
        <div class="header-ctn">
            <?php 
                if(isset($meta[$web->file_name]['claim'])) {
                    echo '<h1 class="claim">'.$meta[$web->file_name]['claim'].'</h1>';  
                } else if($web->current_dir == 'objekte') {
                    $object = $db->get_this_one("SELECT * FROM `objekt` WHERE link='".$web->file_name."'");
                    echo '<h1 class="claim">'.$object['name'].'</h1>';
                } else {
                    echo 
                    <<<EOL
                        <span class="claim">Was guckst du so?</span>
                        <div class="header-ctn__tabs">
                        <button @click="changeSearchType('primary');" class="header-ctn__tabs__tab header-ctn__tabs__tab--primary" :class="{active : flatIsActive}">Wohnung</button>
                        <button @click="changeSearchType('secondary');" class="header-ctn__tabs__tab header-ctn__tabs__tab--secondary" :class="{active : mieterIsActive}">Mieter</button>
                        </div>
                        <form type="get" name="headerSearchForm" class="default search-form" :class="activeClass">
                            <input id="lf_address" name="lf_address" type="hidden" v-model="lfAddress">
                            <input v-model="lfAddress" @blur="eraseSuggestions" type="text" placeholder="Stadt oder Bezirk eingeben ...">
                            <button type="submit" class="btn" :class="activeClass"><i class="fa fa-search"></i></button>
                            <ul v-cloak class="address-list" v-show="showSuggestions"><address-list-item @handle-address-click="handleAddressClick" :key="index" v-for="(place, index) in recentPlaceList" :place="place"></address-list-item></ul>
                        </form> 
                    EOL;
                } 
            ?>
        </div>
    </header> 
    <main>