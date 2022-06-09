<template>
	<div>
		<div ref="leftPanel" class="left-panel">
			<div @click="toggleLeft()" id="leftHandle" class="left-handle">
				<v-icon class="handle-dots">mdi-dots-vertical</v-icon>
			</div>
			<div ref="leftPanelContent" hidden>
				<div class="panel-widget">
					<v-select height="25" full-width class="tab-select" flat dense :items="tab1Items" @change="tab1Changed()" v-model="tab1SelectedName"></v-select>
					<div ref="thumbnailWrapper" class="widget-wrapper">
						<div id="thumbnail" class="thumbnail"></div>
					</div>
					<div ref="stuffWrapper" class="widget-wrapper" hidden>
						<ul style="margin-top: 20px;">
							<li class="list-item"><span class="layout-link" @click="network.layout('Hierarchic')">Hierarchic</span></li>
							<li class="list-item"><span class="layout-link" @click="network.layout('Organic')">Organic</span></li>
							<li class="list-item"><span class="layout-link" @click="network.layout('Circular')">Circular</span></li>
							<li class="list-item"><span class="layout-link" @click="network.layout('Radial')">Radial</span></li>
						</ul>
					</div>
				</div>
				<div class="panel-widget" style="height: 5000px;">
					<div class="widget-wrapper" style="max-height: 800px; padding: 0; margin: 0;">
						<div class="widget-header">Search</div>
						<search @search="search" @goto="goto" style="margin: 10px;"></search>
					</div>
				</div>
			</div>
		</div>
		<div class="toolbar-wrapper" ref="toolbarWrapper">
			<v-toolbar dense flat color="#424242">
				<v-toolbar-title></v-toolbar-title>

				<v-spacer></v-spacer>
        <v-btn color="#ffffff" text @click.stop="loadIt" >
          <v-icon class="appBar-icon">mdi-file-import</v-icon>
        </v-btn>
				<v-btn icon @click="toggleLeft()" title="Toggle the left panel">
					<v-icon>mdi-arrow-collapse-left</v-icon>
				</v-btn>
				<v-btn icon @click="toggleRight()" title="Toggle the right panel">
					<v-icon>mdi-arrow-collapse-right</v-icon>
				</v-btn>
				<v-btn icon @click="toggleTimeline()" v-show="false">
					<v-icon>mdi-arrow-collapse-down</v-icon>
				</v-btn>
				<v-btn icon @click="refocus()" title="Frame the diagram content">
					<v-icon>mdi-image-filter-center-focus</v-icon>
				</v-btn>
				<v-btn icon v-show="false">
					<v-icon>mdi-dots-vertical</v-icon>
				</v-btn>
			</v-toolbar>
		</div>
		<div ref="main">
			<div class="graph-wrapper" ref="networkWrapper">
				<Network ref="network"></Network>
			</div>
			<div class="timeline-wrapper" ref="timelineWrapper"></div>
		</div>
		<div ref="rightPanel" class="right-panel">
			<div @click="toggleRight()" id="rightHandle" class="right-handle">
				<v-icon class="handle-dots">mdi-dots-vertical</v-icon>
			</div>

			<div ref="rightPanelContent">
				<div class="panel-widget" style="height: 30vh; border: none;">
					<div ref="attribsWrapper" class="widget-wrapper" style="height: 30vh; padding: 0; margin: 0;">
						<div class="widget-header">Properties</div>
						<element-properties @goto="goto"></element-properties>
					</div>
				</div>
				<div class="panel-widget" style="height: 50vh; border: none;">
					<div class="widget-wrapper" style="height: 90vh; padding: 0; margin: 0;">
						<div class="widget-header">Neighborhood</div>
						<neighborhood @goto="goto"></neighborhood>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Network from "@/components/network/Network.vue";
	import { INetwork } from "@/components/network/iNetwork";
	import ElementProperties from "@/components/elementProperties.vue";
	import Search from "@/components/search.vue";
	import Neighborhood from "@/components/neighborhood.vue";
	import Configuration from "@/shared/configuration";

	@Component({
		components: { Network, ElementProperties, Search, Neighborhood },
	})
	export default class NetworkView extends Vue {
		leftPanel!: HTMLDivElement;
		rightPanel!: HTMLDivElement;
		main!: HTMLDivElement;
		networkWrapper!: HTMLDivElement;
		network: INetwork;
		timelineWrapper!: HTMLDivElement;
		toolbarWrapper!: HTMLDivElement;
		thumbnailWrapper!: HTMLDivElement;
		insightsWrapper!: HTMLDivElement;
		datavizWrapper!: HTMLDivElement;
		nodesWrapper!: HTMLDivElement;
		edgesWrapper!: HTMLDivElement;
		leftPanelContent!: HTMLDivElement;
		rightPanelContent!: HTMLDivElement;
		stuffWrapper!: HTMLDivElement;
		fromDate: Date = null;
		toDate: Date = null;
		tab1SelectedName: string = "Thumbnail";
		tab2SelectedName: string = "Search";
		tab3SelectedName: string = "Insights";
		tab1Items: any[] = [
			{ text: "Thumbnail", value: "Thumbnail" },
			{ text: "Layout", value: "Layout" },
		];

		tab2Items: any[] = [
			{ text: "Search", value: "Search" },
			{ text: "Edges", value: "Edges" },
		];
		tab3Items: any[] = [
			{ text: "Insights", value: "Insights" },
			{ text: "Dataviz", value: "Dataviz" },
		];

		tab1Changed() {
			switch (this.tab1SelectedName) {
				case "Thumbnail":
					this.thumbnailWrapper.style.display = "block";
					this.stuffWrapper.style.display = "none";
					break;
				case "Layout":
					this.thumbnailWrapper.style.display = "none";
					this.stuffWrapper.style.display = "block";
					break;
			}
		}

		tab2Changed() {
			switch (this.tab2SelectedName) {
				case "Search":
					this.nodesWrapper.style.display = "block";
					this.edgesWrapper.style.display = "none";
					break;
				case "Edges":
					this.nodesWrapper.style.display = "none";
					this.edgesWrapper.style.display = "block";
					break;
			}
		}

		tab3Changed() {
			switch (this.tab3SelectedName) {
				case "Insights":
					this.insightsWrapper.style.display = "block";
					this.datavizWrapper.style.display = "none";
					break;
				case "Edges":
					this.insightsWrapper.style.display = "none";
					this.datavizWrapper.style.display = "block";
					break;
			}
		}

		refreshLayout() {
			this.network.layout();
		}

		timelineChanged(range) {
			this.fromDate = range.from;
			this.toDate = range.to;
		}

		toggleRight() {
			const isOpen = this.rightPanel.style.width === "350px";
			if (isOpen) {
				this.closeRight();
			} else {
				this.openRight();
			}
		}

		toggleLeft() {
			const isOpen = this.leftPanel.style.width === "250px";
			if (isOpen) {
				this.closeLeft();
			} else {
				this.openLeft();
			}
		}

		toggleTimeline() {
			if (this.timelineWrapper.style.height === "300px") {
				this.closeTimeline();
			} else {
				this.openTimeline();
			}
		}

		closeTimeline() {
			this.timelineWrapper.style.height = "0";
			this.networkWrapper.style.marginBottom = "0";
		}

		openTimeline() {
			this.timelineWrapper.style.height = "300px";
			this.networkWrapper.style.marginBottom = "305px";
		}

		openRight() {
			this.rightPanelContent.style.display = "block";
			this.rightPanel.style.width = "350px";
			this.main.style.marginRight = "342px";
			this.toolbarWrapper.style.marginRight = "342px";
			this.timelineWrapper.style.marginRight = "342px";
			this.networkWrapper.style.marginRight = "335px";
		}

		closeRight() {
			this.rightPanelContent.style.display = "none";
			this.rightPanel.style.width = "0";
			this.main.style.marginRight = "0";
			this.toolbarWrapper.style.marginRight = "0";
			this.timelineWrapper.style.marginRight = "0";
			this.networkWrapper.style.marginRight = "0";
		}

		openLeft() {
			this.leftPanelContent.style.display = "block";
			this.leftPanel.style.width = "250px";
			this.main.style.marginLeft = "242px";
			this.toolbarWrapper.style.marginLeft = "242px";
			this.timelineWrapper.style.marginLeft = "242px";
			this.networkWrapper.style.marginLeft = "235px";
		}

		closeLeft() {
			this.leftPanel.style.width = "0";
			this.main.style.marginLeft = "0";
			this.toolbarWrapper.style.marginLeft = "0";
			this.timelineWrapper.style.marginLeft = "0";
			this.networkWrapper.style.marginLeft = "0";
			this.leftPanelContent.style.display = "none";
		}

		search(term) {
			this.network.search(term);
		}

		goto(id: string) {
			this.network.zoomTo(id);
		}

		refocus() {
			this.network.refocus();
		}

		mounted() {
			this.leftPanel = this.$refs.leftPanel as HTMLDivElement;
			this.rightPanel = this.$refs.rightPanel as HTMLDivElement;
			this.main = this.$refs.main as HTMLDivElement;
			this.timelineWrapper = this.$refs.timelineWrapper as HTMLDivElement;
			this.toolbarWrapper = this.$refs.toolbarWrapper as HTMLDivElement;
			this.networkWrapper = this.$refs.networkWrapper as HTMLDivElement;
			this.thumbnailWrapper = this.$refs.thumbnailWrapper as HTMLDivElement;
			this.nodesWrapper = this.$refs.nodesWrapper as HTMLDivElement;
			this.edgesWrapper = this.$refs.edgesWrapper as HTMLDivElement;
			this.stuffWrapper = this.$refs.stuffWrapper as HTMLDivElement;
			this.insightsWrapper = this.$refs.insightsWrapper as HTMLDivElement;
			this.datavizWrapper = this.$refs.datavizWrapper as HTMLDivElement;
			this.leftPanelContent = this.$refs.leftPanelContent as HTMLDivElement;
			this.rightPanelContent = this.$refs.rightPanelContent as HTMLDivElement;
			// @ts-ignore
			this.network = this.$refs.network as INetwork;
			// isn't good practice but for this one-view app it's OK
			Configuration.network = this.network;

			this.toggleRight();
		}
    loadIt(){
      (this.$refs.network as any). loadOntology();
    }
	}
</script>
<style scoped>
	.thumbnail {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 102px;
		width: 240px;
		height: 250px;
	}

	.layout-link {
		cursor: pointer;
		margin: 5px 0;
		font-size: 14px;
	}
</style>
