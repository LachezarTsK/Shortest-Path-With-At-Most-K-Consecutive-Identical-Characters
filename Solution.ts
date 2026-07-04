
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

function shortestPath(numberOfNodes: number, edges: number[][], labels: string, maxSameConsecutiveLabels: number): number {
    const directedGraph: Node[][] = createDirectedGraph(numberOfNodes, edges);
    return findShortestPath(directedGraph, labels, maxSameConsecutiveLabels);
};

function findShortestPath(directedGraph: Node[][], labels: string, maxSameConsecutiveLabels: number): number {
    const startID = 0;
    const goalID = directedGraph.length - 1;
    const NO_PATH_FOUND = -1;

    const minHeap = new PriorityQueue<Step>((x, y) => x.weightFromStart - y.weightFromStart);
    minHeap.enqueue(new Step(startID, 0, labels.charAt(startID), 1));

    const minPathWeight: number[][] = Array.from(new Array(goalID + 1), () => new Array(maxSameConsecutiveLabels + 1).fill(Number.MAX_SAFE_INTEGER));
    minPathWeight[startID][1] = 0;

    while (!minHeap.isEmpty()) {
        const current = minHeap.dequeue();
        if (current.ID === goalID) {
            return current.weightFromStart;
        }

        for (let next of directedGraph[current.ID]) {
            if (current.label === labels.charAt(next.ID) && current.sameConsecutiveLabels + 1 > maxSameConsecutiveLabels) {
                continue;
            }

            let sameConsecutiveLabels = 1;
            if (current.label === labels.charAt(next.ID)) {
                sameConsecutiveLabels += current.sameConsecutiveLabels;
            }

            if (current.weightFromStart + next.weight >= minPathWeight[next.ID][sameConsecutiveLabels]) {
                continue;
            }

            minPathWeight[next.ID][sameConsecutiveLabels] = current.weightFromStart + next.weight;
            minHeap.enqueue(new Step(next.ID, current.weightFromStart + next.weight, labels.charAt(next.ID), sameConsecutiveLabels));
        }
    }
    return NO_PATH_FOUND;
}

function createDirectedGraph(numberOfNodes: number, edges: number[][]): Node[][] {
    const directedGraph: Node[][] = Array.from(new Array(numberOfNodes), () => new Array());
    for (let i = 0; i < edges.length; ++i) {
        const from = edges[i][0];
        const to = edges[i][1];
        const weight = edges[i][2];
        directedGraph[from].push(new Node(to, weight));
    }
    return directedGraph;
}

class Node {
    constructor(public ID: number, public weight: number) {
    }
}

class Step {
    constructor(public ID: number, public weightFromStart: number, public label: string, public sameConsecutiveLabels: number) {
    }
}
