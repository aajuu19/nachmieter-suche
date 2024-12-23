<?php require_once('../essentials/header.php');
    $user = $db->get_user($_GET['id']);
    $own_user = $web->get_own_user();

    if($own_user) {
        $is_own_user = $own_user['p_id'] == $user['p_id'];
        $is_logged_in = true;
    } else {
        $is_own_user = false;
        $is_logged_in = false;
    }
?>
<div class="row user-datas">
    
    <?php if($user) { ?>
        <div class="col sm-4">
            <aside class="whiteBox morePad">
                <span class="headline">Profil</span>
                <div class="name-image">
                    <?php if (strlen($user['profilepic']) <= 1) { ?>
                        <div class="profilePic" style="background-color: <?php echo $web->random_hex_color(); ?>">
                            <span class="acronym"><?php echo $web->create_acronym($user['name']) ?></span>
                        </div>
                    <?php } else { ?>
                            <div class="profilepic-img-ctn">
                                <?php echo $web->get_upl_img($user['profilepic'], $user['name'], 'profile-pic-img'); ?>
                            </div>
                    <?php }?>
                    <span class="name"><?php echo $user['name']; ?></span>
                    <?php if ($user['job']) { ?>
                        <span class="job"><?php echo $user['job']; ?></span>
                    <?php } ?>
                </div>

                <?php if ($user['gender']) { ?>
                    <div class="smDataBox">
                        <span class="greyTitle">Geschlecht</span>
                        <span class="userDef"><?php echo $user['gender']; ?></span>
                    </div>
                <?php } ?>

                <?php if ($user['birthdate']) { ?>
                    <div class="smDataBox">
                        <?php
                            //date in mm/dd/yyyy format; or it can be in other formats as well
                            $birthDate = $user['birthdate'];
                            //explode the date to get month, day and year
                            $birthDate = explode("-", $birthDate);
                            //get age from date or birthdate
                            $age = (date("md", date("U", mktime(0, 0, 0, $birthDate[0], $birthDate[1], $birthDate[2]))) > date("md")
                                ? ((date("Y") - $birthDate[0]) - 1)
                                : (date("Y") - $birthDate[0]));
                        ?>
                        <span class="greyTitle">Alter</span>
                        <span class="userDef"><?php echo $age; ?></span>
                    </div>
                <?php } ?>

                <?php if ($user['lookingfrom']) { ?>
                    <div class="smDataBox">
                        <span class="greyTitle">Ich suche ab</span>
                        <span class="userDef">
                            <?php 
                            $current_date_time = time();
                            $date_time_user = strtotime($user['lookingfrom']);
                            $new_date = date('d.m.Y', $date_time_user);
                            if($current_date_time > $date_time_user) {
                                echo 'sofort';
                            } else {
                                echo $new_date;    
                            }
                            ?>
                        </span>
                    </div>
                <?php } ?>

                <?php if ($is_own_user) { ?>
                    <div class="hr"></div>
                    <a href="<?php echo $web->root;?>/user/neues-objekt.php" title="<?php echo $meta['dashboard.php']['title']; ?>" class="new-object big-tab">
                        <span class="heading"><i class="fa fa-home"></i> Neue Wohnung einfügen</span>
                    </a>
                    <a href="<?php echo $web->root;?>/user/profil-bearbeiten.php" class="new-object big-tab secondary-tab">
                        <span class="heading"><i class="fa fa-cogs"></i> Profil bearbeiten</span>
                    </a>
                <?php } else if ($is_logged_in) { ?>
                    <div class="hr"></div>
                    <?php 
                        $sql = "SELECT * FROM friendships WHERE (p1_id = ? AND p2_id = ?) OR (p1_id = ? AND p2_id = ?)";
                        $is_befriended = $db->prep_exec($sql, [
                            $own_user['p_id'],
                            $user['p_id'],
                            $user['p_id'],
                            $own_user['p_id'],
                        ], true);

                        $sql = "SELECT person.name, person.p_id FROM person, friendship_request WHERE friendship_request.send_p_id = ? AND friendship_request.rec_p_id = ?";
                        $request_already_sent_rec = $db->prep_exec($sql, [
                            $user['p_id'],
                            $own_user['p_id']
                        ], true);

                        $sql = "SELECT person.name, person.p_id FROM person, friendship_request WHERE friendship_request.send_p_id = ? AND friendship_request.rec_p_id = ?";
                        $request_already_sent_sender = $db->prep_exec($sql, [
                            $own_user['p_id'],
                            $user['p_id']
                        ], true);
                        
                        if(!$is_befriended && !$request_already_sent_rec && !$request_already_sent_sender){
                    ?>  
                        <form action="<?php echo $web->root ?>/actions/add-as-friend.php" method="POST">
                            <?php if ($web->get_csrf_token()) { echo '<input type="hidden" id="csrf-token" name="csrf-token" value="'.$web->get_csrf_token().'">'; } ?>
                            <input type="hidden" name="i_am_user" id="i_am_user" value="<?php echo $own_user['p_id']; ?>">
                            <input type="hidden" name="send_to_user" id="send_to_user" value="<?php echo $user['p_id']; ?>">
                            <button type="submit" title="<?php echo $meta['dashboard.php']['title']; ?>" class="new-object big-tab add-as-friend">
                                <span class="heading"><i class="fa fa-user-friends"></i> Als Freund anfragen</span>
                            </button>
                        </form>
                    <?php 
                        } else if ($request_already_sent_rec) {
                    ?>  
                        <form action="<?php echo $web->root ?>/actions/confirm-friendship.php" method="POST">
                            <?php if ($web->get_csrf_token()) { echo '<input type="hidden" id="csrf-token" name="csrf-token" value="'.$web->get_csrf_token().'">'; } ?>
                            <input type="hidden" name="i_am_user" id="i_am_user" value="<?php echo $own_user['p_id']; ?>">
                            <input type="hidden" name="confirm_user" id="confirm_user" value="<?php echo $user['p_id']; ?>">
                            <button class="new-object big-tab add-as-friend">
                                <span class="heading"><i class="fa fa-user-friends"></i> Freunschaftsanfrage bestätigen</span>
                            </button>
                        </form>
                    <?php                            
                        } else if ($request_already_sent_sender) {
                    ?>
                        <span class="big-tab friendship-already-sent">
                            <span class="heading">Freundschaftsanfrage bereits versendet</span>
                        </span>
                    <?php
                        }
                    ?>
                    <a href="<?php echo $web->root; ?>/user/nachrichten-center.php?user_by_id=<?php echo $user['p_id']; ?>" class="new-object big-tab secondary-tab">
                        <span class="heading"><i class="fa fa-comment"></i> Nachricht senden</span>
                    </a>
                <?php } ?>
            </aside>
        </div>
        <div class="col sm-8 ">
            <?php
                if(isset($_GET['error'])) {
                    echo '<span class="error">'.$_GET['error'].'</span>';
                } else if(isset($_GET['bestaetigung'])) {
                    echo '<span class="success">'.$_GET['bestaetigung'].'</span>';
                }
            ?>
            <div class="row">
                <?php if ($user['lookingfor']) { ?>
                    <div class="col sm-4">
                        <div class="whiteBox userDataBox morePad">
                            <span class="dataTitle">Ich suche nach</span>
                            <span class="dataValue"><?php echo $user['lookingfor']; ?></span>
                        </div>
                    </div>
                <?php } ?>
                <?php if ($user['lf_adresse']) { ?>
                    <div class="col sm-8">
                        <div class="whiteBox userDataBox morePad">
                            <span class="dataTitle">Ich suche hier</span>
                            <span class="dataValue"><?php echo $user['lf_adresse']; ?></span>
                        </div>
                    </div>
                <?php } ?>
            </div>
            <div class="userInfoArea">
                <?php if($user['beschreibung']) { ?>
                    <div class="whiteBox morePad">
                        <div class="infoBox">
                            <span class="greyTitle">Über mich</span>
                            <p><?php echo $user['beschreibung']; ?></p>
                        </div>
                    </div>
                <?php } ?>

                <?php 
                    $user_objects = $db->get_this_all('SELECT * FROM `objekt` WHERE p_id = '.$user['p_id'].' ORDER BY `einstellungsdatum` DESC');
                    if($user_objects) {
                ?> 
                <div class="whiteBox morePad">
                    <div class="infoBox">
                        <span class="greyTitle">Eingestellte Mietobjekte</span>
                        <div class="user-object-list">
                            <?php 
                                if(!empty($user_objects)) {
                                    foreach($user_objects as $k => $v) {
                                        $shorten_desc = $web->shorten_str($v['beschreibung'], 70);
                                        $object = 
                                        '<div class="user-object">
                                            <span class="id">'.($k + 1).'.</span>
                                            <span class="name">'.$v['name'].'</span>
                                            <span class="beschreibung">'.$shorten_desc.'</span>
                                            <a class="object-link" href="'.$web->root.'/objekte/'.$v['link'].'"><i class="fa fa-eye"></i></a>
                                        </div>';
                                        echo $object;
                                    } 
                                } else {
                                    echo '<p class="empty">Derzeit hast du keine Mietobjekte eingestellt. Wenn du ein neues Objekt einfügen möchtest, kannst du <a href="'.$web->root.'/user/neues-objekt.php" title="'.$meta['dashboard.php']['title'].'">hier</a> neue Objekte einstellen.</p>';
                                } 
                            ?>  
                        </div>
                    </div>
                </div>
                <?php }?>

                <div class="row">
                    <?php 
                        $data_array = [
                            'Quadratmeter' => [
                                'value' => $user['lf_quadratmeter'],
                                'icon' => 'cube'
                            ],
                            'Zimmer' => [
                                'value' => $user['lf_zimmer'],
                                'icon' => 'bed'
                            ],
                            'Kaltmiete' => [
                                'value' => $user['lf_kaltmiete'],
                                'icon' => 'euro-sign'
                            ],
                            'Warmmiete' => [
                                'value' => $user['lf_warmmiete'],
                                'icon' => 'euro-sign'
                            ],
                        ];

                        if ($user['lf_quadratmeter'] || $user['lf_zimmer'] || $user['lf_kaltmiete'] || $user['lf_warmmiete']) {
                            echo '<span class="col headline">Auf der Suche nach</span>';
                        }

                        foreach($data_array as $key => $val) {
                            if($val['value'] != NULL) {
                                $res = ($key === 'Warmmiete') ? 'secondary' : '';
                                echo '
                                    <div class="col s-6 xl-4">
                                        <div class="data-box '.$res.'">
                                            <i class="fa fa-'.$val['icon'].'"></i>
                                            <div class="data-info">
                                                <span class="data-name">'.$key.'</span>
                                                <span class="data-value">'.$val['value'].'</span>
                                            </div>
                                        </div>            
                                    </div>            
                                ';
                            }
                        }
                    ?>
                </div>
                
                <div class="whiteBox morePad">
                    <div class="infoBox">
                        <span class="greyTitle">Freunde</span>
                    </div>
                    <div class="friendArea">
                        <?php 
                            $sql = 'SELECT person.name, person.profilepic, person.p_id,friendships.p1_id, friendships.p2_id FROM person INNER JOIN friendships ON person.p_id = friendships.p1_id OR person.p_id = friendships.p2_id WHERE p_id != '.$user['p_id'].' AND (friendships.p1_id = '.$user['p_id'].' OR friendships.p2_id = '.$user['p_id'].')';
                            $friend_array = $db->get_this_all($sql);

                            if ($friend_array) {
                                foreach($friend_array as $key => $val) {
                                    $html_string = '<a class="friendBox" title="Auf das Profil von '.$val['name'].' wechseln" href="'.$web->root.'/user/user.php?id='.$val['p_id'].'">';
                                    
                                    if(strlen($val['profilepic']) == 0) {
                                        
                                        $html_string .= '<div class="acronymProfilePic" style="background-color: '.$web->random_hex_color().'">';
                                        $html_string .= '<span class="acronym">'.$web->create_acronym($val['name']).'</span>';
                                        $html_string .= '</div>';
                                        
                                    } else {
                                        $html_string .= '<div class="profilePic">';
                                                $html_string .= $web->get_upl_img($val['profilepic'], $val['name'], 'profile-pic-img');
                                        $html_string .= '</div>';
                                    }
                                    
                                    $html_string .= '<span class="name">'.$val['name'].'</span>';
                                    
                                    $html_string .= '</a>';
                                    
                                    echo $html_string;
                                }
                            } else {
                                echo '<span class="info">Der User hat bisher noch keine Freunde. </span>';
                            }
                        ?>
                    </div>
                </div>

            </div>
        </div>
        <?php } else { ?>
            <div class="col">
                <p>Ups, diesen User gibt es wohl nicht.</p>
                <a href="<?php echo $web->root; ?>" title="Zur Startseite wechseln">Zurück zur Startseite</a>
            </div>
        <?php } ?>
</div>

<?php require_once('../essentials/footer.php'); ?>