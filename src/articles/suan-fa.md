---
title: '算法笔记'
date: '2025-07-21'
tags: ['C++', '算法']
excerpt: '以前打算法竞赛学习记录的笔记'
coverImage: ''
---

> 一些算法模板

# 数组
## 二分法
> 在单调性范围中找出符合条件的数，如单调递增的数组中找到第一个大于等于目标值的下标
>

### [left, right]
+ **更新逻辑**：
    - 如果目标值大于 `arr[mid]`，则 `left = mid + 1`
    - 如果目标值小于 `arr[mid]`，则 `right = mid - 1`
    - 如果目标值等于 `arr[mid]`，则返回 `mid` 或继续查找

```cpp
int l = 0, r = max;
while (l <= r) {
    int mid = (l + r) >> 1;
    if (a[mid] >= target) {
        ans = mid;
        r = mid - 1;
    } else {
        l = mid + 1;
    }
}
return ans;
```

### [left, right)
+ **更新逻辑**：
    - 如果目标值大于 `arr[mid]`，则 `left = mid + 1`
    - 如果目标值小于 `arr[mid]`，则 `right = mid`
    - 如果目标值等于 `arr[mid]`，则返回 `mid` 或继续查找

```cpp
int l = 0, r = max + 1;
while (l < r) {
    int mid = (l + r) >> 1;
    if (a[mid] < target) {
        l = mid + 1;
    } else {
        r = mid;
    }
}
return l;
```

## 前缀和和差分
### 一维差分
```cpp
long long a[100010], d[100010], prefix[100010];

int main()
{
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    int n, p, q;
    cin >> n >> p >> q;

    for (int i = 1; i <= n; i++)	cin >> a[i];
    for (int i = 1; i <= n; i++)	d[i] = a[i] - a[i - 1];

    int l, r, x;
    while (p--)
    {
        cin >> l >> r >> x;
        d[l] += x;
        d[r + 1] -= x;
    }

    for (int i = 1; i <= n; i++)
    {
        a[i] = d[i] + a[i - 1];
        prefix[i] = prefix[i - 1] + a[i];
    }

    while (q--)
    {
        cin >> l >> r;
        cout << prefix[r] - prefix[l - 1] << "\n";
    }
}
```

### 二维差分
```cpp
int n, m, k;
cin >> n >> m >> k;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        cin >> a[i][j];
        d[i][j] = a[i][j] - a[i - 1][j] - a[i][j - 1] + a[i - 1][j - 1];
    }
}
while (k--) {
    int x1, y1, x2, y2, v;
    cin >> x1 >> y1 >> x2 >> y2 >> v;
    d[x1][y1] += v;
    d[x2 + 1][y1] -= v;
    d[x1][y2 + 1] -= v;
    d[x2 + 1][y2 + 1] += v;
}
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        a[i][j] = a[i - 1][j] + a[i][j - 1] - a[i - 1][j - 1] + d[i][j];
    }
}
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        cout << a[i][j] << ' ';
    }
    cout << '\n';
}
```



