<?php require_once('../essentials/header.php'); ?>

<div class="row">
    <div class="col">
        <?php 
            $user = $db->get_this_one('SELECT * FROM `person` WHERE p_id='.$_GET['id']);
            unset($user['password']);
            if($user) {
                var_dump($user);
            } else {
                echo 'User existiert nicht';
            }
        ?>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>