#include <bits/stdc++.h>
using namespace std;

int N;
vector<int> ad[200005];
int e[200005];

int dfs (int node) {
    int ans = 0;
    for (auto su : ad[node]) {
        ans += dfs(su) + 1;
    }

    e[node] = ans;
    return ans;
}

int main () {
    ios_base::sync_with_stdio(0); cin.tie(0);
    cin >> N;
    int a;
    for (int i = 2; i < N+1; i++) {
        cin >> a;
        ad[a].push_back(i);
    }

    dfs(1);
    for (int i = 1; i <= N; i++) {
        cout << e[i] << ' ';
    } cout << endl;
}
