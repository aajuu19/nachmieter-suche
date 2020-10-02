<?php require_once('essentials/header.php'); ?>

	<div class="row">
		<div class="col">
			<div class="all-users">
				<div class="user-teaser row">
					
					<div class="col s-8">
						<user-item v-for="user in users" :key="user.o_id" :user="user"></user-item>
						<span class="error" v-if="errorMsg">Keine passenden Objekte gefunden, probier's mal mit anderen Filtereinstellungen.</span>
					</div>

					<aside class="col s-4 filter-ctn">
						<span class="main-heading">Benutzer sucht:</span>
						<template v-for="fil in filterList">
							<filter-box :title="fil.name" :ele="fil"></filter-box>
						</template>
						<button class="btn" @click="filterIt"><i class="fa fa-filter"></i> Filter anwenden</button>
					</aside>
				</div>

			</div>	
		</div>
	</div>
		
<?php require_once('essentials/footer.php'); ?>