<?php 
    $obj = $db->get_this_one("SELECT * FROM `objekt` WHERE link='".$web->file_name."'");
    $user = $db->get_this_one("SELECT * FROM `person` WHERE p_id=".$obj['p_id']);
    unset($user['password']);
?>
<div class="object-container">
    <div class="row">
        <div class="col sm-6">
            <?php $web->get_upl_img($obj['image_1'], $obj['name'], 'cover main-img'); ?>
        </div>
        <div class="col sm-6">
            <h2 class="align-left noMarg">
                <?php echo $obj['name'];?>
            </h2>
            <span class="address"><?php echo $obj['adresse']; ?></span>
            <p class="desc">
                <?php echo $obj['beschreibung'];?> 
            </p>
            <div class="user-infos">
                <span class="heading primary">Kontaktinformationen</span>
                <span><strong><?php echo $user['name']; ?></strong></span>
                <span><a class="email" href="mailto:<?php echo $user['email']; ?>" title="Kontaktiere <?php echo $user['name']; ?>"><?php echo $user['email']; ?></a></span>
                <span class="desc">
                    <?php echo $web->shorten_str($user['beschreibung'], 180); ?>
                </span>
                <div class="buttons">
                    <a href="<?php echo $web->root; ?>/user/user.php?id=<?php echo $user['p_id']; ?>" class="btn"><i class="fa fa-user"></i> Nutzerprofil ansehen</a>      
                    <a href="" class="btn secondary"><i class="fa fa-comments"></i> Nachricht senden</a>      
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
                        $obj['quadratmeter'] => [
                            'name' => 'Quadratmeter',
                            'icon' => 'cube'
                        ],
                        $obj['zimmer'] => [
                            'name' => 'Zimmer',
                            'icon' => 'bed'
                        ],
                        $obj['kalt'] => [
                            'name' => 'Kaltmiete',
                            'icon' => 'euro-sign'
                        ],
                        $obj['warm'] => [
                            'name' => 'Warmmiete',
                            'icon' => 'euro-sign'
                        ],
                        $obj['typ'] => [
                            'name' => 'Wohnungstyp',
                            'icon' => 'home'
                        ],
                        $obj['etage'] => [
                            'name' => 'Etage',
                            'icon' => 'layer-group'
                        ],
                        $obj['bad'] => [
                            'name' => 'Badezimmer',
                            'icon' => 'restroom'
                        ],
                        $obj['einzug'] => [
                            'name' => 'Einzugsdatum ab',
                            'icon' => 'calendar-alt'
                        ]
                    ];

                    $count = 1;
                    foreach($data_array as $key => $val) {
                        if($key != NULL) {
                            echo '
                                <div class="col s-6 sm-4 l-3">
                                    <div class="data-box">
                                        <i class="fa fa-'.$val['icon'].'"></i>
                                        <div class="data-info">
                                            <span class="data-name">'.$val['name'].'</span>
                                            <span class="data-value">'.$key.'</span>
                                        </div>
                                    </div>            
                                </div>            
                            ';
                            $count++;
                        }
                    }
                    ?>
            </div>
        </div>
    </div>
</div>