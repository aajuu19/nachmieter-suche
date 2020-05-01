<?php require_once('../essentials/header.php'); ?>
<div class="row">
    <div class="col">
		<div class="form-area row">
			<div class="col sm-8">
				<?php
					if(isset($_GET['error'])) {
						echo '<span class="error">'.$_GET['error'].'</span>';
					} else if(isset($_GET['bestaetigung'])) {
						echo '<span class="success">'.$_GET['bestaetigung'].'</span>';
					}
				?>
				<div class="obj-ctn">
					<form class="default" v-on:submit.prevent="validate" action="<?php echo $web->root; ?>/actions/insert-obj.php" enctype="multipart/form-data" method="POST">
						<fieldset>
							<label for="obj-name"><i class="fa fa-home"></i></label>
							<input name="obj-name" maxlength="61" id="obj-name" type="text" placeholder="Objektname" required 
							oninvalid="this.setCustomValidity('Bitte gib einen Objektnamen ein (max. 61 Zeichen)')" oninput="setCustomValidity('')">
						</fieldset>
						
						<fieldset>
							<label class="big-label" for="obj-desc"><i class="fa fa-align-left"></i></label>
							<textarea name="obj-desc" id="obj-desc" cols="30" required rows="10" placeholder="Objektbeschreibung" oninvalid="this.setCustomValidity('Bitte gib eine kurze Objektbeschreibung ein (max. 1500 Zeichen)')" oninput="setCustomValidity('')"></textarea>
						</fieldset>

						<fieldset>
							<label for="obj-quadratmeter"><i class="fa fa-cube"></i></label>
							<input maxlength="6" name="obj-quadratmeter" id="obj-quadratmeter" type="number" placeholder="Quadratmeter" required 
							oninvalid="this.setCustomValidity('Bitte gib die Quadratmeter ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset>
							<label for="obj-zimmer"><i class="fa fa-bed"></i></label>
							<input maxlength="6" name="obj-zimmer" id="obj-zimmer" type="number" placeholder="Anzahl Zimmer" required 
							oninvalid="this.setCustomValidity('Bitte gib die Anzahl der Zimmer ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset>
							<label for="obj-bad"><i class="fa fa-restroom"></i></label>
							<input maxlength="6" name="obj-bad" id="obj-bad" type="number" placeholder="Anzahl Badezimmer" required 
							oninvalid="this.setCustomValidity('Bitte gib die Anzahl der Badezimmer ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset class="dropdown">
							<label for="obj-typ"><i class="fa fa-home"></i></label>
							<select name="obj-typ" id="obj-typ" required oninvalid="this.setCustomValidity('Bitte gib einen Objekttypen ein')" oninput="setCustomValidity('')">
								<option value="" selected disabled>Wohnungstyp</option>
								<option value="Altbau">Altbau</option>
								<option value="Neubau">Neubau</option>
							</select>
						</fieldset>

						<fieldset class="dropdown">
							<label for="obj-adresse"><i class="fa fa-map-marker-alt"></i></label>
							<input v-model="objAddress" @focus="allowInput" @focusout="setFirstAddress" name="obj-adresse" autocomplete="off" id="obj-adresse" type="text" placeholder="Postleitzahl" required 
							oninvalid="this.setCustomValidity('Bitte gib eine gültige Postleitzahl oder einen Ort aus der Liste ein')" oninput="setCustomValidity('')">
							<div class="addressMenu" v-show="objAddressMenu.visible">
								<div v-show="showLoader"><i class="fa fa-spinner"></i></div>
								<div v-show="noPlace">Bitte versuche es mit einer andere Postleitzahl</div>
								<a @mousedown="setAddress(place)" tabindex="0" v-for="place in placeList">{{ place.plz }} {{ place.ort }}</a>
							</div>
						</fieldset>

						<fieldset>
							<label for="obj-kalt"><i class="fa fa-euro-sign"></i></label>
							<input maxlength="6" name="obj-kalt" id="obj-kalt" type="number" placeholder="Kaltmiete" required 
							oninvalid="this.setCustomValidity('Bitte gib die Kaltmiete ein')" oninput="setCustomValidity('')">
						</fieldset>

						<fieldset class="optional">
							<label class="opt-sec" for="obj-warm"><i class="fa fa-euro-sign"></i></label>
							<input maxlength="6" name="obj-warm" id="obj-warm" type="number" placeholder="Warmmiete">
						</fieldset>

						<fieldset class="optional">
							<label class="opt-sec" for="obj-etage"><i class="fa fa-layer-group"></i></label>
							<input maxlength="6" name="obj-etage" id="obj-etage" type="number" placeholder="Etage">
						</fieldset>

						<fieldset class="optional">
							<label class="opt-sec" for="obj-einzugsdatum"><i class="fa fa-calendar-alt"></i></label>
							<input placeholder="Einzugsdatum" name="obj-einzugsdatum" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="date" />
						</fieldset>
						
						<fieldset class="image-ctn">
							<label class="opt-sec" for="obj-images">
								<i class="icon fa fa-images"></i>
								<span class="img-placeholder optional">
									<span class="img-btn">
										Bilder hochladen <i class="fa fa-plus"></i> 
									</span>
									<template v-if="fileList.length >= 1">
										<span class="file-item" v-for="file in fileList"><i class="fa fa-file-image"></i> {{ file.name }}</span>
									</template>	
								</span>
							</label>
							<input type="file" @change="showFileDetails" name="obj-images[]" id="obj-images" multiple accept="image/*">
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