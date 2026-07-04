
using System;
using System.Collections.Generic;

public class Solution
{
    private record Node(int ID, int Weight) { }

    private record Step(int ID, int WeightFromStart, char Label, int SameConsecutiveLabels) { }

    private readonly static int NO_PATH_FOUND = -1;
    private int startID;
    private int goalID;

    public int ShortestPath(int numberOfNodes, int[][] edges, string labels, int maxSameConsecutiveLabels)
    {
        goalID = numberOfNodes - 1;
        List<Node>[] directedGraph = CreateDirectedGraph(numberOfNodes, edges);
        return FindShortestPath(directedGraph, labels, maxSameConsecutiveLabels);
    }

    private int FindShortestPath(List<Node>[] directedGraph, string labels, int maxSameConsecutiveLabels)
    {
        PriorityQueue<Step, int> minHeap = new(Comparer<int>.Create((xWeightFromStart, yWeightFromStart) => xWeightFromStart - yWeightFromStart));
        minHeap.Enqueue(new Step(startID, 0, labels[startID], 1), 0);

        int[][] minPathWeight = new int[goalID + 1][];
        for (int i = 0; i < minPathWeight.Length; ++i)
        {
            minPathWeight[i] = new int[maxSameConsecutiveLabels + 1];
            Array.Fill(minPathWeight[i], int.MaxValue);
        }
        minPathWeight[startID][1] = 0;

        while (minHeap.Count > 0)
        {
            Step current = minHeap.Dequeue();
            if (current.ID == goalID)
            {
                return current.WeightFromStart;
            }

            foreach (Node next in directedGraph[current.ID])
            {
                if (current.Label == labels[next.ID] && current.SameConsecutiveLabels + 1 > maxSameConsecutiveLabels)
                {
                    continue;
                }

                int sameConsecutiveLabels = 1;
                if (current.Label == labels[next.ID])
                {
                    sameConsecutiveLabels += current.SameConsecutiveLabels;
                }

                if (current.WeightFromStart + next.Weight >= minPathWeight[next.ID][sameConsecutiveLabels])
                {
                    continue;
                }

                minPathWeight[next.ID][sameConsecutiveLabels] = current.WeightFromStart + next.Weight;
                minHeap.Enqueue(new Step(next.ID, current.WeightFromStart + next.Weight, labels[next.ID], sameConsecutiveLabels)
                    , current.WeightFromStart + next.Weight);
            }
        }
        return NO_PATH_FOUND;
    }

    private List<Node>[] CreateDirectedGraph(int numberOfNodes, int[][] edges)
    {
        List<Node>[] directedGraph = new List<Node>[numberOfNodes];
        for (int node = 0; node < numberOfNodes; ++node)
        {
            directedGraph[node] = [];
        }

        for (int i = 0; i < edges.Length; ++i)
        {
            int from = edges[i][0];
            int to = edges[i][1];
            int weight = edges[i][2];
            directedGraph[from].Add(new Node(to, weight));
        }
        return directedGraph;
    }
}