## 树状数组
```cpp
ll a[N], c[N], c2[N];

// 树状数组 单点修改 区间查询
/*
题目描述
给定一个大小为n的数组a和q次操作。
每次操作分为下面两种：
"1 k v"：给ak加上v
"2 l r"：查询区间[l,r]的和。
对于每次2操作，输出结果。

输入格式
第一行两个整数n,q。(1≤n,q≤2×10^5)
第二行n个整数表示数组a(−10^5≤ai≤10^5)
接下来q行，每行一个操作。(1≤l≤r≤n,−10^5≤v≤10^5)

输出格式
对于每次2操作，在一行内输出结果。
*/
int n, m;
int low_bit(int num) { return num & -num; }
void updata(ll c[], int pos, int val) {
    while (pos <= n) {
        c[pos] += val;
        pos += low_bit(pos);
    }
}
ll get_sum(ll c[], int pos) {
    ll ans = 0;
    while (pos) {
        ans += c[pos];
        pos -= low_bit(pos);
    }
    return ans;
}
void solve() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) updata(c, i, a[i]);
    for (int i = 1; i <= m; i++) {
        int op;
        cin >> op;
        if (op == 1) {
            int k, v;
            cin >> k >> v;
            updata(c, k, v);
        } else {
            int l, r;
            cin >> l >> r;
            cout << get_sum(c, r) - get_sum(c, l - 1) << '\n';
        }
    }
}
// 树状数组 区间修改 单点查询
/*
修改a[l] a[r]，只需要updata : c[l] += v; c[r + 1] -= v;
单点查询对c进行get_sum即可
*/
// 树状数组 区间修改 区间查询
/*
题目描述
给定一个大小为n的数组a和q次操作。
每次操作分为下面两种：
"1 l r v"：给区间[l,r]加上v
"2 l r"：查询区间[l,r]的和。
对于每次2操作，输出结果。

输入格式
第一行两个整数n,q。(1≤n,q≤2×10^5)
第二行n个整数表示数组a(−10^5≤ai≤10^5)
接下来q行，每行一个操作。(1≤l≤r≤n,−10^5≤v≤10^5)

输出格式
对于每次2操作，在一行内输出结果。
*/
/*
c[i] = a[i] - a[i-1];
a[i] = c[i] + a[i-1];
sum(1, n)a
= a[1]+a[2]+a[3]+…+a[n-1]+a[n]
= c[1]+(c[1]+c[2])+…+(c[1]+c[2]+…+c[n])
= n*(c[1]+c[2]+…+c[n])-(0*c[1]+1*c[2]+2*c[3]+…+(n-1)*c[n]).
c2[i]=(i-1)*(a[i]-a[i-1])=(i-1)*c[i];
区间修改就有
updata(c[l], val); updata(c[r+1], -val);
updata(c2[l], (l-1)*v); updata(c2[r+1], -r*v);
求和时
sum1 = get_sum(c, r) * r - get_sum(c2,r);                           sum(1, r)
sum2 = get_sum(c, l - 1) * (l - 1) - get_sum(c2, l - 1);            sum(1, l -
1) 所以ans=sum1-sum2;                                                  sum(l, r)
*/
void solve2() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) {
        updata(c, i, a[i] - a[i - 1]);
        updata(c2, i, (i - 1) * (a[i] - a[i - 1]));
    }
    for (int i = 1; i <= m; i++) {
        int op, l, r;
        cin >> op >> l >> r;
        if (op == 1) {
            int v;
            cin >> v;
            updata(c, l, v);
            updata(c, r + 1, -v);
            updata(c2, l, (l - 1) * v);
            updata(c2, r + 1, -r * v);
        } else {
            ll sum1 = r * get_sum(c, r) - get_sum(c2, r);
            ll sum2 = (l - 1) * get_sum(c, l - 1) - get_sum(c2, l - 1);
            cout << sum1 - sum2 << '\n';
        }
    }
}
```

