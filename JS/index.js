window.onload = function () {
    let Kru = document.querySelector("#Kruskal2");
    Kru.onclick=Kruskal;
    let Refresh = document.querySelector("#Refresh");
    Refresh.onclick = Restart;

    let Graph = {};//图
    Graph.Vertices = [];//顶点集
    Graph.Edges = [];//边集

//添加顶点
    function _add_vertex(vertex) {
        let V = {};
        V.element = vertex;//顶点样式
        V.Adj = [];//终点集
        V.visited = false;//未访问过
        V.discovered = false;//未被探索过
        Graph.Vertices.push(V);
    }

//添加边
    function _add_edge(startPoint, endPoint, line, weight) {
        let edge = {};
        edge.startPoint = startPoint;//起点
        edge.endPoint = endPoint;//终点
        edge.weight = weight;//边权
        edge.line = line;//用于确定边的样式

        Graph.Edges.push(edge);

        let s = get_graph_vertex(startPoint);
        let d = get_graph_vertex(endPoint);

        if (check_duplicates_in_Adj(s, d)) {//检查是否有重复边，不允许添加重复边
            s.Adj.push(d);
            d.Adj.push(s);
        } else {
            alert("边已经存在了，不能有多条边！");
            line.parentNode.removeChild(line);
        }
    }

//检查是否有重复边
    function check_duplicates_in_Adj(u, v) {
        for (let i = 0; i < Graph.Vertices.length; i++) {
            for (let j = 0; j < Graph.Vertices.length; j++) {
                if (Graph.Vertices[i] === u && Graph.Vertices[i].Adj[j] === v) {
                    return false;
                }
            }
        }
        return true;
    }

//通过id获取边源节点和目标节点对应的节点对象
    function get_graph_vertex(div) {
        for (let i = 0; i < Graph.Vertices.length; i++) {
            if (Graph.Vertices[i].element.id === div.id) {
                return Graph.Vertices[i];
            }
        }
    }

//显示图的边
    function _show_edges() {
        for (let i = 0; i < this.Edges.length; i++) {
            alert(this.Edges[i].weight);
        }
    }

//显示图的顶点
    function _show_vertices() {
        let s = "";
        for (let i = 0; i < this.Vertices.length; i++) {
            s = s + this.Vertices[i].element.id + " : ";
            for (let j = 0; j < this.Vertices[i].Adj.length; j++) {
                s = s + this.Vertices[i].Adj[j].element.id + "--";
            }
            s = s + "\n";
        }
        alert(s);
    }

//获取边的权重
    function _weight(startPoint, endPoint) {
        let s = startPoint.element.id;
        let d = endPoint.element.id;
        for (let i = 0; i < Graph.Edges.length; i++) {
            if ((Graph.Edges[i].startPoint.id === s && Graph.Edges[i].endPoint.id === d) ||
                (Graph.Edges[i].endPoint.id === s && Graph.Edges[i].startPoint.id === d)) {
                return Graph.Edges[i].weight;
            }
        }
    }

//添加顶点
    Graph.add_vertex = _add_vertex;
//添加边
    Graph.add_edge = _add_edge;
//显示图的顶点
    Graph.show_vertices = _show_vertices;
//显示图的边
    Graph.show_edges = _show_edges;
//获取边的权重
    Graph.weight = _weight;

    for (let i = 0; i < 5; i++) {
        addV(i);
    }
    addE(1, 2, 13);
    addE(2, 4, 67);
    addE(4, 5, 67);
    addE(5, 3, 11);
    addE(3, 1, 83);
    addE(1, 4, 67);
    addE(1, 5, 73);
    addE(2, 3, 32);
    addE(3, 4, 81);
    addE(2, 5, 45);

    function addV(count) {
        let str = "#" + String.fromCharCode(97 + count);
        let divs = document.querySelector(str);
        Graph.add_vertex(divs);
    }

    function addE(start, end, weight) {
        let str1 = "#" + String.fromCharCode(97 + start - 1);
        let str2 = "#" + String.fromCharCode(97 + end - 1);
        let str3 = "#edge_" + start + "_" + end;
        let start_div = document.querySelector(str1);
        let end_div = document.querySelector(str2);
        let line = document.querySelector(str3)
        Graph.add_edge(start_div, end_div, line, weight);
    }

//kruskal实现
//插入边
    function _insert(edge) {
        this._data.push(edge);
        this._size = this._size + 1;
    }

//找到最小点
    function _extract_min() {
        let i;
        let min = 0;
        //找出距离最小的点
        for (i = 0; i < this._data.length; i++) {
            if (parseInt(this._data[i].weight) < parseInt(this._data[min].weight)) {
                min = i;
            }
        }
        let last = this._data.length - 1;

        let temp = this._data[last];//最后一个节点
        this._data[last] = this._data[min];//修改最后一个节点为最小值
        this._data[min] = temp;//交换位置
        this._size = this._size - 1;

        let deleted = this._data[last];//最后一个节点
        this._data.pop();

        return deleted;
    }

//是否为空
    function _is_empty() {
        return this._size === 0;
    }

//创建一个优先级队列
    let PriorityQueue = {};
    PriorityQueue._data = [];
    PriorityQueue._size = 0;

    PriorityQueue.is_empty = _is_empty;
    PriorityQueue.insert = _insert;
    PriorityQueue.extract_min = _extract_min;

    let MST = {};
    MST.Vertices = [];
    MST.edge_count = 0;

//向MST加入顶点
    function MST_add_vertex(n) {
        let MSTVertex = {};
        MSTVertex._name = n;
        MSTVertex.Adj = [];//终点集
        MSTVertex.visited = false;
        MST.Vertices.push(MSTVertex);

        return MSTVertex;
    }

//向MST加入边
    function MST_add_edge(startPoint, endPoint) {
        if (MST_check_duplicates(startPoint, endPoint)) {
            startPoint.Adj.push(endPoint);
            endPoint.Adj.push(startPoint);
            this.edge_count = this.edge_count + 1;
        }
    }

//检查是否存在该边
    function MST_check_duplicates(u, v) {
        for (let i = 0; i < MST.Vertices.length; i++) {
            if (MST.Vertices[i] === u) {
                for (let j = 0; j < MST.Vertices.length; j++) {
                    if (MST.Vertices[i].Adj[j] === v) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

//从MST中获取顶点
    function MST_get_vertex(n) {
        for (let i = 0; i < MST.Vertices.length; i++) {
            if (MST.Vertices[i]._name === n) {
                return MST.Vertices[i];
            }
        }
    }

    MST.add_vertex = MST_add_vertex;
    MST.add_edge = MST_add_edge;
    MST.get_vertex = MST_get_vertex;

//是否形成环
    function creates_cycle(edge) {
        let s = edge.startPoint.id;
        let d = edge.endPoint.id;

        let ufound = false;
        let vfound = false;

        //是否存在这个起点
        for (let i = 0; i < MST.Vertices.length; i++) {
            if (MST.Vertices[i]._name === s) {
                ufound = true;
                break;
            }
        }

        //是否存在这个终点
        for (let i = 0; i < MST.Vertices.length; i++) {
            if (MST.Vertices[i]._name === d) {
                vfound = true;
                break;
            }
        }

        if (ufound === true && vfound === true) {
            let u = MST_get_vertex(s);
            let v = MST_get_vertex(d);
            let result = MST_DFS(u, v);
            //如果通过u进行dfs到了v，说明会形成环
            if (result === false) {
                //没形成环，就加入这条边
                new MST_add_edge(u, v);
            }
            return result;
        } else if (ufound === false && vfound === false) {
            //如果都没找到，就加入这两点并加入边
            let u = MST.add_vertex(s);
            let v = MST.add_vertex(d);
            MST.add_edge(u, v);
            return false;
        } else if (ufound === true && vfound === false) {
            let u = MST.get_vertex(s);
            let v = MST.add_vertex(d);
            MST.add_edge(u, v);
            return false;
        } else if (ufound === false && vfound === true) {
            let u = MST.add_vertex(s);
            let v = MST.get_vertex(d);
            MST.add_edge(u, v);
            return false;
        }
        //否则，返回true
        return true;
    }

//dfs
    function MST_DFS(u, d) {
        u.visited = true;
        for (let i = 0; i < MST.Vertices.length; i++) {
            //初始化为false
            MST.Vertices[i].visited = false;
        }
        MST_DFS_Visit(u);
        return d.visited === true;
    }

//dfs_visit
    function MST_DFS_Visit(u) {
        for (let j = 0; j < u.Adj.length; j++) {
            let v = u.Adj[j];
            if (v.visited === false) {
                v.visited = true;
                MST_DFS_Visit(v);
            }
        }
    }

    function Kruskal() {
        let count = 0;
        for (let i = 0; i < Graph.Edges.length; i++) {
            PriorityQueue.insert(Graph.Edges[i]);
        }

        //kruskal
        while (MST.edge_count !== Graph.Vertices.length - 1) {
            let e = PriorityQueue.extract_min();//边集中的最小值
            if (!creates_cycle(e)) {
                //如果不成环，颜色为绿色
                color_edge(e, count, "#8cff66");
            } else {
                //否则颜色为橙色
                color_edge(e, count, "#ff9933");
            }
            count = count + 1;
        }
    }

//给边染色
    function color_edge(edge, count, color) {
        let edge_line = edge.line;
        edge_line.style.transitionDelay = count + "s";
        edge_line.style.backgroundColor = color;
        edge_line.color = "white";
    }

    function Restart() {
        let i;
        for (i = 0; i < Graph.Vertices.length; i++) {
            Graph.Vertices[i].element.style.transitionDelay = "0s";
            Graph.Vertices[i].element.style.backgroundColor = "white";
        }

        for (i = 0; i < Graph.Edges.length; i++) {
            Graph.Edges[i].line.style.transitionDelay = "0s";
            Graph.Edges[i].line.style.backgroundColor = "black";
            Graph.Edges[i].line.style.color = "black";
        }

        while (MST.Vertices.length !== 0) {
            MST.Vertices.pop();
        }
        MST.edge_count = 0;
        while (PriorityQueue._size > 0 || !PriorityQueue.is_empty()) {
            if (PriorityQueue.is_empty() || (PriorityQueue._size <= 0)) {
                break;
            }
            PriorityQueue.extract_min();
        }
    }
}