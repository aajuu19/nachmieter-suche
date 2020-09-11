<?php require_once('essentials/header.php'); ?>
<div class="row">
	<div class="col">
		<div class="register-login-app">
			<div class="row">
				<div class="col">
					<div class="form-area row">
						<div class="col sm-4">
							<aside class="side-info bd-right">
								<div class="register-tab big-tab" :class="{ active: registration.isActive }" @click="changeVal('register')">
									<span class="heading"><i class="fa fa-users"></i> Registrierung</span>
									<span class="desc">Werde auch du ein Teil unserer nachmieter-suche.de Community!</span>
								</div>
							
								<div class="secondary-tab big-tab" :class="{ active: login.isActive }" @click="changeVal('login')">
									<span class="heading"><i class="fa fa-user"></i> Login</span>
									<span class="desc">Du gehörst schon zu uns? Hier gehts zum Login!</span>
								</div>
							</aside>
						</div>
						<div class="col sm-8">
							<h1 class="align-left" :class="{ secondary : login.isActive }">{{ appTitle }}</h1>
							<?php
								if(isset($_GET['error'])) {
									echo '<span class="error">'.$_GET['error'].'</span>';
								} else if(isset($_GET['bestaetigung'])) {
									echo '<span class="success">'.$_GET['bestaetigung'].'</span>';
								}
							?>
							<div class="login-ctn" v-show="login.isActive">
								<form v-on:submit.prevent="validate" class="default" action="<?php echo $web->root; ?>/actions/login.php" method="POST">
									<fieldset>
										<label for="log-mail"><i class="fa fa-envelope"></i></label>
										<input name="log-mail" id="log-mail" type="mail" placeholder="E-Mail-Adresse" required 
										oninvalid="this.setCustomValidity('Bitte gib eine gültige E-Mail-Adresse an')" oninput="setCustomValidity('')">
									</fieldset>
									<fieldset>
										<label for="log-pw"><i class="fa fa-key"></i></label>
										<input name="log-pw" id="log-pw" type="password" placeholder="Passwort" required>
									</fieldset>
									<input type="submit" class="btn secondary" value="Jetzt einloggen">
								</form>
							</div>
							<div class="registration-ctn" v-show="registration.isActive">
								<form v-on:submit.prevent="validate" class="default" action="<?php echo $web->root; ?>/actions/register.php" method="POST">

									<fieldset class="dropdown">
										<label for="reg-gender"><i class="fa fa-user-astronaut"></i></label>
										<select name="reg-gender" id="reg-gender" required oninvalid="this.setCustomValidity('Bitte gib ein Geschlecht an oder wähle keine Angabe')" oninput="setCustomValidity('')">
											<option value="" selected disabled>Geschlecht</option>
											<option value="weiblich">weiblich</option>
											<option value="männlich">männlich</option>
											<option value="divers">divers</option>
											<option value="keine Angabe">keine Angabe</option>
										</select>
									</fieldset>

									<fieldset class="dropdown">
										<label for="reg-lookingfor"><i class="fa fa-home"></i></label>
										<select name="reg-lookingfor" id="reg-lookingfor" required oninvalid="this.setCustomValidity('Bitte gib ein wonach du suchst')" oninput="setCustomValidity('')">
											<option value="" selected disabled>Auf der Suche nach</option>
											<option value="WG">WG</option>
											<option value="Mietwohnung">Mietwohnung</option>
											<option value="Haus">Haus</option>
											<option value="Mieter">Mieter</option>
										</select>
									</fieldset>
								
									<fieldset>
										<label for="reg-name"><i class="fa fa-portrait"></i></label>
										<input minlength="6" maxlength="50" name="reg-name" id="reg-name" type="text" placeholder="Wunschname eingeben" required 
										oninvalid="this.setCustomValidity('Bitte gib einen Namen ein (Mindestens 6 Zeichen, Maximal 50 Zeichen)')" oninput="setCustomValidity('')">
									</fieldset>
									
									<fieldset>
										<label for="reg-mail"><i class="fa fa-envelope"></i></label>
										<input name="reg-mail" id="reg-mail" type="mail" placeholder="E-Mail-Adresse" required 
										oninvalid="this.setCustomValidity('Bitte gib eine gültige E-Mail-Adresse an')" oninput="setCustomValidity('')">
									</fieldset>

									<fieldset>
										<label for="reg-pw"><i class="fa fa-key"></i></label>
										<input minlength="6" name="reg-pw" id="reg-pw" type="password" placeholder="Passwort" required 
										oninvalid="this.setCustomValidity('Bitte gib ein gültiges Passwort ein (Mindestlänge 6 Zeichen)')" oninput="setCustomValidity('')">
									</fieldset>

									<input type="submit" class="btn" value="Jetzt registrieren">
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>		
	</div>
</div>
<?php require_once('essentials/footer.php'); ?>