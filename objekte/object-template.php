<?php 
    $obj = $db->get_this_one("SELECT * FROM `objekt` WHERE link='".$web->file_name."'");
    $this_is_user = $web->get_own_user();
    $user = $db->get_user($obj['p_id']);
?>
<div class="object-container">
    <div class="row center">
        <div class="col s-10 sm-6 obj-slider-app">
            <div class="obj-slider-main-img">
                <img :src="mainImgSrc ||'<?php echo $web->root; ?>/uploads/<?php echo $obj['image_1']; ?>'" alt="<?php $obj['name'] ?>" class="cover main-img">
            </div>
            <div class="obj-slider-thumblist">
                <div class="obj-overflow-ctn">
                    <div class="obj-inner-ctn" :style="{ left: sliderPosition + 'px' }">
                        <?php
                        for($i = 1; $i<=7;$i++) {
                            if($obj['image_'.$i]) {
                                $output = '<div title="Klicken um Bild vergößert anzuzeigen" ref="objectThumb'.$i.'" class="obj-slider-thumb" @click="changeMainImg($event)">';
                                $output .= $web->get_upl_img($obj['image_'.$i], $obj['name'], 'cover thumb-img');
                                $output .= '</div>';
                                
                                echo $output;
                            }
                        }
                        ?>
                    </div>
                </div>
                <div class="obj-slider-arrows">
                    <i @click="swipeLeft" v-show="showLeftArrow" class="fa fa-angle-left obj-slider-arrow obj-slider-left-arrow"></i>
                    <i @click="swipeRight" v-show="showRightArrow" class="fa fa-angle-right obj-slider-arrow obj-slider-right-arrow"></i>
                </div>
            </div>
        </div>
        <div class="col sm-6 ">
            <h2 class="align-left noMarg">
                <?php echo $obj['name'];?>
            </h2>
            <span class="address"><?php echo $obj['adresse']; ?></span>
            <p class="desc">
                <?php echo $obj['beschreibung'];?> 
            </p>
            <div class="user-infos whiteBox">
                <span class="heading primary">Kontaktinformationen</span>
                <span><strong><?php echo $user['name']; ?></strong></span>
                <span><a class="email" href="mailto:<?php echo $user['email']; ?>" title="Kontaktiere <?php echo $user['name']; ?>"><?php echo $user['email']; ?></a></span>
                <span class="desc">
                    <?php echo $web->shorten_str($user['beschreibung'], 180); ?>
                </span>
                <div class="buttons">
                    <a href="<?php echo $web->root; ?>/user/user.php?id=<?php echo $user['p_id']; ?>" class="btn"><i class="fa fa-user"></i> Nutzerprofil ansehen</a>      
                    <?php if(isset($this_is_user) && $user['p_id'] != $this_is_user['p_id']) { ?>
                        <a href="<?php echo $web->root; ?>/user/nachrichten-center.php?flat_by_id=<?php echo $obj['o_id']; ?>&user_by_id=<?php echo $user['p_id']; ?>" class="btn secondary"><i class="fa fa-comments"></i> Nachricht senden</a>      
                    <?php } else { ?>
                        <a href="<?php echo $web->root; ?>/user/nachrichten-center.php" class="btn secondary disabled"><i class="fa fa-comments"></i> Nachricht senden</a>      
                    <?php } ?>
                </div>
            </div>
        </div>
    </div>
    <div class="object-details">
        <!-- <div class="row">
            <div class="col">
                <div class="important-ctn">
                    <h3>Die wichtigsten Fakten auf einen Blick</h3>
                    <div class="row">
                    <div class="col m-4">
                <div class="important-block">
                    <i class="important-icon fa fa-cube"></i>
                    <span><strong><?php echo $obj['quadratmeter']; ?></strong> m²</span>
                </div>
                <div class="important-block">
                    <i class="important-icon fa fa-bed"></i>
                    <span><strong><?php echo $obj['zimmer']; ?></strong> Zimmer</span>
                </div>
            </div>
            <div class="col m-4">
                <div class="important-block">
                    <i class="important-icon fa fa-euro-sign"></i>
                    <span><strong><?php echo $obj['kalt']; ?>€</strong> Kaltmiete</span>
                </div>
                <div class="important-block">
                    <i class="important-icon fa fa-layer-group"></i>
                    <span><strong><?php echo $obj['etage']; ?>.</strong> Etage</span>
                </div>
            </div>
            <div class="col m-4">
                <div class="important-block">
                    <i class="important-icon fa fa-home"></i>
                    <span><strong><?php echo $obj['typ']; ?></strong></span>
                </div>
                <div class="important-block">
                    <i class="important-icon fa fa-restroom"></i>
                    <span><strong><?php echo $obj['bad']; ?></strong> Badezimmer</span>
                </div>
            </div>
                    </div>
                </div>
            </div>
        </div> -->

        <div class="row more-info">
            <div class="col">
                <h3>Die wichtigsten Fakten auf einen Blick</h3>
            </div>
                <?php 
                    $data_array = [
                        'Quadratmeter' => [
                            'value' => $obj['quadratmeter'],
                            'icon' => 'cube'
                        ],
                        'Zimmer' => [
                            'value' => $obj['zimmer'],
                            'icon' => 'bed'
                        ],
                        'Kaltmiete' => [
                            'value' => $obj['kalt'],
                            'icon' => 'euro-sign'
                        ],
                        'Warmmiete' => [
                            'value' => $obj['warm'],
                            'icon' => 'euro-sign'
                        ],
                        'Wohnungstyp' => [
                            'value' => $obj['typ'],
                            'icon' => 'home'
                        ],
                        'Etage' => [
                            'value' => $obj['etage'],
                            'icon' => 'layer-group'
                        ],
                        'Badezimmer' => [
                            'value' => $obj['bad'],
                            'icon' => 'restroom'
                        ],
                        'Einzugsdatum ab' => [
                            'value' => $obj['einzug'],
                            'icon' => 'calendar-alt'
                        ]
                    ];

                    foreach($data_array as $key => $val) {
                        if($val['value'] != NULL) {
                            $res = ($key === 'Warmmiete') ? 'secondary' : '';
                            echo '
                                <div class="col s-6 sm-4 l-3">
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
        </div>
    </div>
</div>