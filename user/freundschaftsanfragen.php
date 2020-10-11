<?php require_once('../essentials/header.php'); ?>
<div class="row">
	<div class="col">
        <?php 
            $user = $web->get_own_user();
            // var_dump($user);
            $sql = "SELECT person.name, person.profilepic, person.p_id FROM person, friendship_request WHERE friendship_request.rec_p_id = ".$user['p_id']." AND person.p_id = friendship_request.send_p_id";
            $friendship_request_list = $db->get_this_all($sql);
        ?>
        <div class="friend-request-box">
            <?php
                if(!$friendship_request_list) {

                    echo '<span class="info">Derzeit hast du keine offenen Freundschaftsanfragen.</span>';

                } else {

                    foreach($friendship_request_list as $key => $val) {
                        $html_string = '<div class="friendBox whiteBox">';
                        $html_string .= '<a title="Auf das Profil von '.$val['name'].' wechseln" href="'.$web->root.'/user/user.php?id='.$val['p_id'].'">';
                        
                        if(strlen($val['profilepic']) == 0) {
                            
                            $html_string .= '<div class="acronymProfilePic" style="background-color: '.$web->random_hex_color().'">';
                            $html_string .= '<span class="acronym">'.$web->create_acronym($val['name']).'</span>';
                            $html_string .= '</div>';
                            
                        } else {
                            $html_string .= '<div class="profilePic">';
                            $html_string .= $web->get_upl_img($val['profilepic'], 'Profilbild von'.$val['name'], 'fluid');
                            $html_string .= '</div>';
                        }
                        
                        
                        $html_string .= '<span class="name">'.$val['name'].'</span>';
                        
                        $html_string .= '</a>';
                        
                        $html_string .= '<a href="'.$web->root.'/actions/confirm-friendship.php?i_am_user='.$user['p_id'].'&confirm_user='.$val['p_id'].'" class="friend-request-btn friend-request-confirm">Bestätigen</a>';
                        $html_string .= '<a href="'.$web->root.'/actions/confirm-friendship.php?decline-friendship&i_am_user='.$user['p_id'].'&confirm_user='.$val['p_id'].'" class="friend-request-btn friend-request-decline">Ablehnen</a>';
                        $html_string .= '</div>';
                        
                        echo $html_string;
                    }
                }
            ?>
        </div>
	</div>
</div>
<?php require_once('../essentials/footer.php'); ?>