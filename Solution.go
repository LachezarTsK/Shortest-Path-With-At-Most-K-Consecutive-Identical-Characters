
package main

import (
    "container/heap"
    "math"
)

const NO_PATH_FOUND = -1

var startID int
var goalID int

func shortestPath(numberOfNodes int, edges [][]int, labels string, maxSameConsecutiveLabels int) int {
    goalID = numberOfNodes - 1
    var directedGraph [][]Node = createDirectedGraph(numberOfNodes, edges)
    return findShortestPath(directedGraph, labels, maxSameConsecutiveLabels)
}

func findShortestPath(directedGraph [][]Node, labels string, maxSameConsecutiveLabels int) int {
    minHeap := PriorityQueue{}
    heap.Push(&minHeap, Step{startID, 0, labels[startID], 1})
    minPathWeight := make([][]int, goalID + 1)

    for i := range minPathWeight {
        minPathWeight[i] = make([]int, maxSameConsecutiveLabels + 1)
        for j := range minPathWeight[i] {
            minPathWeight[i][j] = math.MaxInt
        }
    }
    minPathWeight[startID][1] = 0

    for minHeap.Len() > 0 {
        current := heap.Pop(&minHeap).(Step)
        if current.ID == goalID {
            return current.weightFromStart
        }

        for _, next := range directedGraph[current.ID] {
            if current.label == labels[next.ID] && current.sameConsecutiveLabels + 1 > maxSameConsecutiveLabels {
                continue
            }

            sameConsecutiveLabels := 1
            if current.label == labels[next.ID] {
                sameConsecutiveLabels += current.sameConsecutiveLabels
            }

            if current.weightFromStart + next.weight >= minPathWeight[next.ID][sameConsecutiveLabels] {
                continue
            }

            minPathWeight[next.ID][sameConsecutiveLabels] = current.weightFromStart + next.weight
            heap.Push(&minHeap, Step{next.ID, current.weightFromStart + next.weight, labels[next.ID], sameConsecutiveLabels})
        }
    }
    return NO_PATH_FOUND
}

func createDirectedGraph(numberOfNodes int, edges [][]int) [][]Node {
    directedGraph := make([][]Node, numberOfNodes)
    for node := range numberOfNodes {
        directedGraph[node] = []Node{}
    }

    for i := range edges {
        from := edges[i][0]
        to := edges[i][1]
        weight := edges[i][2]
        directedGraph[from] = append(directedGraph[from], Node{to, weight})
    }
    return directedGraph
}

type Node struct {
    ID     int
    weight int
}

type Step struct {
    ID                    int
    weightFromStart       int
    label                 byte
    sameConsecutiveLabels int
}

type PriorityQueue []Step

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    return pq[first].weightFromStart < pq[second].weightFromStart
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    step := object.(Step)
    *pq = append(*pq, step)
}

func (pq *PriorityQueue) Pop() any {
    step := (*pq)[pq.Len() - 1]
    *pq = (*pq)[0 : pq.Len() - 1]
    return step
}
