<?php require_once('../essentials/header.php'); ?>
<div class="row">
    <div class="col">
		<div class="form-area row">
			<div class="col sm-8">
				<div class="obj-ctn" v-show="registrationShow">
					<form v-on:submit.prevent="validate" class="default" action="<?php echo $web->root; ?>/register.php" method="POST">
						<fieldset>
							<label for="obj-name"><i class="fa fa-home"></i></label>
							<input name="obj-name" id="obj-name" type="text" placeholder="Objektname" required 
							oninvalid="this.setCustomValidity('Bitte gib einen Objektnamein ein')" oninput="setCustomValidity('')">
						</fieldset>
						
						<fieldset>
							<label class="big-label" for="obj-desc"><i class="fa fa-align-left"></i></label>
							<textarea name="obj-desc" id="obj-desc" cols="30" required rows="10" placeholder="Objektbeschreibung" oninvalid="this.setCustomValidity('Bitte gib eine kurze Objektbeschreibung ein')" oninput="setCustomValidity('')"></textarea>
						</fieldset>

						<fieldset>
							<label for="obj-quadratmeter"><i class="fa fa-cube"></i></label>
							<input maxlength="6" name="obj-quadratmeter" id="obj-quadratmeter" type="number" placeholder="Quadratmeter" required 
							oninvalid="this.setCustomValidity('Bitte gib die Quadratmeter ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset>
							<label for="obj-zimmer"><i class="fa fa-bed"></i></label>
							<input maxlength="6" name="obj-zimmer" id="obj-zimmer" type="number" placeholder="Zimmer" required 
							oninvalid="this.setCustomValidity('Bitte gib die Anzahl der Zimmer ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset>
							<label for="obj-kalt"><i class="fa fa-dollar-sign"></i></label>
							<input maxlength="6" name="obj-kalt" id="obj-kalt" type="number" placeholder="Kaltmiete" required 
							oninvalid="this.setCustomValidity('Bitte gib die Kaltmiete ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset>
							<label class="opt-sec" for="obj-warm"><i class="fa fa-dollar-sign"></i></label>
							<input maxlength="6" name="obj-warm" id="obj-warm" type="number" placeholder="Warmmiete (optional)">
						</fieldset>

						<fieldset>
							<label class="opt-sec" for="obj-etage"><i class="fa fa-layer-group"></i></label>
							<input maxlength="6" name="obj-etage" id="obj-etage" type="number" placeholder="Etage (optional)">
						</fieldset>

						<fieldset>
							<label class="opt-sec" for="obj-einzugsdatum"><i class="fa fa-calendar-alt"></i></label>
							<input placeholder="voraussichtliches Einzugsdatum (optional)" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="date" />
						</fieldset>

						<input type="submit" class="btn" value="Neue Wohnung einfügen">
					</form>
				</div>
			</div>
			<div class="col sm-4">
				<aside class="side-info">
					<h3 class="align-left">Tipp:</h3>
					<p>Einige der Angaben sind zwar optional, wir würden dir dennoch raten diese anzugeben.</p>
					<p>Je mehr Angaben du machst, desto besser wirst du über die "Wohnung finden"-Suche gefunden.</p>
					<p>Gibt jemand einen Suchfilter mit einer Mindest- oder Höchstetage an und du hast keine angegeben, wirst du nicht angezeigt.</p>
				</aside>
			</div>
		</div>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>