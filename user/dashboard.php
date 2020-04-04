<?php require_once('../essentials/header.php'); ?>

<div class="row user-area">
    <aside class="col s-4 user-menu">
        <a href="<?php echo $web->root;?>/user/neues-objekt.php" title="<?php echo $meta['dashboard.php']['title']; ?>" class="new-object big-tab">
            <span class="heading"><i class="fa fa-home"></i> Neue Wohnung einfügen</span>
            <span class="desc">Hier kannst du ganz einfach ein neues Mietobjekt anlegen.</span>
        </a>
        <div class="new-object big-tab secondary-tab">
            <span class="heading"><i class="fa fa-cogs"></i> Profil bearbeiten</span>
            <span class="desc">Fülle ganz zwanglos ein paar Informationen über dich aus.</span>
        </div>
        <ul class="styled-list">
            <li>Einstellungen</li>
            <li>Account</li>
            <li>Objekte</li>
        </ul>
    </aside>
    <div class="col s-8">
        <h1 class="align-left"><i class="fa fa-address-card"></i> <?php echo $user['name']; ?> <span><?php echo $user['job']; ?></span></h1>
            <p class="desc"><?php echo $user['beschreibung'] ?></p>
            <span class="heading primary object-heading">Deine Objekte</span>
            <div class="user-object-list">            
                <?php 
                    $user_objects = $db->get_this_all('SELECT * FROM `objekt` WHERE p_id = '.$user['p_id'].' ORDER BY `einstellungsdatum` DESC');
                    if(!empty($user_objects)) {
                        foreach($user_objects as $k => $v) {
                            $shorten_desc = $web->shorten_str($v['beschreibung'], 70);
                            $object = 
                            '<div class="user-object">
                                <span class="id">ID: '.$v['o_id'].'</span>
                                <span class="name">'.$v['name'].'</span>
                                <span class="beschreibung">'.$shorten_desc.'</span>
                                <a class="object-link" href="'.$web->root.'/objekte/'.$v['link'].'"><i class="fa fa-eye"></i></a>
                            </div>';
                            echo $object;
                        } 
                    } else {
                        echo '<p class="empty">Derzeit hast du keine Mietobjekte eingestellt. Willst du ändern? <a href="LINKEINFÜGE">HIERLINKEINFÜGEN</a> kannst du neue Objekte einstellen.</p>';
                    } 
                ?>  
        </div>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>