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
				<div class="edit-profile-app">
                    <form class="default"  action="<?php echo $web->root; ?>/actions/change-profile.php" enctype="multipart/form-data" method="POST">
                    
                        <fieldset class="dropdown">
                            <label for="pers-lookingfor"><i class="fa fa-home"></i></label>
                            <select v-model="userProfile.lookingfor" name="pers-lookingfor" id="pers-lookingfor" required oninvalid="this.setCustomValidity('Bitte gib ein wonach du suchst')" oninput="setCustomValidity('')">
                                <option value="" selected disabled>Auf der Suche nach</option>
                                <option value="WG">WG</option>
                                <option value="Mietwohnung">Mietwohnung</option>
                                <option value="Haus">Haus</option>
                                <option value="Mieter">Mieter</option>
                            </select>
                        </fieldset>

                        <fieldset class="dropdown">
                            <label for="pers-gender"><i class="fa fa-user-astronaut"></i></label>
                            <select v-model="gender" name="pers-gender" id="pers-gender" required oninvalid="this.setCustomValidity('Bitte gib ein Geschlecht an oder wähle keine Angabe')" oninput="setCustomValidity('')">
                                <option value="" selected disabled>Geschlecht</option>
                                <option value="weiblich">weiblich</option>
                                <option value="männlich">männlich</option>
                                <option value="divers">divers</option>
                                <option value="keine Angabe">keine Angabe</option>
                            </select>
                        </fieldset>

                        <fieldset class="image-ctn">
							<label class="opt-sec" for="pers-profilepic">
								<i class="icon fa fa-images"></i>
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
							<label class="big-label opt-sec" for="pers-desc"><i class="fa fa-align-left"></i></label>
							<textarea v-model="description" name="pers-desc" id="pers-desc" cols="30" maxlength="1500" required rows="10" placeholder="Profilbeschreibung" oninvalid="this.setCustomValidity('Bitte gib eine kurze Profilbeschreibung ein (max. 1500 Zeichen)')" oninput="setCustomValidity('')"></textarea>
                        </fieldset>

						<fieldset class="optional">
							<label class="opt-sec" for="pers-job"><i class="fa fa-briefcase"></i></label>
							<input v-model="job" name="pers-job" id="pers-job" type="text" placeholder="Job">
                        </fieldset>

                        <fieldset class="optional">
							<label class="opt-sec" for="pers-lookingfrom"><i class="fa fa-calendar-alt"></i></label>
							<input v-model="lookingfrom" placeholder="Ich suche ab" name="pers-lookingfrom" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="pers-lookingfrom" />
						</fieldset>
                        <fieldset class="optional">
							<label class="opt-sec" for="pers-birthdate"><i class="fa fa-calendar-alt"></i></label>
							<input v-model="birthdate" placeholder="Geburtsdatum" name="pers-birthdate" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="pers-birthdate" />
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