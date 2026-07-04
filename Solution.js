
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

/**
 * @param {number} numberOfNodes
 * @param {number[][]} edges
 * @param {string} labels
 * @param {number} maxSameConsecutiveLabels
 * @return {number}
 */
var shortestPath = function (numberOfNodes, edges, labels, maxSameConsecutiveLabels) {
    const directedGraph = createDirectedGraph(numberOfNodes, edges);
    return findShortestPath(directedGraph, labels, maxSameConsecutiveLabels);
};

/**
 * @param {Node[][]} directedGraph
 * @param {string} labels
 * @param {number} maxSameConsecutiveLabels
 * @return {number}
 */
function findShortestPath(directedGraph, labels, maxSameConsecutiveLabels) {
    const  startID = 0;
    const goalID = directedGraph.length - 1;
    const NO_PATH_FOUND = -1;

    const minHeap = new PriorityQueue((x, y) => x.weightFromStart - y.weightFromStart);
    minHeap.enqueue(new Step(startID, 0, labels.charAt(startID), 1));

    const minPathWeight = Array.from(new Array(goalID + 1), () => new Array(maxSameConsecutiveLabels + 1).fill(Number.MAX_SAFE_INTEGER));
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

/**
 * @param {number} numberOfNodes
 * @param {number[][]} edges
 * @return {Node[][]} sameConsecutiveLabels
 */
function createDirectedGraph(numberOfNodes, edges) {
    const directedGraph = Array.from(new Array(numberOfNodes), () => new Array());
    for (let i = 0; i < edges.length; ++i) {
        const from = edges[i][0];
        const to = edges[i][1];
        const weight = edges[i][2];
        directedGraph[from].push(new Node(to, weight));
    }
    return directedGraph;
}

/**
 * @param {number} ID
 * @param {number} weight
 */
function Node(ID, weight) {
    this.ID = ID;
    this.weight = weight;
}

/**
 * @param {number} ID
 * @param {number} weightFromStart
 * @param {string} label
 * @param {number} sameConsecutiveLabels
 */
function Step(ID, weightFromStart, label, sameConsecutiveLabels) {
    this.ID = ID;
    this.weightFromStart = weightFromStart;
    this.label = label;
    this.sameConsecutiveLabels = sameConsecutiveLabels;
}
