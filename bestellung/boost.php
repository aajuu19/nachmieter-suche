<?php require_once('../essentials/header.php'); ?>
    <div class="row gap-bottom-3">
        <div class="col m-6">
            <p>Du möchtest dich von den anderen abheben und deine Sichtbarkeit boosten? Dann haben wir hier genau das richtige für dich. Mit unseren Produkten wirst du nicht nur besser gefunden, sondern du kommst auch schneller zu deiner Wunschwohnung!</p>
        </div>
        <div class="col m-6">
            <p>Profitiere von dem FULL-Paket, in welchem du jedes Angebot 3-fach genießen kannst! Dir bleibt dabei die volle Kostenkontrolle und das Abonnement ist monatlich kündbar! Klingt super? Ist es auch.</p>
        </div>
    </div>
            <div class="row products">
                <?php 
                    $products = [
                        'push' => [
                            'icon' => 'fa-arrow-alt-circle-up',
                            'price' => '3,99',
                            'description' => 'Bewege deine Anzeige nach oben in der Ergebnisliste',
                            'perks' => [
                                'Erhöhte Sichtbarkeit',
                                'Geringerer organisatorischer Aufwand',
                                'Günstig'
                            ],
                            'type' => 'Einmalig',
                            'highlight' => false,
                            'cols'  => 'm-3'
                        ],
                        'start' => [
                            'icon' => 'fa-fire',
                            'price' => '4,99',
                            'description' => 'Erscheine direkt auf der Startseite',
                            'perks' => [
                                'Laufzeit 7 Tage',
                                'Bis zu 10-fache Sichtbarkeit',
                                'Erhöhte Sichtbarkeit',
                                'Direkt beim Besuch der Seite zu sehen',
                                'Günstig'
                            ],
                            'type' => 'Einmalig',
                            'highlight' => false,
                            'cols'  => 'm-3'
                        ],
                        'highlight' => [
                            'icon' => 'fa-highlighter',
                            'price' => '5,99',
                            'description' => 'Hebe deine Anzeige farblich hervor und erscheine häufiger auf der Wohnung-finden Seite',
                            'perks' => [
                                'Laufzeit 7 Tage',
                                'Bis zu 20-fache Sichtbarkeit',
                                'Erhöhte Sichtbarkeit',
                                'Farbliche Hervorhebung',
                                'Günstig'
                            ],
                            'type' => 'Einmalig',
                            'highlight' => false,
                            'cols'  => 'm-3'
                        ],
                        'full' => [
                            'icon' => 'fa-dot-circle',
                            'price' => '9,99',
                            'description' => 'Werde VIP und genieße alle Vorteile 3-fach!',
                            'perks' => [
                                'Alle Produkte x3',
                                'Monatlich kündbar',
                                'Günstig'
                            ],
                            'type' => 'Monatlich',
                            'highlight' => true,
                            'cols'  => 'm-3'
                        ]
                    ];
                    $output = '';
                    foreach($products as $key => $val) {
                        $isHighlight = $val['highlight'] ? ' products__product-box--highlight' : ''; 
                        $output .= 
                        <<<EOL
                            <div class="col {$val['cols']}">
                                <div class="products__product-box {$isHighlight}">
                                    <i class="products__icon products__icon--big fa {$val['icon']}"></i>
                                    <span class="products__title">{$key}</span>
                                    <span class="products__price">{$val['price']} €</span>
                                    <span class="products__type">{$val['type']}</span>
                                    <span class="products__description">{$val['description']}</span>
                        EOL;
                                    foreach($val['perks'] as $k) {
                                        $output .= '<span class="products__perk">'.$k.'</span>';
                                    }
                        $output .= <<<EOL
                                    <span class="products__button btn">Bestellen</span>
                                </div>
                            </div>            
                        EOL;
                    }
                    echo $output;
                ?>
            </div>
<?php require_once('../essentials/footer.php'); ?>