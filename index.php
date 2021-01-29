<?php require_once('essentials/header.php'); ?>
<div class="row space-bottom">
    <div class="col">
        <h1>Finden Sie Ihren passenden Nachmieter <span>in Berlin & Brandenburg</span></h1>
    </div>
    <div class="col s-6 m-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquesunt explicabo.</p>
    </div>
    <div class="col s-6 m-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquesunt explicabo.</p>
    </div>
    <div class="col m-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquesunt explicabo.</p>
    </div>
</div>

<div class="object-teaser primaryOverlay">
    <div class="row space-both">
        <div class="col">
            <span class="h1 light">Unsere Top-Wohnungen</span>
        </div>
        <?php 
            $top_objects = $db->get_this_all('SELECT * FROM `objekt` ORDER BY `einstellungsdatum` DESC LIMIT 6');

            foreach($top_objects as $key => $val) {

                $link = $web->format_link($val['name']).'-'.$val['o_id'].'.php';

                echo '<div class="col s-6 teaser">
                    <div class="teaser-box">
                        <div class="teaser-img">
                            <img class="lazyImg" src="//:0" data-src="'.$web->root.'/uploads/'.$val['image_1'].'" alt="Mietwohnung | Wohnung | Haus | Immobilie">
                        </div> 
                        <div class="teaser-content">
                            <span class="heading">'.$val['name'].'</span>
                            <span class="time">'.$web->format_date($val['einstellungsdatum']).' Uhr</span>
                            <span class="desc">'.$web->shorten_str($val['beschreibung'], 80).'</span>
                            <a title="'.$val['name'].'" href="'.$web->root.'/objekte/'.$val['link'].'" class="btn secondary">Mehr erfahren</a>
                        </div>
                    </div> 
                </div>';
            }
        ?>
    </div>
</div>

<div class="row space-top procedure">
    <div class="col">
        <span class="h1">Und so funktioniert's:</span>
        <div class="procedure-ctn">
            <div class="tab first">
                <span>Der Mieter ist auf der Suche nach dem neuen Nachmieter.</span>
            </div>
            <div class="tab second">
                <span>Der Mieter erstellt ein neues Objekt über seine derzeitige Wohnung.</span>
            </div>
            <div class="tab third">
                <span>Der Nachmieter und Wohnungsinteressent erstellt ein eigenes Nutzerprofil.</span>
            </div>
            <div class="tab fourth">
                <span>Der Nachmieter schickt dem Mieter eine Anfrage.</span>
            </div>
            <div class="tab fifth">
                <span>Der Mieter kann auf dem Nutzerprofil gucken, ob dieser für seine Wohnung in Frage kommt.</span>
            </div>
            <div class="tab sixth">
                <span>Match! Der Mieter und der Nachmieter haben sich gefunden und alles weitere kann abgewickelt werden.</span>
            </div>
        </div>
    </div>
</div>

<div class="row space-top">
    <div class="col">
        <h2>Dies ist die zweite Überschrift</h2>
    </div>
    <div class="col s-6 m-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquesunt explicabo.</p>
    </div>
    <div class="col s-6 m-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquesunt explicabo.</p>
    </div>
    <div class="col m-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquesunt explicabo.</p>
    </div>
</div>
<?php require_once('essentials/footer.php'); ?>