/**
 * Note that things like namednode are part of the W3C standard, so even if they seem somewhat overkill
 * in the context of Anzo they have been kept for good behavior.
 * See e.g. http://rdf.js.org/data-model-spec/#dom-namednode
 */
import * as _ from "lodash";
import * as n3 from "n3";
import * as faker from "faker";

const { isNamedNode } = n3.Util;

const dataFactory = n3.DataFactory;
const { namedNode, literal } = dataFactory;

export function toShortForm(uri) {
	if (_.isNil(uri)) {
		return "";
	}
	if (_.isString(uri)) {
		uri = uri.replace("http://dbpedia.org/ontology", "").replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "").replace("http://www.w3.org/2000/01/rdf-schema#", "").replace("http://www.w3.org/2002/07/owl#", "");
		if (uri.indexOf("/") > -1) {
			uri = uri.slice(uri.indexOf("/") + 1);
		}
		if (uri.indexOf("#") > -1) {
			uri = uri.slice(uri.lastIndexOf("#") + 1);
		}
		return uri;
	} else if (_.isArray(uri)) {
		uri.map((u) => toShortForm(u));
	} else {
		return uri.toString();
	}
}

export interface ITriple {
	subject: string;
	predicate: string;
	object: string;
}

export function triple(s, p, o) {
	return {
		subject: s,
		predicate: p,
		object: o,
	};
}

export const TripleType = {
	Class: "Class",
	SubClass: "SubClass",
	Label: "Label",
	Comment: "Comment",
	Other: "Other",
	Thing: "Thing",
	A: "A",
};
export const OntologyType = {
	Class: "Class",
	DatatypeProperty: "DatatypeProperty",
	ObjectProperty: "ObjectProperty",
	Other: "Other",
};

const SpecialUri = {
	a: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
	owlClass: "http://www.w3.org/2002/07/owl#Class",
	owl: "http://www.w3.org/2002/07/owl#",
	owlDatatypeProperty: "http://www.w3.org/2002/07/owl#DatatypeProperty",
	owlObjectProperty: "http://www.w3.org/2002/07/owl#ObjectProperty",
	thing: "http://www.w3.org/2002/07/owl#Thing",
	subClassOf: "http://www.w3.org/2000/01/rdf-schema#subClassOf",
	rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs: "http://www.w3.org/2000/01/rdf-schema#",
	label: "http://www.w3.org/2000/01/rdf-schema#label",
	comment: "http://www.w3.org/2000/01/rdf-schema#comment",
	domain: "http://www.w3.org/2000/01/rdf-schema#domain",
	range: "http://www.w3.org/2000/01/rdf-schema#range",
	literal: "http://www.w3.org/2000/01/rdf-schema#literal",
};

