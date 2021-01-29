<?php require_once('../essentials/header.php'); ?>
<div class="row user-settings">
    <div class="col sm-4">
        <aside class="side-info bd-right">
            <h3 class="align-left">Nutzereinstellungen:</h3>
            <ul class="user-settings__menu">
                <li class="user-settings__menuitem" @click="changeActiveUserComp('account-tab');">Account</li>
            </ul>
        </aside>
    </div>
    <div class="col sm-8">
        <?php
            if(isset($_GET['error'])) {
                echo '<span class="error">'.$_GET['error'].'</span>';
            } else if(isset($_GET['bestaetigung'])) {
                echo '<span class="success">'.$_GET['bestaetigung'].'</span>';
            }
        ?>
        <component :is="activeUserSetting"></component>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>