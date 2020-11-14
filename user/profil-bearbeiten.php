<?php require_once('../essentials/header.php'); ?>
<div class="row">
    <div class="col">
		<div class="form-area row">
			<div class="col sm-8">
				<?php
					if(isset($_GET['error'])) {
						echo '<span class="error gap-bottom-2">'.$_GET['error'].'</span>';
					} else if(isset($_GET['bestaetigung'])) {
						echo '<span class="success gap-bottom-2">'.$_GET['bestaetigung'].'</span>';
					}
				?>
				<div class="edit-profile-app">
                    <form class="default" action="<?php echo $web->root; ?>/actions/change-profile.php" enctype="multipart/form-data" method="POST">
                    
                        <fieldset class="dropdown">
                            <label for="pers-lookingfor"><i class="fa fa-home"></i> <span>Ich suche nach</span></label>
                            <select v-model="userProfile.lookingfor" name="pers-lookingfor" id="pers-lookingfor" required oninvalid="this.setCustomValidity('Bitte gib ein wonach du suchst')" oninput="setCustomValidity('')">
                                <option value="" selected disabled>-- Bitte wählen --</option>
                                <option value="WG">WG</option>
                                <option value="Mietwohnung">Mietwohnung</option>
                                <option value="Haus">Haus</option>
                                <option value="Mieter">Mieter</option>
                            </select>
                        </fieldset>

                        <fieldset class="dropdown">
                            <label for="pers-gender"><i class="fa fa-user-astronaut"></i> <span>Geschlecht</span></label>
                            <select v-model="gender" name="pers-gender" id="pers-gender" required oninvalid="this.setCustomValidity('Bitte gib ein Geschlecht an oder wähle keine Angabe')" oninput="setCustomValidity('')">
                                <option value="" selected disabled>-- Bitte wählen --</option>
                                <option value="weiblich">weiblich</option>
                                <option value="männlich">männlich</option>
                                <option value="divers">divers</option>
                                <option value="keine Angabe">keine Angabe</option>
                            </select>
                        </fieldset>

                        <fieldset class="image-ctn">
							<label class="opt-sec" for="pers-profilepic">
								<div class="icon-ctn">
									<i class="icon fa fa-images"></i>
									<span>Profilbild</span>
								</div>
								<span class="img-placeholder optional">
									<span class="img-btn">
										Profilbild hochladen <i class="fa fa-plus"></i> 
									</span>
									<template v-if="fileList.length >= 1">
										<span class="file-item" v-for="file in fileList"><i class="fa fa-file-image"></i> {{ file.name }}</span>
									</template>	
								</span>
							</label>
							<input type="file" @change="showFileDetails" name="pers-profilepic[]" id="pers-profilepic" accept="image/*">
						</fieldset>
						
						<fieldset class="optional">
							<label class="big-label opt-sec" for="pers-desc"><i class="fa fa-align-left"></i> <span>Beschreibung</span></label>
							<textarea v-model="description" name="pers-desc" id="pers-desc" cols="30" maxlength="1500" rows="10" placeholder="Deine Profilbeschreibung" oninvalid="this.setCustomValidity('Bitte gib eine kurze Profilbeschreibung ein (max. 1500 Zeichen)')" oninput="setCustomValidity('')"></textarea>
                        </fieldset>

                        <fieldset class="dropdown optional">
							<label  class="opt-sec" for="pers-address"><i class="fa fa-map-marker-alt"></i> <span>Wunschort</span></label>
							<input v-model="lfAddress" @focus="allowInput" @blur="setFirstAddress" name="pers-address" autocomplete="off" id="pers-address" type="text" placeholder="Bitte gib einen Ort oder Bezirk an">
							<div class="address-list" v-show="objAddressMenu.visible">
                                <div v-show="noPlace">Bitte versuche es mit einem anderen Ort oder Bezirk</div>
                                <address-list-item @handle-address-click="setAddress" :key="index" v-for="(place, index) in recentPlaceList" :place="place"></address-list-item>
								<!-- <a @mousedown="setAddress(place)" tabindex="0" v-for="place in recentPlaceList">{{ placeContent }}</a> -->
							</div>
						</fieldset>

						<fieldset class="optional">
							<label class="opt-sec" for="pers-job"><i class="fa fa-briefcase"></i> <span>Job</span></label>
							<input v-model="job" name="pers-job" id="pers-job" type="text" placeholder="Bitte gib deinen Job an">
						</fieldset>
						
						<fieldset class="dropdown optional">
                            <label class="opt-sec" for="pers-lf-quadratmeter"><i class="fa fa-cube"></i> <span>Quadratmeter</span></label>
                            <select v-model="lfQuadratmeter" :class="{ filled: lfQuadratmeter}" placeholder="Test" class="change-select-color" name="pers-lf-quadratmeter" id="pers-lf-quadratmeter">
								<option value="" selected disabled>Wie viel Quadratmeter brauchst du?</option>
								<option value="">Keine Angabe</option>
                                <option value="0 - 49">0 - 49</option>
                                <option value="50 - 99">50 - 99</option>
                                <option value="100 - 149">100 - 149</option>
                                <option value="150 - 250">150 - 250</option>
                                <option value="Über 250">Über 250</option>
                            </select>
						</fieldset>
						
						<fieldset class="dropdown optional">
                            <label class="opt-sec" for="pers-lf-zimmer"><i class="fa fa-bed"></i> <span>Zimmer</span></label>
                            <select v-model="lfZimmer" :class="{ filled: lfZimmer}" class="change-select-color" placeholder="Test" name="pers-lf-zimmer" id="pers-lf-zimmer">
								<option value="" selected disabled>Wie viele Zimmer suchst du?</option>
								<option value="">Keine Angabe</option>
                                <option value="1 - 2">1 - 2</option>
                                <option value="2 - 3">2 - 3</option>
                                <option value="3 - 4">3 - 4</option>
                                <option value="4 - 5">4 - 5</option>
                                <option value="5 - 6">5 - 6</option>
                                <option value="6 - 7">6 - 7</option>
                                <option value="7 - 10">7 - 10</option>
                                <option value="Über 10">Über 10</option>
                            </select>
                        </fieldset>
						
						<fieldset class="dropdown optional">
                            <label class="opt-sec" for="pers-lf-kalt"><i class="fa fa-euro-sign"></i> <span>Kaltmiete</span></label>
                            <select v-model="lfKalt" :class="{ filled: lfKalt}" placeholder="Test" class="change-select-color" name="pers-lf-kalt" id="pers-lf-kalt">
								<option value="" selected disabled>Wie viel Kaltmiete möchtest du maximal zahlen?</option>
								<option value="">Keine Angabe</option>
                                <option value="0 - 300">0 - 300</option>
                                <option value="300 - 500">300 - 500</option>
                                <option value="500 - 700">500 - 700</option>
                                <option value="700 - 1000">700 - 1000</option>
                                <option value="1000 - 1500">1000 - 1500</option>
                                <option value="1500 - 3000">1500 - 3000</option>
                                <option value="3000 - 5000">3000 - 5000</option>
                                <option value="Über 5000">Über 5000</option>
                            </select>
						</fieldset>
						
						<fieldset class="dropdown optional">
                            <label class="opt-sec" for="pers-lf-warm"><i class="fa fa-euro-sign"></i> <span>Warmmiete</span></label>
                            <select v-model="lfWarm" :class="{ filled: lfWarm}" class="change-select-color" placeholder="Test" name="pers-lf-warm" id="pers-lf-warm">
                                <option value="" selected disabled>Wie viel Warmmiete möchtest du maximal zahlen?</option>
                                <option value="">Keine Angabe</option>
                                <option value="0 - 300">0 - 300</option>
                                <option value="300 - 500">300 - 500</option>
                                <option value="500 - 700">500 - 700</option>
                                <option value="700 - 1000">700 - 1000</option>
                                <option value="1000 - 1500">1000 - 1500</option>
                                <option value="1500 - 3000">1500 - 3000</option>
                                <option value="3000 - 5000">3000 - 5000</option>
                                <option value="Über 5000">Über 5000</option>
                            </select>
                        </fieldset>
						

                        <fieldset class="optional">
							<label class="opt-sec" for="pers-lookingfrom"><i class="fa fa-calendar-alt"></i> <span>Ich suche ab</span></label>
							<input v-model="lookingfrom" placeholder="Ab welchem Datum suchst du (DD.MM.YYYY)" name="pers-lookingfrom" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="pers-lookingfrom" />
						</fieldset>

                        <fieldset class="optional">
							<label class="opt-sec" for="pers-birthdate"><i class="fa fa-calendar-alt"></i> <span>Geburtsdatum</span></label>
							<input v-model="birthdate" placeholder="Ihr Geburtsdatum (DD.MM.YYYY)" name="pers-birthdate" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="pers-birthdate" />
                        </fieldset>

						<button type="submit" class="btn wide"><i class="fa fa-plus-circle"></i>Profil speichern</button>
					</form>
				</div>
			</div>
			<div class="col sm-4">
				<aside class="side-info bd-left">
					<h3 class="align-left">Info:</h3>
					<p>Alle Angaben die du hier tätigst sind komplett freiwillig und dienen nur dazu, dein eigenes Profil besser zu bewerben und für andere Benutzer nachvollziehbarer zu machen.</p>
					<p>Die Informationen sind nur für Benutzer dieser Webseite sichtbar und werden nicht von uns an Dritte weitergegeben.</p>
				</aside>
			</div>
		</div>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>