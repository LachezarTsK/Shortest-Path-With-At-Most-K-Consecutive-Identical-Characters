
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

public class Solution {

    private record Node(int ID, int weight) {}

    private record Step(int ID, int weightFromStart, char label, int sameConsecutiveLabels) {}

    private static final int NO_PATH_FOUND = -1;
    private int startID;
    private int goalID;

    public int shortestPath(int numberOfNodes, int[][] edges, String labels, int maxSameConsecutiveLabels) {
        goalID = numberOfNodes - 1;
        List<Node>[] directedGraph = createDirectedGraph(numberOfNodes, edges);
        return findShortestPath(directedGraph, labels, maxSameConsecutiveLabels);
    }

    private int findShortestPath(List<Node>[] directedGraph, String labels, int maxSameConsecutiveLabels) {
        PriorityQueue<Step> minHeap = new PriorityQueue<>((x, y) -> x.weightFromStart - y.weightFromStart);
        minHeap.add(new Step(startID, 0, labels.charAt(startID), 1));

        int[][] minPathWeight = new int[goalID + 1][maxSameConsecutiveLabels + 1];
        for (int i = 0; i < minPathWeight.length; ++i) {
            Arrays.fill(minPathWeight[i], Integer.MAX_VALUE);
        }
        minPathWeight[startID][1] = 0;

        while (!minHeap.isEmpty()) {
            Step current = minHeap.poll();
            if (current.ID == goalID) {
                return current.weightFromStart;
            }

            for (Node next : directedGraph[current.ID]) {
                if (current.label == labels.charAt(next.ID) && current.sameConsecutiveLabels + 1 > maxSameConsecutiveLabels) {
                    continue;
                }

                int sameConsecutiveLabels = 1;
                if (current.label == labels.charAt(next.ID)) {
                    sameConsecutiveLabels += current.sameConsecutiveLabels;
                }

                if (current.weightFromStart + next.weight >= minPathWeight[next.ID][sameConsecutiveLabels]) {
                    continue;
                }

                minPathWeight[next.ID][sameConsecutiveLabels] = current.weightFromStart + next.weight;
                minHeap.add(new Step(next.ID, current.weightFromStart + next.weight, labels.charAt(next.ID), sameConsecutiveLabels));
            }
        }
        return NO_PATH_FOUND;
    }

    private List<Node>[] createDirectedGraph(int numberOfNodes, int[][] edges) {
        List<Node>[] directedGraph = new List[numberOfNodes];
        for (int node = 0; node < numberOfNodes; ++node) {
            directedGraph[node] = new ArrayList<>();
        }

        for (int i = 0; i < edges.length; ++i) {
            int from = edges[i][0];
            int to = edges[i][1];
            int weight = edges[i][2];
            directedGraph[from].add(new Node(to, weight));
        }
        return directedGraph;
    }
}
