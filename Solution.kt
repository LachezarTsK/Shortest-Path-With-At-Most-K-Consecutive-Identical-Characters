
class Solution {

    private data class Node(val ID: Int, val weight: Int) {}

    private data class Step(val ID: Int, val weightFromStart: Int, val label: Char, val sameConsecutiveLabels: Int) {}

    private companion object {
        const val NO_PATH_FOUND = -1
    }

    private var startID = 0
    private var goalID = 0

    fun shortestPath(numberOfNodes: Int, edges: Array<IntArray>, labels: String, maxSameConsecutiveLabels: Int): Int {
        goalID = numberOfNodes - 1
        val directedGraph = createDirectedGraph(numberOfNodes, edges)
        return findShortestPath(directedGraph, labels, maxSameConsecutiveLabels)
    }

    private fun findShortestPath(directedGraph: Array<MutableList<Node>>, labels: String, maxSameConsecutiveLabels: Int): Int {
        val minHeap = java.util.PriorityQueue<Step>() { x, y -> x.weightFromStart - y.weightFromStart }
        minHeap.add(Step(startID, 0, labels[startID], 1))

        val minPathWeight = Array<IntArray>(goalID + 1) { IntArray(maxSameConsecutiveLabels + 1) { Int.MAX_VALUE } }
        minPathWeight[startID][1] = 0

        while (!minHeap.isEmpty()) {
            val current = minHeap.poll()
            if (current.ID == goalID) {
                return current.weightFromStart
            }

            for (next in directedGraph[current.ID]) {
                if (current.label == labels[next.ID] && current.sameConsecutiveLabels + 1 > maxSameConsecutiveLabels) {
                    continue
                }

                var sameConsecutiveLabels = 1
                if (current.label == labels[next.ID]) {
                    sameConsecutiveLabels += current.sameConsecutiveLabels
                }

                if (current.weightFromStart + next.weight >= minPathWeight[next.ID][sameConsecutiveLabels]) {
                    continue
                }

                minPathWeight[next.ID][sameConsecutiveLabels] = current.weightFromStart + next.weight
                minHeap.add(Step(next.ID, current.weightFromStart + next.weight, labels[next.ID], sameConsecutiveLabels))
            }
        }
        return NO_PATH_FOUND
    }

    private fun createDirectedGraph(numberOfNodes: Int, edges: Array<IntArray>): Array<MutableList<Node>> {
        val directedGraph = Array<MutableList<Node>>(numberOfNodes) { mutableListOf<Node>() }
        for (i in edges.indices) {
            val from = edges[i][0]
            val to = edges[i][1]
            val weight = edges[i][2]
            directedGraph[from].add(Node(to, weight))
        }
        return directedGraph
    }
}
