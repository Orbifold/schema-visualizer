import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import BasicView from "@/views/BasicView.vue";
import NetworkView from "@/views/NetworkView.vue";
import TimelineView from "@/views/TimelineView.vue";
import OntologyView from "@/views/OntologyView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/basic",
		name: "Basic",
		component: BasicView,
	},
	{
		path: "/ontology",
		name: "Ontology",
		component: OntologyView,
	},

	{
		path: "*",
		redirect: "/ontology",
	},
];

const router = new VueRouter({
	routes,
});

export default router;
