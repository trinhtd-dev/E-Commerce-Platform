#include <iostream>
#include <vector>
#include <queue>
#include <tuple>

using namespace std;

int minDaysToGerminate(vector<vector<int>>& grid, int R, int C) {
    queue<tuple<int, int, int>> q; // (row, col, days)
    int directions[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    int days = 0;

    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            if (grid[i][j] == 2) {
                q.push({i, j, 0});
            }
        }
    }

    while (!q.empty()) {
        auto [x, y, day] = q.front();
        q.pop();
        days = max(days, day);

        for (auto& dir : directions) {
            int nx = x + dir[0];
            int ny = y + dir[1];

            if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx][ny] == 1) {
                grid[nx][ny] = 2;
                q.push({nx, ny, day + 1});
            }
        }
    }

    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            if (grid[i][j] == 1) {
                return -1;
            }
        }
    }

    return days;
}

int main() {
    int T;
    cin >> T;

    while (T--) {
        int R, C;
        cin >> R >> C;
        vector<vector<int>> grid(R, vector<int>(C));

        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                cin >> grid[i][j];
            }
        }

        int result = minDaysToGerminate(grid, R, C);
        cout << result << endl;
    }

    return 0;
}