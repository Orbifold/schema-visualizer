import Vue, { VueConstructor } from "vue";

declare global {
	interface namedNode {
		toSparql(): string;
	}
}
declare module "vue/types/vue" {
	interface Vue {

		// $notify: (text: string, timeout?: number, color?: string) => void;
		// /**
		//  * Gateway to all things data.
		//  */
		// $dataService: IDataService;
		// /**
		//  * The gateway to the local web store.
		//  */
		// $localDataStore: LocalDataStore;
		// /**
		//  * Manages recently used items by the user.
		//  */
		// $recent: RecentItems;
		// /**
		//  * Manages the favorites of the user.
		//  */
		// $favorites: FavoriteItems;
		// /**
		//  * Gateway to settings and configuration.
		//  */
		// $configuration: Configuration;
		// /**
		//  * Gateway to external data and services.
		//  */
		// $externals: Externals;
	}

	// interface ExtensionForm {
	// 	$dataService: IDataService;
	// }
	//
	// interface VueConstructor {
	// 	$dataService: IDataService;
	// }
}
//
// declare module "vue/types/options" {
// 	interface ComponentOptions<V extends Vue> {
// 		$dataService?: IDataService;
// 	}
// }
