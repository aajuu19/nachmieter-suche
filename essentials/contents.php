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
        'mieter-finden.php' => [
            'name' => 'Mieter finden',
            'title' => 'Dies ist der Titel der Zweite',
            'desc' => 'Dies ist die Beschreibung der Zweite',
            'claim' => 'Finde deinen neuen Nachmieter',
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
            'claim' => 'FAQ',
            'include_nav'=> true
        ],
        'user.php' => [
            'name' => 'User',
            'title' => 'Dies ist die User Seite',
            'desc' => 'Dies ist die Beschreibung der Seite User',
            'claim' => 'Profil',
            'include_nav'=> false
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
        'freundschaftsanfragen.php' => [
            'name' => 'Freundschaftsanfragen',
            'title' => 'Dies ist das Freundschaftsanfragen-Seite',
            'desc' => 'Dies ist die Beschreibung der Freundschaftsanfragenseite',
            'claim' => 'Freundschaftsanfragen',
            'include_nav'=> false,
            'login_required' => true
        ],
        'nachrichten-center.php' => [
            'name' => 'Nachrichtencenter',
            'title' => 'Dies ist das Nachrichtencenter',
            'desc' => 'Dies ist die Beschreibung des Nachrichtencenters',
            'claim' => 'Nachrichtencenter',
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
        'profil-bearbeiten.php' => [
            'name' => 'Profil bearbeiten',
            'title' => 'nachmieter-suche.de - Profil bearbeiten',
            'desc' => 'Dies ist die Beschreibung der Profil bearbeiten Seite',
            'claim' => 'Profil bearbeiten',
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