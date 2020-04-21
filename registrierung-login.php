<?php require_once('essentials/header.php'); ?>
<div class="row">
	<div class="col">
		<div class="register-login-app">
			<div class="row">
				<div class="col s-6">
					<div class="register-tab big-tab" @click="changeVal('register')">
						<span class="heading"><i class="fa fa-users"></i> Registrierung</span>
						<span class="desc">Werde auch du ein Teil unserer nachmieter-suche.de Community!</span>
					</div>
				</div>
				<div class="col s-6">
					<div class="secondary-tab big-tab" @click="changeVal('login')">
						<span class="heading"><i class="fa fa-user"></i> Login</span>
						<span class="desc">Du gehörst schon zu uns? Hier gehts zum Login!</span>
					</div>
				</div>
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
							<div class="login-ctn" v-show="loginShow">
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
							<div class="registration-ctn" v-show="registrationShow">
								<form v-on:submit.prevent="validate" class="default" action="<?php echo $web->root; ?>/actions/register.php" method="POST">
									<fieldset>
										<label for="reg-name"><i class="fa fa-portrait"></i></label>
										<input minlength="6" name="reg-name" id="reg-name" type="text" placeholder="Wunschname eingeben" required 
										oninvalid="this.setCustomValidity('Bitte gib einen Namen ein (Mindestens 6 Zeichen)')" oninput="setCustomValidity('')">
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
		</div>		
	</div>
</div>
<?php require_once('essentials/footer.php'); ?>