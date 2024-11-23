<?php require_once('essentials/header.php'); 
	$own_user = $web->get_own_user();
?>

	<div class="row">
		<?php if (isset($_GET['bestaetigung'])) { ?>
			<div class="col">
				<span class="success"><?php echo $_GET['bestaetigung']; ?></span>
			</div>
		<?php } else if(isset($_GET['error'])) { ?>
			<div class="col">
				<span class="error"><?php echo $_GET['error']; ?></span>
			</div>
		<?php } ?>
		<div class="col">
            <form method="post" action="<?php echo $web->root; ?>/actions/send-mail.php" class="row contact-form default">
				<div class="col m-4">
					<fieldset>
						<span class="contact-form__heading">Schreib uns</span>
						<span class="contact-form__description">Du möchtest Feedback mit uns teilen, hast ein Problem mit der Seite oder brauchst einfach nur Hilfe beim Einstellen eines Mietobjektes? Gerne kannst du das Kontaktformular nutzen und deine Gedanken mit uns teilen. Wir versuchen alle Anfragen schnellstmöglich zu bearbeiten.</span>
					</fieldset>
					
					<fieldset class="contact-form__fieldset">
						<label for="cont-name"><i class="fa fa-user-circle"></i> <span>Name</span></label>
						<input name="cont-name" required oninvalid="this.setCustomValidity('Bitte gib deinen Namen an')" oninput="setCustomValidity('')" id="cont-name" type="text" <?php if($own_user) { echo 'value="'.$own_user['name'].'"'; } ?> placeholder="Bitte gib deinen Namen an">
					</fieldset>
					
					<fieldset class="contact-form__fieldset">
						<label for="cont-email"><i class="fa fa-envelope"></i> <span>E-Mail Adresse</span></label>
						<input name="cont-email" required oninvalid="this.setCustomValidity('Bitte gib eine gültige E-Mail Adresse an')" oninput="setCustomValidity('')" id="cont-email" type="text" <?php if($own_user) { echo 'value="'.$own_user['email'].'"'; } ?> placeholder="Bitte gib deinen E-Mail Adresse an">
					</fieldset>

					<fieldset class="contact-form__fieldset">
						<input class="contact-form__fieldset__checkbox" value="akzeptiert" required oninvalid="this.setCustomValidity('Bitte akzeptiere die Datenschutzerklärung')" oninput="setCustomValidity('')" name="cont-data-policy" id="cont-data-policy" type="checkbox" placeholder="Bitte gib deinen E-Mail Adresse an">
						<label class="contact-form__fieldset__checkbox-label opt-sec" for="cont-data-policy"> <span>Ich habe die <a href="<?php echo $web->root; ?>/datenschutzerklaerung.php" title="<?php echo $meta['datenschutzerklaerung.php']['title'] ?>">Datenschutzerklärung</a> gelesen und akzeptiere diese hiermit.</span></label>
					</fieldset>
				</div>
				<div class="col m-8 contact-form__same-height-flex">
					<fieldset class="contact-form__fieldset contact-form__fieldset--full-height">
						<label for="cont-message"><i class="fa fa-align-left"></i> <span>Nachricht</span></label>
						<textarea required oninvalid="this.setCustomValidity('Bitte gib eine Nachricht ein')" oninput="setCustomValidity('')" class="contact-form__fieldset contact-form__fieldset--full-height" name="cont-message" class="full-height" id="cont-message" type="text" placeholder="Bitte gib hier deine Nachricht ein"></textarea>
					</fieldset>
					<button type="submit" class="btn secondary wide"><i class="fa fa-paper-plane"></i> Nachricht senden</button>
				</div>
            </form>
		</div>
	</div>
		
<?php require_once('essentials/footer.php'); ?>