import faker from "faker";
import { uuid } from "uuidv4";
import * as _ from "lodash";

/**
 * Random data generation utilities.
 */
export default class DataGenerator {
    // a person should have just one function
    public static people = _.range(20).map(i => {
        return {
            name: faker.name.findName(),
            fun: faker.name.jobDescriptor(),
        };
    });

    static id() {
        return uuid();
    }

    static getResponsible() {
        return _.sample(DataGenerator.people).name;
    }

    static getDuration() {
        return faker.random.number({ min: 10, max: 100 });
    }

    static getName() {
        return faker.company.catchPhraseNoun();
    }

    static getProjectName() {
        return faker.company.catchPhrase();
    }

    static getProjectDescription() {
        return faker.lorem.paragraph();
    }

    static getInteger() {
        return faker.random.number({ min: 10, max: 1e8 });
    }
}
