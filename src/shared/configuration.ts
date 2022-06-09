/**
 * The prefix for user-settings.
 */

const SettingsPrefix = "_settings_";
import * as _ from "lodash";
import { INetwork } from "@/components/network/iNetwork";
/**
 * Manages the configuration and settings of the app.
 */
export default class Configuration {
	public static network: INetwork = null;


	private static isAppSettingsKey(s) {
		return s === SettingsPrefix;
	}

	/**
	 * Saves the given JSON to the local web store.
	 * @param name {string} The actual name, use the prefix methods to assemble a name with a prefix.
	 * @param json {any} The JSON to save.
	 */
	private static save(name: string, json: any): boolean {
		if (!_.isPlainObject(json) && !_.isArray(json)) {
			throw new Error("Expected plain object or array.");
		}
		localStorage.setItem(name, JSON.stringify(json));
		return true;
	}

	private static remove(key: string) {
		localStorage.removeItem(key);
	}

	/**
	 * Upserts the given app settings.
	 * @param settings {AppSettings} The app settings.
	 * @returns {Promise<boolean>}
	 */
	public static upsertAppSettings(settings: any): boolean {
		console.log(`Updated settings: ${JSON.stringify(settings)}`);
		return Configuration.save(SettingsPrefix, settings);
	}

	public static appSettingsExist(): boolean {
		for (let i = 0; i < localStorage.length; i++) {
			if (Configuration.isAppSettingsKey(localStorage.key(i))) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns the app settings.
	 * @returns {Promise<any>}
	 */
	public static getAppSettings(): any {
		const raw = localStorage.getItem(SettingsPrefix);
		// if (_.isNil(raw)) {
		// 	reject(`Found nil data for the app settings.`);
		// }
		return JSON.parse(raw);
	}

	/**
	 * Returns whether there are saved app settings.
	 * @returns {Promise<boolean>}
	 */
	async appSettingsExist(): Promise<boolean> {
		for (let i = 0; i < localStorage.length; i++) {
			if (Configuration.isAppSettingsKey(localStorage.key(i))) {
				return true;
			}
		}
		return false;
	}
}