## 离散化
[我的很长，你算一下 | 星码StarryCoding](https://www.starrycoding.com/problem/63)
[求逆序对个数 | 星码StarryCoding](https://www.starrycoding.com/problem/31)

# 字符串
## KMP
```cpp
int *kmp_get_next(string &str)
{
    int *next = new int[str.size()];
    next[0] = 0;
    int left = 0, right = 1;
    while (right < str.size())
    {
        if (str[left] == str[right])
            next[right++] = ++left;
        else
        {
            if (left == 0)
                next[right] = 0, right++;
            else
                left = next[left - 1];
        }
    }
    return next;
}

int kmp_search(string &a, string &b, int *next)
{
    int i = 0, j = 0;
    while (i < a.size() && j < b.size())
    {
        if (a[i] == b[j])
            i++, j++;
        else
        {
            if (j == 0)
                i++;
            else
                j = next[j - 1];
        }
    }
    return j == b.size() ? i - j : -1;
}

int main()
{
    string a = "ABABDABACDABABCABAB";
    string b = "ABABCABAB";
    int *next = kmp_get_next(a);
    for (char ch : a)
        cout << ch << ' ';
    puts("");
    for (int i = 0; i < a.size(); i++)
        cout << next[i] << ' ';
    puts("");
    cout << kmp_search(a, b, next);
}
```

# 二叉树
## 递归遍历
```cpp
void traversal(TreeNode* cur, vector<int>& vec) {
    if (cur == NULL) return;
    traversal(cur->left, vec);  // 左
    traversal(cur->right, vec); // 右
    vec.push_back(cur->val);    // 中
}
```

## 统一迭代遍历
```cpp
vector<int> preorderTraversal(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    if (root != NULL) st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();
        if (node != NULL) {
            if (node->right) st.push(node->right);  // 右
            if (node->left) st.push(node->left);    // 左
            st.push(node);                          // 中
            st.push(NULL);
        } else {
            node = st.top();
            st.pop();
            result.push_back(node->val);
        }
    }
    return result;
}
```

## 层序遍历
```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    queue<TreeNode*> que;
    if (root != NULL) que.push(root);
    vector<vector<int>> result;
    while (!que.empty()) {
        int size = que.size();
        vector<int> vec;
        // 这里一定要使用固定大小size，不要使用que.size()，因为que.size是不断变化的
        for (int i = 0; i < size; i++) {
            TreeNode* node = que.front();
            que.pop();
            vec.push_back(node->val);
            if (node->left) que.push(node->left);
            if (node->right) que.push(node->right);
        }
        result.push_back(vec);
    }
    return result;
}
```

# 动态规划
## 背包问题
### 01背包
> 每件物品只能取一次，取或不取
>

**二维DP**

```cpp
for (int i = 1; i < w.size(); i++) {
    for (int j = 0; j <= bag_size; j++) {
        if (j < w[i]) dp[i][j] = dp[i - 1][j];
        else dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i]);
    }
}
```

两层for循环的遍历顺序可以颠倒

**一维DP**

求bag_size容量的背包可以装的最大价值是多少

```cpp
int v[N]. w[N];
int dp[N];
dp[0] = 1;
for (int i = 0; i < w.size(); i++) { // 第 i 个物品
    for (int j = bag_size; j >= w[i]; j--) { // 背包的容量为 j
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    }
}
return dp[w.size()];
```

求排列组合数

```cpp
int bag_size = (target + sum) / 2;
vector<int> dp(bag_size + 1, 0);
dp[0] = 1;
for (int i = 0; i < nums.size(); i++) {
    for (int j = bag_size; j >= nums[i]; j--) {
        dp[j] = dp[j] + dp[j - nums[i]];
        // 不选 nums[j] 的方法数为 dp[j]
        // 选 nums[j] 的方法数为 dp[j - nums[i]]
        // 即减去 nums[j] 的容量后的方法数
    }
}
return dp[bag_size];
```

### 完全背包
> 每件物品可以取无数次，不取或取几个
>

**二维DP**

```cpp
// 初始化第一个物品的价值
for (int j = w[0]; j <= bag_size; j++) {
    dp[0][j] = dp[0][j - w[0]] + v[0];
}

for (int i = 1; i < w.size(); i++) {
    for (int j = 0; j <= bag_size; j++) {
        if (j < w[i]) dp[i][j] = dp[i - 1][j];
        else dp[i][j] = max(dp[i - 1][j], dp[i][j - w[i]] + v[i]);
    }
}
```

遍历顺序无所谓

**一维DP**

```cpp
for (int i = 0; i < w.size(); i++) {
    for (int j = w[i]; j <= bag_size; j++) {
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    }
}
```

假如背包中有元素 1 5
如果先遍历背包中的元素再遍历背包容量，则有1 5，为组合数
如果先遍历背包容量再遍历背包中的元素，则有1 5和5 1，为排列数

> 记得求排列组合时 DP 是 += 之前的
>

### 多重背包
> 01背包的基础上加了每种物品的数量
>

```cpp
int bag_size, n; // 背包容量， 物品种类
vector<int> w(n); // 每种物品的重量
vector<int> v(n); // 每种物品的价值
vector<int> num(n); // 每种物品的数量
vector<int> dp(bag_size + 1, 0);
for (int i = 0; i < n; i++) { // 遍历每种物品
    for (int j = bag_size; j >= w[i]; j--) { // 遍历背包容量
        for (int k = 1; k <= num[i] && j >= k * w[i]; k++) { // 遍历物品的数量
            dp[j] = max(dp[j], dp[j - k * w[i]] + k * v[i]);
        }
    }
}
return dp[bag_size];
```

[多重背包问题的二进制优化解决方案,-CSDN博客](https://blog.csdn.net/2201_75859030/article/details/136793133)
这个还没看

## 树状DP
[337. 打家劫舍 III - 力扣（LeetCode）](https://leetcode.cn/problems/house-robber-iii/)

# 图论
## DFS
```cpp
vector<int> g[N];

bitset<N> vis;

void dfs(int x) {
    vis[x] = true;
    cout << x << ' ';
    for (auto &y : g[x]) {
        if (vis[y]) continue;
        dfs(y);
    }
}
```

## BFS
```cpp
void bfs(int st) {
    queue<int> q;
    q.push(st);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        cout << x << ' ';
        for (auto &y : g[x]) {
            if (vis[y]) continue;
            q.push(y);
        }
    }
}
```

### 最短路
```cpp
void bfs2(int sx, int sy) {  // 查找迷宫最短路
    memset(d, 0x3f, sizeof(d));
    d[sx][sy] = 0;
    queue<pair<int, int>> q;
    q.push({sx, sy});
    vis[sx][sy] = true;
    while (!q.empty()) {
        int x = q.front().first, y = q.front().second;
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nx = x + dir[i][0], ny = y + dir[i][1];
            if (nx > 0 && ny > 0 && nx <= n && ny <= m &&
                d[nx][ny] > d[x][y] + 1 && !mp[nx][ny] && !vis[nx][ny]) {
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
                vis[nx][ny] = true;
            }
        }
    }
}
```

## 并查集
```cpp
vector<int> fa = vector<int>(N, 0);

int n, m;

void init() {
    for (int i = 1; i <= n; i++) fa[i] = i;
}

int find(int u) {
    return u == fa[u] ? u : fa[u] = find(fa[u]);
}

bool isSame(int u, int v) {
    return find(u) == find(v);
}

void join(int u, int v) {
    fa[find(v)] = find(u);
}
```

## 最小生成树
### Prim
```cpp
int n, m; // 点，边
cin >> n >> m;

vector<vector<int>> grid(n + 1, vector<int>(n + 1, 10001));

while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    grid[a][b] = c;
    grid[b][a] = c; // 无向图
}

vector<int> minDist(n + 1, 10001);
vector<int> isInTree(n + 1, false);

for (int i = 1; i < n; i++) {
    int minVal = INT_MAX;
    int cur = -1;

    for (int j = 1; j <= n; j++) {
        if (!isInTree[j] && minDist[j] < minVal) {
            cur = j;
            minVal = minDist[j];
        }
    }

    isInTree[cur] = true;

    for (int j = 1; j <= n; j++) {
        if (!isInTree[j] && grid[cur][j] < minDist[j]) {
            minDist[j] = grid[cur][j];
        }
    }
}

int result = 0;
for (int i = 2; i <= n; i++) {
    result += minDist[i];
}

cout << result;
```

### Kruskal(常用)
```cpp
struct Edge {
    int l, r, val;
};

vector<int> fa(N);

void init(int n) {
    for (int i = 1; i <= n; i++) {
        fa[i] = i;
    }
}

int find(int x) {
    return fa[x] == x ? x : fa[x] = find(fa[x]);
}

bool isSame(int u, int v) {
    return find(u) == find(v);
}

void join(int u, int v) {
    fa[find(v)] = find(u);
}

int main() {
    int n, m;
    cin >> n >> m;

    init(n);
    vector<Edge> edges(n + 1);
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        edges.push_back({a, b, c});
    }

    sort(edges.begin(), edges.end(), [](const Edge &a, const Edge &b) { return a.val < b.val; });

    int result = 0;
    for (Edge edge : edges) {
        int x = find(edge.l);
        int y = find(edge.r);
        if (!isSame(x, y)) { // 一条边的两个节点祖先不同，则不在同一个集合（最小生成树）里
            result += edge.val;
            join(x, y);
        }
    }

    cout << result;
}
```

## 拓扑排序
```cpp
int main() {
    int n, m;
    cin >> n >> m;

    vector<int> inDegree(n, 0); // 0 ~ (n - 1)
    unordered_map<int, vector<int>> grid;
    while (m--) {
        int a, b;
        cin >> a >> b; // a -> b
        inDegree[b]++;
        grid[a].push_back(b); // a -> b -> ...
    }

    queue<int> que;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) {
            que.push(i);
        }
    }

    vector<int> result;
    while (!que.empty()) {
        int cur = que.front();
        que.pop();
        result.push_back(cur);

        if (grid[cur].size()) { // 如果 cur 还有后续节点
            for (int node : grid[cur]) {
                inDegree[node]--; // 后续节点的入度 -1
                if (inDegree[node] == 0) {
                    que.push(node);
                }
            }
        }
    }

    if (result.size() == n) {
        for (int val : result) {
            cout << val << ' ';
        }
    } else {
        cout << "-1";
    }
}
```

## dijkstra
### 原版(Prim)
```cpp
int n, m;
cin >> n >> m;

vector<vector<int>> grid(n + 1, vector<int>(n + 1, INT_MAX));
while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    grid[a][b] = c;
}

vector<int> minDist(n + 1, INT_MAX);
vector<bool> vis(n + 1, false);
minDist[1] = 0;
for (int i = 1; i <= n; i++) {
    int minVal = INT_MAX;
    int cur = 1;

    for (int j = 1; j <= n; j++) {
        if (!vis[j] && minDist[j] < minVal) {
            minVal = minDist[j];
            cur = j;
        }
    }

    vis[cur] = true;

    for (int j = 1; j <= n; j++) {
        if (!vis[j] && grid[cur][j] != INT_MAX && minDist[cur] + grid[cur][j] < minDist[j]) {
            minDist[j] = minDist[cur] + grid[cur][j];
        }
    }
}

cout << (minDist[n] == INT_MAX ? -1 : minDist[n]);
```

### 堆优化(常用)
```cpp
class cmp {
    public:
    bool operator()(const pair<int, int> &a, const pair<int, int> &b) {
        return a.second > b.second;
    }
};

struct Edge {
    int to, val;

    Edge(int to, int val) : to(to), val(val) {
    }
};

void solve() {
    int n, m;
    cin >> n >> m;

    vector<list<Edge>> grid(n + 1);
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        grid[a].push_back(Edge(b, c));
    }

    vector<int> minDist(n + 1, INT_MAX);
    vector<bool> visited(n + 1, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, cmp> pq;

    pq.push(pair<int, int>(1, 0));
    minDist[1] = 0;
    while (!pq.empty()) {
        // 节点，源点到节点的距离
        pair<int, int> cur = pq.top();
        pq.pop();
        if (visited[cur.first]) {
            continue;
        }

        visited[cur.first] = true;

        for (Edge edge : grid[cur.first]) { // 遍历 cur 指向的节点
            if (!visited[edge.to] && minDist[cur.first] + edge.val < minDist[edge.to]) {
                minDist[edge.to] = minDist[cur.first] + edge.val;
                pq.push(pair<int, int>(edge.to, minDist[edge.to]));
            }
        }
    }

    cout << (minDist[n] == INT_MAX ? -1 : minDist[n]);
}
```

## Bellman_ford
```cpp
int n, m;
cin >> n >> m;

vector<vector<int>> grid;
while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    grid.push_back({a, b, c});
}

vector<int> minDist(n + 1, INT_MAX);
minDist[1] = 0;
for (int i = 1; i < n; i++) {
    for (vector<int> &edge : grid) { // 0 -> 1, val: 2
        if (minDist[edge[0]] != INT_MAX && minDist[edge[0]] + edge[2] < minDist[edge[1]]) {
            minDist[edge[1]] = minDist[edge[0]] + edge[2];
        }
    }
}

if (minDist[n] == INT_MAX) {
    cout << "unconnected";
} else {
    cout << minDist[n];
}
```

## Bellman_ford_queue(SPFA)(常用)
```cpp
struct Edge {
    int to, val;

    Edge(int to, int val) : to(to), val(val) {
    }
};

void solve() {
    int n, m;
    cin >> n >> m;

    vector<list<Edge>> grid(n + 1);
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        grid[a].push_back(Edge(b, c));
    }

    queue<int> que;
    vector<bool> inQue(n + 1, false);
    vector<int> minDist(n + 1, INT_MAX);
    minDist[1] = 0;
    que.push(1);
    while (!que.empty()) {
        int cur = que.front();
        que.pop();
        inQue[cur] = false;
        for (Edge edge : grid[cur]) {
            if (minDist[cur] + edge.val < minDist[edge.to]) {
                minDist[edge.to] = minDist[cur] + edge.val;
                if (inQue[edge.to] == false) {
                    que.push(edge.to);
                    inQue[edge.to] = true;
                }
            }
        }
    }

    if (minDist[n] == INT_MAX) {
        cout << "unconnected";
    } else {
        cout << minDist[n];
    }
}
```

## Floyd
```cpp
int n, m, p1, p2, val;
cin >> n >> m;

vector<vector<int>> grid(n + 1, vector<int>(n + 1, 10005));  // 因为边的最大距离是10^4

for(int i = 0; i < m; i++){
    cin >> p1 >> p2 >> val;
    grid[p1][p2] = val;
    grid[p2][p1] = val; // 注意这里是双向图

}
// 开始 floyd
for (int k = 1; k <= n; k++) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            grid[i][j] = min(grid[i][j], grid[i][k] + grid[k][j]);
        }
    }
}
// 输出结果
int z, start, end;
cin >> z;
while (z--) {
    cin >> start >> end;
    if (grid[start][end] == 10005) cout << -1 << endl;
    else cout << grid[start][end] << endl;
}
```

## 最短路总结
| 算法 | 使用场景 |
| --- | --- |
| Dijkstra | 单源且边为正数 |
| Bellman-Ford | 单源边可为负数，有负权回路，有限节点最短路 |
| Floyd | 多源点求最短路 |


# 数论
## 常用数学算法总结
```cpp
bool isPrime(int n) {  // 判断质数
    if (n == 1) return false;
    for (int i = 2; i * i <= n / i; i++)
        if (n % i == 0) return false;
    return true;
}

void hasPrime(int n) {  // 区间质数
    vector<bool> vis(n + 1, false);
    vis[0] = vis[1] = true;
    for (int i = 2; i * i <= n; i++)
        if (!vis[i])
            for (int j = i * i; j <= n; j += i) vis[j] = true;
    for (int i = 2; i <= n; i++)
        if (!vis[i]) cout << i << ' ';
}

void hasFactor(int n) {  // 区间因数
    vector<int> res;
    for (int i = 1; i <= n / i; i++) {
        if (n % i) continue;
        res.push_back(i);
        if (i != n / i) res.push_back(n / i);
    }
    sort(res.begin(), res.end());
}

void has(int n) {  // 区间质因数
    vector<int> res;
    for (int i = 2; i <= n / 2; i++) {
        if (n % i) continue;
        res.push_back(i);
        while (n % i == 0) n /= i;
    }
    if (n > 1) res.push_back(n);
}

ll gcd(ll a, ll b) {  // 最大公约数
    a = abs(a);
    b = abs(b);
    while (b) {
        ll temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

ll lcm(ll a, ll b) {  // 最小公倍数
    a = abs(a);
    b = abs(b);
    if (!a || !b) return 0;
    return (a / gcd(a, b)) * b;
}

ll fastPow(ll a, ll b, ll p) {  // 快速幂
    ll res = 1 % p;
    a %= p;
    while (b) {
        if (b & 1) res = (res * a) % p;
        a = (a * a) % p;
        b >>= 1;
    }
    return res;
}
// 费马小定理
ll inv(ll a, ll p) { return (fastPow(a, p - 2, p) % p + p) % p; }
```

## 高精度
```cpp
class hp {
public:
    vector<int> a;
    void deleteZero(vector<int>& a) {
        for (int i = a.size() - 1; i >= 0; i--) {
            if (a[i] != 0) break;
            a.pop_back();
        }
        if (a.empty()) a.push_back(0);
    }
    hp() { a.push_back(0); }
    hp(int num) {
        a.clear();
        if (num == 0) {
            a.push_back(0);
            return;
        }
        while (num) {
            a.push_back(num % 10);
            num /= 10;
        }
    }
    hp(string& str) {
        a.clear();
        if (str == "0") {
            a.push_back(0);
            return;
        }
        for (int i = str.size() - 1; i >= 0; i--) {
            a.push_back(str[i] - '0');
        }
        deleteZero(a);
    }
    hp operator+(const hp& x) {
        hp res;
        int len = a.size() > x.a.size() ? a.size() : x.a.size();
        int carry = 0;
        for (int i = 0; i < len; i++) {
            if (i < a.size()) carry += a[i];
            if (i < x.a.size()) carry += x.a[i];
            res.a.push_back(carry % 10);
            carry /= 10;
        }
        if (carry) res.a.push_back(carry);
        deleteZero(res.a);
        return res;
    }
    hp operator-(const hp& x) {  // 假定减完不会为负数
        hp res;
        res.a.resize(a.size());
        int carry = 0;
        for (int i = 0; i < a.size(); i++) {
            int num = a[i] - carry;
            if (i < x.a.size()) num -= x.a[i];
            if (num < 0) num += 10, carry = 1;
            res.a[i] = num;
        }
        deleteZero(res.a);
        return res;
    }
    hp operator*(const hp& x) {
        hp res;
        res.a.resize(a.size() + x.a.size());
        for (int i = 0; i < a.size(); i++)
            for (int j = 0; j < x.a.size(); j++) res.a[i + j] += a[i] * x.a[j];
        for (int i = 0; i < res.a.size(); i++)
            if (res.a[i] >= 10) res.a[i + 1] += res.a[i] / 10, res.a[i] %= 10;
        deleteZero(res.a);
        return res;
    }
    hp operator/(const ll& x) {
        hp res;
        int carry = 0;
        for (int i = a.size() - 1; i >= 0; i--) {
            carry += a[i];
            if (carry / x) res.a.push_back(carry / x);
            carry %= x;
            carry *= 10;
        }
        reverse(res.a.begin(), res.a.end());
        return res;
    }
    short cmp(const hp& x) {
        if (a.size() > x.a.size()) return 1;
        if (a.size() < x.a.size()) return -1;
        for (int i = a.size() - 1; i >= 0; i--) {
            if (a[i] > x.a[i]) return 1;
            if (a[i] < x.a[i]) return -1;
        }
        return 0;
    }
    bool operator>(const hp& x) { return cmp(x) == 1; }
    bool operator<(const hp& x) { return cmp(x) == -1; }
    bool operator==(const hp& x) { return cmp(x) == 0; }
};
```



# 一些例子
### 最长递增子序列
**二分法(O(n log n))**

```cpp
int LIS(vector<int>& nums) {
    vector<int> d;  // 维护一个递增序列
    for (int x : nums) {
        auto it = lower_bound(d.begin(), d.end(), x);  // 二分查找x的插入位置
        if (it == d.end()) {
            d.push_back(x);  // 如果x大于d中的所有元素，追加到d的末尾
        } else {
            *it = x;  // 否则，更新d中的对应位置
        }
    }
    return d.size();  // d的长度即为LIS的长度
}
```

### 最长公共子序列
**二维DP(O(n^2))**

```cpp
int longestCommonSubsequence(string text1, string text2) {
    vector<vector<int>> dp(text1.size() + 1, vector<int>(text2.size() + 1, 0));
    for (int i = 1; i <= text1.size(); i++) {
        for (int j = 1; j <= text2.size(); j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[text1.size()][text2.size()];
}
```

**一维DP(O(n^2))**

```cpp
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    cin >> a[i];
}
for (int i = 0; i < n; i++) {
    cin >> b[i];
}
for (int i = 1; i <= n; i++) {
    // 上一个位置最长公共子序列的长度
    int pre = 0;
    for (int j = 1; j <= n; j++) {
        // 当前位置最长公共子序列的长度
        int cur = dp[j];
        if (a[i - 1] == b[j - 1]) {
            dp[j] = pre + 1;
        } else {
            dp[j] = max(dp[j], dp[j - 1]);
        }
        pre = cur;
    }
}
cout << dp[n];
```

**数据量过大时的处理方法O(n log n)**

1. **建立位置映射**：记录第二个排列中每个元素的位置。
2. **转换为LIS问题**：将第一个排列中的元素转换为它们在第二个排列中的位置，得到一个新的序列。
3. **求解LIS**：在新的序列中找到最长递增子序列，其长度即为原问题的解。

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    for (int i = 0; i < n; ++i) cin >> b[i];

    vector<int> pos(n + 1); // pos[x]表示x在b中的位置
    for (int i = 0; i < n; ++i) {
        pos[b[i]] = i + 1; // 位置是i+1（1-based索引）
    }

    vector<int> seq(n);
    for (int i = 0; i < n; ++i) {
        seq[i] = pos[a[i]];
    }

    vector<int> d;
    for (int x : seq) {
        auto it = lower_bound(d.begin(), d.end(), x);
        if (it == d.end()) {
            d.push_back(x);
        } else {
            *it = x;
        }
    }

    cout << d.size() << endl;

    return 0;
}
```
