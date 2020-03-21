<?php require_once('../essentials/header.php'); ?>
<div class="row">
    <div class="col">
		<div class="form-area row">
			<div class="col sm-8">
				<div class="obj-ctn" v-show="registrationShow">
					<form v-on:submit.prevent="validate" class="default" action="<?php echo $web->root; ?>/register.php" method="POST">
						<fieldset>
							<label for="obj-name"><i class="fa fa-portrait"></i></label>
							<input minlength="6" name="obj-name" id="obj-name" type="text" placeholder="Objektname" required 
							oninvalid="this.setCustomValidity('Bitte gib einen Objektnamein ein')" oninput="setCustomValidity('')">
						</fieldset>
						
						<fieldset>
							<label class="big-label" for="obj-desc"><i class="fa fa-envelope"></i></label>
							<textarea name="obj-desc" id="obj-desc" cols="30" required rows="10" placeholder="Objektbeschreibung" oninvalid="this.setCustomValidity('Bitte gib eine kurze Objektbeschreibung ein')" oninput="setCustomValidity('')"></textarea>
						</fieldset>

						<input type="submit" class="btn" value="Neues Objekt einfügen">
					</form>
				</div>
			</div>
			<div class="col sm-4">
				<aside class="side-info">
					<h1 class="align-left">Komm zu uns</h1>
					<p>You think water moves fast? You should see ice. It moves like it has a mind.</p> 
					<p>Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out.</p> 
					<p>Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. </p>
				</aside>
			</div>
		</div>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>