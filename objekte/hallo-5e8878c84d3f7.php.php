<?php require_once('../essentials/header.php'); ?>

	<div class="row">
		<div class="col">
			<?php  
				$object = $db->get_this_one("SELECT * FROM `objekt` WHERE link='".$web->file_name."'");
				var_dump($object); 
			?>
		</div>
	</div>
		
<?php require_once('../essentials/footer.php'); ?>