
#include <queue>
#include <vector>
#include <limits>
#include <string>
#include <string_view>
using namespace std;

class Solution {

    struct Node {
        int ID{};
        int weight{};

        Node(int ID, int weight) : ID{ ID }, weight{ weight } {}
    };

    struct Step {
        int ID{};
        int weightFromStart{};
        char label{};
        int sameConsecutiveLabels{};

        Step(int ID, int weightFromStart, char label, int sameConsecutiveLabels) :
            ID{ ID }, weightFromStart{ weightFromStart }, label{ label }, sameConsecutiveLabels{ sameConsecutiveLabels } {}
    };

    struct Comparator {
        bool operator()(const Step& x, const Step& y)const {
            return x.weightFromStart > y.weightFromStart;
        }
    };

    static const int NO_PATH_FOUND = -1;
    int startID{};
    int goalID{};

public:
    int shortestPath(int numberOfNodes, vector<vector<int>>& edges, string labels, int maxSameConsecutiveLabels) {
        goalID = numberOfNodes - 1;
        vector<vector<Node>> directedGraph = createDirectedGraph(numberOfNodes, edges);
        return findShortestPath(directedGraph, labels, maxSameConsecutiveLabels);
    }

private:
    int findShortestPath(const vector<vector<Node>>& directedGraph, string_view labels, int maxSameConsecutiveLabels) {
        priority_queue<Step, vector<Step>, Comparator> minHeap;
        minHeap.emplace(startID, 0, labels[startID], 1);

        vector<vector<int>> minPathWeight(goalID + 1, vector<int>(maxSameConsecutiveLabels + 1, numeric_limits<int>::max()));
        minPathWeight[startID][1] = 0;

        while (!minHeap.empty()) {
            Step current = minHeap.top();
            minHeap.pop();

            if (current.ID == goalID) {
                return current.weightFromStart;
            }

            for (Node next : directedGraph[current.ID]) {
                if (current.label == labels[next.ID] && current.sameConsecutiveLabels + 1 > maxSameConsecutiveLabels) {
                    continue;
                }

                int sameConsecutiveLabels = 1;
                if (current.label == labels[next.ID]) {
                    sameConsecutiveLabels += current.sameConsecutiveLabels;
                }

                if (current.weightFromStart + next.weight >= minPathWeight[next.ID][sameConsecutiveLabels]) {
                    continue;
                }

                minPathWeight[next.ID][sameConsecutiveLabels] = current.weightFromStart + next.weight;
                minHeap.emplace(next.ID, current.weightFromStart + next.weight, labels[next.ID], sameConsecutiveLabels);
            }
        }
        return NO_PATH_FOUND;
    }

    vector<vector<Node>> createDirectedGraph(int numberOfNodes, const vector<vector<int>>& edges) const {
        vector<vector<Node>> directedGraph(numberOfNodes);

        for (int i = 0; i < edges.size(); ++i) {
            int from = edges[i][0];
            int to = edges[i][1];
            int weight = edges[i][2];
            directedGraph[from].emplace_back(to, weight);
        }
        return directedGraph;
    }
};
