<template>
	<v-app id="root">
		<v-dialog v-model="aboutDialog" persistent max-width="600px" @keydown.esc="aboutDialog = false">
			<v-card>
				<v-card-title class="about-head">
					<v-icon class="white--text" style="margin-right: 10px;">mdi-flask</v-icon>
					<span class="white--text">About</span>
				</v-card-title>

				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<p>Schema Visualizer v{{ version }}, {{ date }}.</p>
								<p>
									Developed by <strong>Neo4j</strong> for Novo Nordisk.
								</p>



							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="aboutDialog = false">OK</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-app-bar app flat clipped-left class="appBar">
			<img src="/osb.png" class="logo" />
			<v-toolbar-title style="color: white; font-weight: normal;"></v-toolbar-title>
			<v-spacer />
			<v-btn color="#ffffff" text @click.stop="rightDrawer = !rightDrawer" v-show="true">
				<v-icon class="appBar-icon">mdi-cogs</v-icon>
			</v-btn>

      <v-btn color="#ffffff" text @click.stop="leftDrawer = !leftDrawer" v-show="false">
				<v-icon class="appBar-icon">mdi-apps</v-icon>
			</v-btn>
		</v-app-bar>
		<v-navigation-drawer v-model="leftDrawer" fixed temporary clipped />

		<v-main>
			<main>
				<v-container class="fill-height" style="padding: 0;" fluid>
					<v-fade-transition mode="out-in">
						<router-view></router-view>
					</v-fade-transition>
				</v-container>
			</main>
		</v-main>
		<v-navigation-drawer v-model="rightDrawer" fixed right temporary clipped>
		 <h2>Set</h2>
		</v-navigation-drawer>
		<v-footer app class="app-footer">
			<span class="footer-text"></span>
			<v-spacer></v-spacer>
			<span @click="showAbout()" title="About" style="opacity: 1; float: right; cursor: pointer;" class="footer-text">About</span>
		</v-footer>
	</v-app>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		components: {   },
	})
	export default class App extends Vue {
		version: string = null;
		date: string = null;
		rightDrawer: boolean = false;
		leftDrawer: boolean = false;
		private aboutDialog: boolean = false;

		showAbout() {
			this.aboutDialog = true;
		}

		async beforeMount() {
			this.version = require("../package.json").version;
			this.date = require("../package.json").date;
		}
    loadIt(){

    }
	}
