import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		selectedItem: null,
		selectedData: null,
		waiting: null,
		searchResults: [],
		neighbors: null,
	},
	mutations: {
		setSelectedItem(state, item) {
			state.selectedItem = item;
		},
		setSelectedData(state, data) {
			state.selectedData = data;
		},
		setWaiting(state, b) {
			state.waiting = b;
		},
		setSearchResults(state, items) {
			state.searchResults = items;
		},
		setNeighbors(state, n) {
			state.neighbors = n;
		},
	},
	actions: {},
	modules: {},
});
