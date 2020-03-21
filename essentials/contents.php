<?php

    $config = [];
    $config['mail'] = 'info@aaron-jung.com';
    $config['phone'] = '0162 / 634 81 75';

    $meta = [
        'index.php' => [
            'name' => 'Start',
            'title' => 'Dies ist der Titel der Startseite',
            'desc' => 'Dies ist die Beschreibung der Startseite',
            'include_nav'=> true
        ],
        'nachmieter-finden.php' => [
            'name' => 'Nachmieter finden',
            'title' => 'Dies ist der Titel der Zweite',
            'desc' => 'Dies ist die Beschreibung der Zweite',
            'include_nav'=> true
        ],
        'wohnung-finden.php' => [
            'name' => 'Wohnung finden',
            'title' => 'Dies ist die Wohnung finden Seite',
            'desc' => 'Dies ist die Beschreibung der Zweite',
            'claim' => 'Finde deine neue Wohnung',
            'include_nav'=> true
        ],
        'faq.php' => [
            'name' => 'FAQ',
            'title' => 'Dies ist die FAQ Seite',
            'desc' => 'Dies ist die Beschreibung der Zweite',
            'include_nav'=> true
        ],
        'registrierung-login.php' => [
            'name' => 'Registrierung - Login',
            'title' => 'Dies ist die Registrierungsseite',
            'desc' => 'Dies ist die Beschreibung der Registrierungsseite',
            'claim' => 'Werde ein Teil von uns',
            'include_nav'=> false
        ],
        'dashboard.php' => [
            'name' => 'Dashboard',
            'title' => 'Dies ist das Dashboard',
            'desc' => 'Dies ist die Beschreibung des Dashboards',
            'claim' => 'Dashboard',
            'include_nav'=> false,
            'login_required' => true
        ],
        'neues-objekt.php' => [
            'name' => 'Neues Objekt',
            'title' => 'Dies ist die Maske für das Einfügen eines neuen Objektes',
            'desc' => 'Dies ist die Beschreibung für die Maske für das Einfügen eines neuen Objektes',
            'claim' => 'Neue Wohnung einfügen',
            'include_nav'=> false,
            'login_required' => true
        ],
        'settings.php' => [
            'name' => 'Einstellungen',
            'title' => 'Dies sind die Einstellungen',
            'desc' => 'Dies ist die Beschreibung der Einstellungen',
            'include_nav'=> false,
            'login_required' => true            
        ],
        'logout.php' => [
            'name' => 'Logout',
            'title' => 'Dies ist der Abmeldebereich',
            'desc' => 'Dies ist die Beschreibung des Abmeldebereiches',
            'include_nav'=> false,
            'login_required' => true
        ]
    ];