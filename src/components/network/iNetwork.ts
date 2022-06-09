export interface INetwork {
	layout(name?: string): void;

	loadOntology(): void;

	zoomTo(id: string): void;

	search(term: string): void;

	refocus(): void;
}
