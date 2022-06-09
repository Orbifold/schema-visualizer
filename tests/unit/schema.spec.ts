import { OntologyType, TripleType, Schema, triple } from "@/shared/ontology";
import * as _ from "lodash";
import * as n3 from "n3";

const dataFactory = n3.DataFactory;
const { quad, namedNode, literal, defaultGraph } = dataFactory;
describe("Schema", function () {
	describe("toUri", () => {
		it("expect return root when no args are given", async function () {
			const uri = Schema.toUri("http://abc/");
			expect(uri instanceof n3.DataFactory.internal.NamedNode).toBeTruthy();
			expect(uri.id).toEqual("http://abc/");
		});

		it("expect fix the trailing slash", async function () {
			const uri = Schema.toUri("http://wat.com");
			expect(uri.id).toEqual("http://wat.com/");
		});

		it("expect concat args", async function () {
			const uri = Schema.toUri("http://wat.com", "a", "b");
			expect(uri.id).toEqual("http://wat.com/a/b");
		});

		it("expect recognize the named node root", async function () {
			const uri = Schema.toUri(namedNode("http://qa.com"), "a", "b");
			expect(uri.id).toEqual("http://qa.com/a/b");
		});
	});
	describe("quadType", () => {
		it("expect return a class type", async function () {
			const q = triple(Schema.random.uri, Schema.owlClass, Schema.random.uri);
			const type = Schema.getTripleType(q);
			expect(type).toEqual(TripleType.Class);
		});

		it("expect return an other type", async function () {
			const q = quad(Schema.random.uri, Schema.random.uri, Schema.random.uri);
			const type = Schema.getTripleType(q);
			expect(type).toEqual(TripleType.Other);
		});
	});
	describe("getOntologyTypeOfQuads", () => {
		it("expect return a class ", async function () {
			const q = Schema.random.classQuads;
			const type = Schema.getOntologyTypeOfTriples(q);
			expect(type).toEqual(OntologyType.Class);
		});
		it("expect return a property ", async function () {
			const q = Schema.random.datatypePropertyQuads;
			const type = Schema.getOntologyTypeOfTriples(q);
			expect(type).toEqual(OntologyType.DatatypeProperty);
		});
	});

});
