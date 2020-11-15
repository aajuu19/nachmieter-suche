<?php require_once('essentials/header.php'); ?>

	<div class="row">
		<div class="col">
			<div class="all-objects">
				<div class="object-teaser row">
					<div class="col s-8">
						<div class="address-container">
							<span class="address-field-label">
								<i class="fa fa-map-marker-alt"></i>
							</span>
							<input class="address-field" v-model="lfAddress" type="text" @blur="eraseSuggestions" placeholder="Stadt, Bezirk oder Postleitzahl angeben">
							<button class="change-address-btn btn" @mousedown="changeAddress"><i class="fa fa-filter"></i>Übernehmen</button>
							<ul v-cloak class="address-list" v-show="showSuggestions">
								<address-list-item @handle-address-click="handleAddressClick" :key="index" v-for="(place, index) in recentPlaceList" :place="place"></address-list-item>
							</ul>
						</div>
						<object-item v-for="object in objects" :key="object.o_id" :object="object"></object-item>
						<span class="error" v-if="errorMsg" v-cloak>Keine passenden Objekte gefunden, probier's mal mit anderen Filtereinstellungen.</span>
					</div>

					<aside class="col s-4 filter-ctn">
						<span class="main-heading">Filter</span>
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