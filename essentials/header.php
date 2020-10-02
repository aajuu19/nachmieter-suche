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
                                                <li><a href="<?php echo $web->root; ?>/user/freundschaftsanfragen.php" title="<?php echo $meta['freundschaftsanfragen.php']['title'] ?>">Freundschaftsanfragen</a></li>
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
                    echo '<span class="claim">Willst du den passenden Nachmieter finden?</span>
                    <form class="default search-form" action="wohnung-finden.php">
                        <input type="text" placeholder="Geben Sie Ihren Standort an">
                        <input type="submit" value="Suche starten" class="btn secondary">
                    </form>';
                } 
            ?>
        </div>
    </header> 
    <main>