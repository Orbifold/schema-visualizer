import faker from "faker";
import { uuid } from "uuidv4";
import * as _ from "lodash";
import DataGenerator from "./index";

const randomDAG = (x, n) => {
    const length = (n * (n - 1)) / 2;

    const dag = new Array(length).fill(1);

    for (let i = 0; i < length; i++) {
        if (Math.random() < x) continue;
        dag[i] = 0;
        if (!isConnected(n, dag)) dag[i] = 1;
    }

    return dag;
};

const dagIndex = (n, i, j) => n * i + j - ((i + 1) * (i + 2)) / 2;

const isConnected = (n, dag) => {
    const reached = new Array(n).fill(false);

    reached[0] = true;

    const queue = [0];

    while (queue.length > 0) {
        const x = queue.shift();

        for (let i = 0; i < n; i++) {
            if (i === n || reached[i]) continue;
            const j = i < x ? dagIndex(n, i, x) : dagIndex(n, x, i);
            if (dag[j] === 0) continue;
            reached[i] = true;
            queue.push(i);
        }
    }

    return reached.every(x => x); // return true if every vertex was reached
};

const dagToEdges = (n, dag) => {
    let edges = [];
    let nodes = [];
    for (let i = 0; i < n; i++) {
        nodes.push({ id: i });

        for (let j = i + 1; j < n; j++) {
            const k = dagIndex(n, i, j);
            if (dag[k]) edges.push({ sourceId: i, targetId: j });
        }
    }

    return { nodes: nodes, edges: edges };
};

const randomFlow = (x, n) => dagToEdges(n, randomDAG(x, n));

export function getRandomFlow(size = 80, p = 0.031) {
    const data = randomFlow(p, size);
    for (let i = 0; i < data.nodes.length; i++) {
        const item = data.nodes[i];
        item.name = DataGenerator.getName();
        item.owner = DataGenerator.getResponsible();
    }
    for (let i = 0; i < data.edges.length; i++) {
        const item = data.edges[i];
        item.duration = DataGenerator.getDuration();
    }
    return data;
}