export const Schema = {
	get a() {
		return SpecialUri.a;
	},
	get aNode() {
		return namedNode(Schema.a);
	},
	get $a() {
		return `<${Schema.a}>`;
	},
	get owlClass() {
		return SpecialUri.owlClass;
	},
	get $owlClass() {
		return `<${Schema.owlClass}>`;
	},
	get owlClassNode() {
		return namedNode(Schema.owlClass);
	},

	get thing() {
		return SpecialUri.thing;
	},
	get thingNode() {
		return namedNode(Schema.thing);
	},
	get $thing() {
		return `<${Schema.thing}>`;
	},

	get subClassOf() {
		return SpecialUri.subClassOf;
	},
	get $subClassOf() {
		return `<${Schema.subClassOf}>`;
	},
	get subClassOfNode() {
		return namedNode(Schema.subClassOf);
	},

	get rdf() {
		return SpecialUri.rdf;
	},
	get $rdf() {
		return `<${Schema.rdf}>`;
	},
	get rdfNode() {
		return namedNode(Schema.rdf);
	},

	get rdfs() {
		return SpecialUri.rdfs;
	},
	get $rdfs() {
		return `<${Schema.rdfs}>`;
	},
	get rdfsNode() {
		return namedNode(Schema.rdfs);
	},

	get label() {
		return SpecialUri.label;
	},
	get $label() {
		return `<${Schema.label}>`;
	},
	get labelNode() {
		return namedNode(Schema.label);
	},

	get comment() {
		return SpecialUri.comment;
	},
	get $comment() {
		return `<${Schema.comment}>`;
	},
	get commentNode() {
		return namedNode(Schema.comment);
	},

	get datatypeProperty() {
		return SpecialUri.owlDatatypeProperty;
	},
	get $datatypeProperty() {
		return `<${Schema.datatypeProperty}>`;
	},
	get datatypePropertyNode() {
		return namedNode(Schema.datatypeProperty);
	},

	get objectProperty() {
		return SpecialUri.owlObjectProperty;
	},
	get $objectProperty() {
		return `<${Schema.objectProperty}>`;
	},
	get objectPropertyNode() {
		return namedNode(Schema.objectProperty);
	},

	get domain() {
		return SpecialUri.domain;
	},
	get $domain() {
		return `<${SpecialUri.domain}>`;
	},
	get domainNode() {
		return namedNode(Schema.domain);
	},

	get range() {
		return SpecialUri.range;
	},
	get $range() {
		return `<${SpecialUri.range}>`;
	},
	get rangeNode() {
		return namedNode(Schema.range);
	},

	validateNamespace(ns) {
		if (_.isNil(ns)) {
			throw new Error("Missing root in constructor.");
		}
		if (isNamedNode(ns)) {
			ns = ns.id;
		}
		if (!_.isString(ns)) {
			throw new Error("Root expected to be a string or node.");
		}
		if (!ns.endsWith("/")) {
			ns += "/";
		}
		return ns;
	},

	/**
	 * Returns the type of triple given.
	 * @param q presumably a triple
	 * @returns {string}
	 */
	getTripleType: function (q) {
		if (_.isNil(q)) {
			throw new Error("Missing argument in getTripleType.");
		}
		if (q.predicate === Schema.owlClass) {
			return TripleType.Class;
		} else if (q.predicate === Schema.comment) {
			return TripleType.Comment;
		} else if (q.predicate === Schema.comment) {
			return TripleType.Comment;
		} else if (q.predicate === Schema.label) {
			return TripleType.Label;
		} else if (q.predicate === Schema.a) {
			return TripleType.A;
		} else if (q.predicate === Schema.thing) {
			return TripleType.Thing;
		}
		return TripleType.Other;
	},
	/**
	 * Returns the quads defining an ontology class.
	 * @param rootId the root namespace
	 * @param className the name of the class
	 * @param parentClassName optional parent class name
	 * @param [label] {string} Optional label.
	 * @param [comment] {string} Optional comment.
	 */
	getClassTriples(rootId, className, parentClassName = null, label = null, comment = null): ITriple[] {
		rootId = Schema.ensureRootId(rootId);
		if (_.isNil(parentClassName)) {
			return [
				triple(Schema.toUri(rootId, className).id, Schema.a, Schema.owlClass),
				triple(Schema.toUri(rootId, className).id, Schema.subClassOf, Schema.thing),
				triple(Schema.toUri(rootId, className).id, Schema.label, _.isNil(label) ? this.toShortForm(rootId, className) : label),
				triple(Schema.toUri(rootId, className).id, Schema.comment, _.isNil(comment) ? "" : comment),
			];
		} else {
			return [
				triple(Schema.toUri(rootId, className).id, Schema.a, Schema.owlClass),
				triple(Schema.toUri(rootId, className).id, Schema.subClassOf, Schema.toUri(rootId, parentClassName).id),
				triple(Schema.toUri(rootId, className).id, Schema.label, _.isNil(label) ? this.toShortForm(rootId, className) : label),
				triple(Schema.toUri(rootId, className).id, Schema.comment, _.isNil(comment) ? "" : comment),
			];
		}
	},
	getDataPropertyTriples(rootUri, propertyName, domain, label = null, comment = null) {
		const uri = Schema.toUri(rootUri, propertyName).id;
		const result = [triple(uri, Schema.a, Schema.datatypeProperty), triple(uri, Schema.label, _.isNil(label) ? propertyName : label), triple(uri, Schema.comment, _.isNil(comment) ? "" : comment)];
		if (_.isString(domain)) {
			result.push(triple(uri, Schema.domain, Schema.toUri(rootUri, domain).id));
		} else if (_.isArray(domain)) {
			domain.forEach((d) => {
				result.push(triple(uri, this.domainNode, Schema.toUri(rootUri, d).id));
			});
		}
		return result;
	},
	getObjectPropertyTriples(rootUri, propertyName, domain, range, label = null, comment = null) {
		const uri = Schema.toUri(rootUri, propertyName).id;
		const result = [
			triple(uri, Schema.a, this.objectPropertyNode),
			// triple(uri, Schema.subClassOf, this.objectPropertyNode),
			triple(uri, Schema.label, literal(_.isNil(label) ? propertyName : label)),
			triple(uri, Schema.comment, literal(_.isNil(comment) ? "" : comment)),
		];
		if (_.isString(domain)) {
			result.push(triple(uri, this.domainNode, Schema.toUri(rootUri, domain).id));
		} else if (_.isArray(domain)) {
			domain.forEach((d) => {
				result.push(triple(uri, this.domainNode, Schema.toUri(rootUri, d).id));
			});
		}
		if (_.isString(range)) {
			result.push(triple(uri, this.rangeNode, Schema.toUri(rootUri, range).id));
		} else if (_.isArray(range)) {
			range.forEach((r) => {
				result.push(triple(uri, this.rangeNode, Schema.toUri(rootUri, r).id));
			});
		}
		return result;
	},



	/**
	 * Returns a shortened form of the given term.
	 * Useful for printing and literals.
	 * @param rootUri the root namespace
	 * @param uri anything
	 * @returns {string}
	 */
	toShortForm(rootUri, uri) {
		const rootId = this.ensureRootId(rootUri);
		if (_.isString(uri)) {
			uri = uri.replace(rootId, "").replace(SpecialUri.rdf, "").replace(SpecialUri.rdfs, "").replace(SpecialUri.owl, "");
			if (uri.indexOf("/") > -1) {
				uri = uri.slice(uri.indexOf("/") + 1);
			}
			if (uri.indexOf("#") > -1) {
				uri = uri.slice(uri.lastIndexOf("#") + 1);
			}
			return uri;
		} else if (uri instanceof dataFactory.internal.NamedNode) {
			return this.toShortForm(rootId, uri.id);
		} else if (_.isArray(uri)) {
			uri.map((u) => this.toShortForm(u, uri));
		} else if (uri instanceof dataFactory.internal.Literal) {
			return uri.value;
		} else {
			return uri.toString();
		}
	},

	/**
	 * Makes sure that the given things can be used as a namespace (trailing slash and such).
	 * @param rootSomething string or node
	 * @returns {string}
	 */
	ensureRootId(rootSomething) {
		if (_.isNil(rootSomething)) {
			throw new Error("Missing root Uri or Url.");
		}
		if (_.isString(rootSomething)) {
			if (!rootSomething.startsWith("http")) {
				throw new Error(`The root '${rootSomething}' should begin with 'http' or 'https'.`);
			}
			if (rootSomething.endsWith("#")) {
				throw new Error(`The framework does not support naming based on '#', only on trailing '/'.`);
			}
			if (!rootSomething.endsWith("/")) {
				rootSomething += "/";
			}
			return rootSomething;
		}
		if (isNamedNode(rootSomething)) {
			return this.ensureRootId(rootSomething.id);
		}
	},
	/**
	 * Returns whether the given item is named node.
	 * @param s anything
	 * @returns {boolean}
	 */
	isNamedNode(s) {
		return s instanceof n3.DataFactory.internal.NamedNode;
	},
	/**
	 * Returns a rooted Uri with brackets suitable for a Sparql query.
	 * @param rootUri
	 * @param args
	 */
	toSparqlUri(rootUri, ...args) {
		const node = Schema.toUri(rootUri, ...args);
		return `<${node.id}>`;
	},
	/**
	 * Assembles a named node from the given parts.
	 * @param rootUri The root namespace.
	 * @param args optional parts
	 * @returns {NamedNode|*}
	 */
	toUri(rootUri, ...args) {
		if (_.isNil(rootUri)) {
			throw new Error("Missing root Uri");
		}
		let rootNode = this.isNamedNode(rootUri) ? rootUri : namedNode(rootUri);
		let rootId = this.isNamedNode(rootUri) ? rootUri.id : rootUri;

		if (!rootId.startsWith("http")) {
			throw new Error(`The root Uri is not valid, it should start with 'http'.`);
		}

		if (!rootId.endsWith("/")) {
			rootId += "/";
			rootNode = namedNode(rootId);
		}
		if (args.length === 0) {
			return rootNode;
		}
		// case that the first arg is a NamedNode we return it as-is, allowing for non-root nodes
		if (isNamedNode(args[0])) {
			return args[0];
		}
		if (args[0].startsWith("http")) {
			// not nice to give a Url but we'll accept it
			return namedNode(args[0]);
		}
		const ar = [];
		args.forEach((arg, index) => {
			if (!_.isString(arg)) {
				throw new Error("All Uri elements should be strings.");
			}
			if (arg.startsWith("/")) {
				arg = arg.slice(1);
			}
			if (arg.endsWith("/")) {
				arg = arg.slice(0, -1);
			}
			ar.push(arg);
		});
		return namedNode(rootId + ar.join("/"));
	},
	/**
	 * Returns a random Uri for testing purposes.
	 */
	get random() {
		const parent = this;
		return {
			get uri() {
				return parent.toUri(faker.internet.url(), faker.lorem.word()).id;
			},
			get classQuads() {
				return parent.getClassTriples(faker.internet.url(), faker.random.uuid(), null, faker.lorem.words(4), faker.lorem.paragraph());
			},
			get classQuadsAndDetails() {
				const root = faker.internet.url();
				const className = faker.random.uuid();
				const parentName = faker.random.uuid();
				const def = {
					name: className,
					uri: parent.toUri(root, className).id,
					label: faker.lorem.word(),
					comment: faker.lorem.paragraph(),
					parentUri: parent.toUri(root, parentName).id,
					parentName: parentName,
					root: root,
				};
				return {
					details: def,
					quads: parent.getClassTriples(root, def.name, def.parentName, def.label, def.comment),
				};
			},
			get datatypePropertyQuads() {
				return parent.getDataPropertyTriples(faker.internet.url(), faker.random.word(), faker.random.word(), faker.lorem.words(4), faker.lorem.paragraph());
			},
		};
	},
	/**
	 * Given an array of quads this returns what it presumably serializes.
	 * @param ar a triple array
	 * @returns {string}
	 */
	getOntologyTypeOfTriples(ar: ITriple[]) {
		if (_.isNil(ar)) {
			throw new Error("Missing argument in getOntologyTypeOfTriples.");
		}
		if (!_.isArray(ar)) {
			throw new Error("getOntologyTypeOfTriples argument should be an array of triples.");
		}
		const found = _.filter(ar, (a) => a.predicate === Schema.a);
		if (found.length !== 1) {
			return OntologyType.Other;
		}
		const obj = found[0].object;
		if (obj === Schema.datatypeProperty) {
			return OntologyType.DatatypeProperty;
		} else if (obj === Schema.objectProperty) {
			return OntologyType.ObjectProperty;
		} else if (obj === Schema.owlClass) {
			return OntologyType.Class;
		}
		return OntologyType.Other;
	},
};