</script>
<style>
	@import "../node_modules/yfiles/yfiles.css";

	.main-content {
		transition: margin 0.5s;
		padding: 20px;
	}

	.graph-component {
		background-color: #6b6b6b;
		position: absolute;
		top: 0;
		left: 0;
		right: 3px;
		bottom: 5px;
		overflow: hidden;
	}

	.appBar {
		box-shadow: none;

		background-color: #272727 !important;
	}

	main {
		padding: 57px 0px 30px;
	}

	html,
	body {
		overflow: hidden;
		font-family: "Roboto", sans-serif;
	}

	.v-btn {
		border-width: 0;
	}

	.icon-white {
		color: white;
	}

	.appBar-icon {
		background-color: transparent;
		color: white !important;
		border-width: 0;
	}

	.app-footer {
		background-color: #272727 !important;
		color: white;
	}

	.footer-text {
		opacity: 0.7;
		color: white;
		font-size: smaller;
	}

	.handle-dots {
		color: white !important;
		margin: 40vh -6px;
		height: 21px;
	}

	.right-handle {
		height: 100%;
		width: 0;
		background-color: #6b6b6b;
		float: left;
		cursor: pointer;
	}

	.left-handle {
		height: 100%;
		width: 0;
		background-color: #6b6b6b;
		float: right;
		cursor: pointer;
	}

	.left-panel {
		height: 100%; /* 100% Full-height */
		width: 0; /* 0 width - change this with JavaScript */
		position: fixed; /* Stay in place */
		z-index: 1; /* Stay on top */
		top: 0; /* Stay at the top */
		left: 0;
		background-color: #fff;
		overflow-x: hidden; /* Disable horizontal scroll */
		overflow-y: hidden; /* Disable vertical scroll */
		padding-top: 57px; /* Place content 60px from the top */
		transition: 0.5s; /* 0.5 second transition effect to slide in the right-panel */
	}

	/* The side navigation menu */
	.right-panel {
		height: 100%; /* 100% Full-height */
		width: 12px; /* 0 width - change this with JavaScript */
		position: fixed; /* Stay in place */
		z-index: 1; /* Stay on top */
		top: 0; /* Stay at the top */
		right: 0;
		background-color: #fff;
		overflow-x: hidden; /* Disable horizontal scroll */
		overflow-y: hidden; /* Disable vertical scroll */
		padding-top: 64px; /* Place content 60px from the top */
		transition: 0.5s; /* 0.5 second transition effect to slide in the right-panel */
	}

	/* The navigation menu links */
	a {
		padding: 8px 8px 8px 32px;
		text-decoration: none;
		font-size: 25px;
		color: #818181;
		display: block;
		transition: 0.3s;
	}

	.graph-wrapper {
		background-color: #6b6b6b;
		position: absolute;
		top: 50px;
		left: 0;
		right: 3px;
		bottom: 0px;
		overflow: hidden;
		transition: margin 0.5s;
	}

	.timeline-wrapper {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 0;
		transition: height 0.5s;
	}

	.toolbar-wrapper {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		background-color: #3a3a3a !important;
		border-bottom: 2px solid #6b6b6b;
	}

	.tab-button {
		cursor: pointer;
	}

	.panel-widget {
		min-height: 300px;
		background-color: transparent;
	}

	.v-select.v-text-field input {
		display: none;
	}

	.v-input__slot:before,
	.v-input__slot:after {
		border-style: none !important;
	}

	.tab-select {
		background-color: #568fbd;
		height: 50px;
		padding: 0px 24px 0px 10px;
		color: white !important;
		font-size: 15px;
	}

	.widget-wrapper {
		margin: 5px 5px;
		overflow: scroll;
		max-height: 500px;
		padding: 0px 5px;
	}

	.widget-header {
		background-color: #568fbd;
		margin: 0px -7px 0 0px;
		padding: 12px 15px;
		color: white;
		width: 100%;
	}

	.v-select__selection {
		color: white !important;
	}

	.v-input__icon > i {
		color: white !important;
	}

	.logo {
		height: 67px;
    margin: 0px 20px 3px -16px;
	}

	.about-head {
		background-color: #568fbd;
	}

	.about-link {
		color: #568fbd !important;
		font-weight: bold;
		font-size: 14px;
		padding: 0;
		display: initial;
	}

	.pop-name {
		font-size: 14px;
		margin: 3px 0 5px 15px;
		color: #568fbd;
	}

	.pop-parent {
		font-size: 14px;
		margin: 3px 0 5px 15px;
		color: #568fbd;
	}

	.pop-id {
		font-size: 14px;
		margin: 3px 0 5px 15px;
		color: #568fbd;
	}

	.pop-link {
		font-size: 14px;
		margin-left: 29px;
		color: #568fbd !important;
		padding: 0;
		display: initial;
	}

	.pop-prop {
		font-size: 14px;
		font-weight: bold;
		color: black;
	}

	.pop-details-separator {
		border-top: 1px solid grey;
		width: 270px;
		margin: 13px 15px;
	}

	.pop-source,
	.pop-target {
		font-weight: bold;
		float: left;
		color: dimgray;
		font-size: 15px;
	}

	.pop-arrow {
		font-size: 15px;
		float: left;
		margin-left: 5px;
		margin-right: 5px;
		color: dimgray;
	}

	.search-item {
		font-size: 14px;
		color: dimgray;
		cursor: pointer;
	}

	.list-item {
		list-style-type: square;
		color: dimgray;
	}

	.v-navigation-drawer {
		width: 450px !important;
	}

	.pop-relation {
		font-size: 18px;
		color: #568fbd;
		font-variant: small-caps;
		margin: 0 0 10px 0;
	}

	/**
        * {
            scrollbar-width: thin;
            scrollbar-color: #3f50b6 white;
        }

        *::-webkit-scrollbar {
            width: 8px;
        }
        *::-webkit-scrollbar-thumb {
            background-color: #3f50b6;
            border-radius: 20px;
            border: 2px solid white;
        }
        **/
</style>
