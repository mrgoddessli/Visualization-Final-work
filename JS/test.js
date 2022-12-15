window.onload = function () {
    {
        let Kru = document.querySelector("#dd");
        Kru.onclick = Kruskal;
        let Refresh = document.querySelector("#ee");
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

    {
        let Kru = document.querySelector("#aa");
        Kru.onclick = Kruskal2;
        let Refresh = document.querySelector("#bb");
        Refresh.onclick = Restart2;
        let CleanUp = document.querySelector("#cc");
        CleanUp.onclick = CleanCanvas2;
        document.getElementById("canvas2").addEventListener("dblclick", create_vertex2);
        let count2 = 0;
        let Graph2 = {};//图

        Graph2.Vertices = [];//顶点集
        Graph2.Edges = [];//边集


//添加顶点
        function _add_vertex2(vertex) {
            let V = {};
            V.element = vertex;//顶点样式
            V.Adj = [];//终点集
            V.visited = false;//未访问过
            V.discovered = false;//未被探索过
            Graph2.Vertices.push(V);
        }

//添加边
        function _add_edge2(startPoint, endPoint, line, weight) {
            let edge = {};
            edge.startPoint = startPoint;//起点
            edge.endPoint = endPoint;//终点
            edge.weight = weight;//边权
            edge.line = line;//用于确定边的样式

            Graph2.Edges.push(edge);

            let s = get_graph_vertex2(startPoint);
            let d = get_graph_vertex2(endPoint);

            if (check_duplicates_in_Adj2(s, d)) {//检查是否有重复边，不允许添加重复边
                s.Adj.push(d);
                d.Adj.push(s);
            } else {
                alert("边已经存在了，不能有多条边！");
                line.parentNode.removeChild(line);
            }
        }

//检查是否有重复边
        function check_duplicates_in_Adj2(u, v) {
            for (let i = 0; i < Graph2.Vertices.length; i++) {
                for (let j = 0; j < Graph2.Vertices.length; j++) {
                    if (Graph2.Vertices[i] === u && Graph2.Vertices[i].Adj[j] === v) {
                        return false;
                    }
                }
            }
            return true;
        }

//通过id获取边源节点和目标节点对应的节点对象
        function get_graph_vertex2(div) {
            for (let i = 0; i < Graph2.Vertices.length; i++) {
                if (Graph2.Vertices[i].element.id === div.id) {
                    return Graph2.Vertices[i];
                }
            }
        }

//显示图的边
        function _show_edges2() {
            for (let i = 0; i < this.Edges.length; i++) {
                alert(this.Edges[i].weight);
            }
        }

//显示图的顶点
        function _show_vertices2() {
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
        function _weight2(startPoint, endPoint) {
            let s = startPoint.element.id;
            let d = endPoint.element.id;
            for (let i = 0; i < Graph2.Edges.length; i++) {
                if ((Graph2.Edges[i].startPoint.id === s && Graph2.Edges[i].endPoint.id === d) ||
                    (Graph2.Edges[i].endPoint.id === s && Graph2.Edges[i].startPoint.id === d)) {
                    return Graph2.Edges[i].weight;
                }
            }
        }

//添加顶点
        Graph2.add_vertex2 = _add_vertex2;
//添加边
        Graph2.add_edge2 = _add_edge2;
//显示图的顶点
        Graph2.show_vertices2 = _show_vertices2;
//显示图的边
        Graph2.show_edges2 = _show_edges2;
//获取边的权重
        Graph2.weight2 = _weight2;

//样式部分
        let start_x2 = null;
        let start_y2 = null;
        let start_div2 = null;

        let end_x2 = null;
        let end_y2 = null;
        let end_div2 = null;

//在HTML中创建节点
        function create_vertex2(e) {
            let x = parseInt(e.clientX);//当前X
            x = x - 10;
            let y = parseInt(e.clientY);//当前Y
            y = y - 50;

            let canvas = document.getElementById("canvas2");
            x = x - canvas.offsetLeft + document.body.scrollLeft - (window.innerWidth - 600) / 2;
            y = y - canvas.offsetTop + document.body.scrollTop;
            let X = x / canvas.offsetWidth;
            let Y = y / canvas.offsetHeight;
            let div = document.createElement("div");//创建div
            let div_text = document.createElement("p");//创建p

            count2 = count2 + 1;

            div.style.zIndex = "2";//等级
            div.style.position = "absolute";//绝对定位
            div.id = count2;//第count个节点
            div_text.innerHTML = count2;//显示内容
            div_text.style.position = "relative";//相对定位
            div_text.style.marginLeft = "15px";//左边距15像素
            div_text.style.marginTop = "10px";//上边距10像素
            div.style.backgroundColor = "white";//背景白色
            div.style.border = "2px solid #404040";//边框颜色
            div.style.borderRadius = "50%";//边框为圆
            div.style.color = "black";//前景颜色黑色
            div.style.transitionProperty = "background-color";//变化为背景颜色
            div.style.transitionDuration = "1s";//1s变换

            div.style.height = "40px";//高40像素
            div.style.width = "40px";//宽40像素

            div.style.left = X * 100 + "%";//左边距
            div.style.top = Y * 100 + "%";//上边距

            div.appendChild(div_text);

            div.addEventListener("mousedown", get_startPoint_coordinates2);//起点
            div.addEventListener("mouseup", get_destination_coordinates2);//终点

            document.getElementById("canvas2").appendChild(div);

            Graph2.add_vertex2(div);
        }

//获取起点
        function get_startPoint_coordinates2() {
            let canvas = document.getElementById("canvas2");
            start_x2 = parseInt(this.style.left) / 100 * canvas.offsetWidth + 10;
            start_y2 = parseInt(this.style.top) / 100 * canvas.offsetHeight + 10;
            start_div2 = this;
        }

//获取终点
        function get_destination_coordinates2() {
            let canvas = document.getElementById("canvas2");
            end_x2 = parseInt(this.style.left) / 100 * canvas.offsetWidth + 10;
            end_y2 = parseInt(this.style.top) / 100 * canvas.offsetHeight + 10;
            end_div2 = this;

            if (start_x2 != null && start_y2 != null && end_x2 != null && end_y2 != null) {
                createLine2(start_div2, end_div2, start_x2, start_y2, end_x2, end_y2);
            }

            start_x2 = null;
            start_y2 = null;
            end_x2 = null;
            end_y2 = null;
            start_div2 = null;
            end_div2 = null;
        }

//添加线
        function createLine2(start_div, end_div, x1, y1, x2, y2) {
            if (x1 === x2 && y1 === y2) {
                alert("请不要添加自环!");
                return;
            }
            let length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));//计算线的长度
            let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;//计算线的角度
            let transform = 'rotate(' + angle + 'deg)';//按获得的角度旋转线rotate(angle)定义 2D 旋转，在参数中规定角度deg是单位
            let weight = window.prompt("请输入边的长度：");

            let reg = new RegExp("^-*[0-9]*$", "g");
            //weight = parseInt(weight);

            if (weight == null) {
                return;
            } else if (weight === '') {
                weight = Math.round(Math.random() * 100);
            } else {
                //weight = parseInt(weight);
                if (!reg.test(weight)) {
                    alert("输入错误！");
                    return;
                }
            }

            let line = document.createElement("div");
            let s = "<span style=\"font-size:20px;position:absolute;margin-top:10px;font-weight:bold;\">" + weight + "</span>";

            line.id = "edge_" + start_div.id + "_" + end_div.id;
            line.className = "line";

            line.style.position = "absolute";
            line.style.transform = transform;
            line.style.width = length;
            line.style.marginLeft = x1;
            line.style.marginTop = y1;
            line.style.textAlign = "center";
            line.innerHTML = s;

            document.getElementById("canvas2").appendChild(line);
            Graph2.add_edge2(start_div, end_div, line, weight);
        }

//kruskal实现
//插入边
        function _insert2(edge) {
            this._data.push(edge);
            this._size = this._size + 1;
        }

//找到最小点
        function _extract_min2() {
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
        function _is_empty2() {
            return this._size === 0;
        }

//创建一个优先级队列
        let PriorityQueue2 = {};
        PriorityQueue2._data = [];
        PriorityQueue2._size = 0;

        PriorityQueue2.is_empty2 = _is_empty2;
        PriorityQueue2.insert2 = _insert2;
        PriorityQueue2.extract_min2 = _extract_min2;

//显示
        function show_arr2(arr) {
            let i;
            let s = " ";

            for (i = 0; i < arr.length; i++) {
                s = s + arr[i]._name + ", ";
            }

            alert(s);
        }

        let MST2 = {};
        MST2.Vertices = [];
        MST2.edge_count = 0;

//向MST加入顶点
        function MST_add_vertex2(n) {
            let MSTVertex = {};
            MSTVertex._name = n;
            MSTVertex.Adj = [];//终点集
            MSTVertex.visited = false;
            MST2.Vertices.push(MSTVertex);

            return MSTVertex;
        }

//向MST加入边
        function MST_add_edge2(startPoint, endPoint) {
            if (MST_check_duplicates2(startPoint, endPoint)) {
                startPoint.Adj.push(endPoint);
                endPoint.Adj.push(startPoint);
                this.edge_count = this.edge_count + 1;
            }
        }

//检查是否存在该边
        function MST_check_duplicates2(u, v) {
            for (let i = 0; i < MST2.Vertices.length; i++) {
                if (MST2.Vertices[i] === u) {
                    for (let j = 0; j < MST2.Vertices.length; j++) {
                        if (MST2.Vertices[i].Adj[j] === v) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

//从MST中获取顶点
        function MST_get_vertex2(n) {
            for (let i = 0; i < MST2.Vertices.length; i++) {
                if (MST2.Vertices[i]._name === n) {
                    return MST2.Vertices[i];
                }
            }
        }

        MST2.add_vertex2 = MST_add_vertex2;
        MST2.add_edge2 = MST_add_edge2;
        MST2.get_vertex2 = MST_get_vertex2;

//是否形成环
        function creates_cycle2(edge) {
            let s = edge.startPoint.id;
            let d = edge.endPoint.id;

            let ufound = false;
            let vfound = false;

            //是否存在这个起点
            for (let i = 0; i < MST2.Vertices.length; i++) {
                if (MST2.Vertices[i]._name === s) {
                    ufound = true;
                    break;
                }
            }

            //是否存在这个终点
            for (let i = 0; i < MST2.Vertices.length; i++) {
                if (MST2.Vertices[i]._name === d) {
                    vfound = true;
                    break;
                }
            }

            if (ufound === true && vfound === true) {
                let u = MST_get_vertex2(s);
                let v = MST_get_vertex2(d);
                let result = MST_DFS2(u, v);
                //如果通过u进行dfs到了v，说明会形成环
                if (result === false) {
                    //没形成环，就加入这条边
                    new MST_add_edge2(u, v);
                }
                return result;
            } else if (ufound === false && vfound === false) {
                //如果都没找到，就加入这两点并加入边
                let u = MST2.add_vertex2(s);
                let v = MST2.add_vertex2(d);
                MST2.add_edge2(u, v);
                return false;
            } else if (ufound === true && vfound === false) {
                let u = MST2.get_vertex2(s);
                let v = MST2.add_vertex2(d);
                MST2.add_edge2(u, v);
                return false;
            } else if (ufound === false && vfound === true) {
                let u = MST2.add_vertex2(s);
                let v = MST2.get_vertex2(d);
                MST2.add_edge2(u, v);
                return false;
            }
            //否则，返回true
            return true;
        }

//dfs
        function MST_DFS2(u, d) {
            u.visited = true;
            for (let i = 0; i < MST2.Vertices.length; i++) {
                //初始化为false
                MST2.Vertices[i].visited = false;
            }
            MST_DFS_Visit2(u);
            return d.visited === true;
        }

//dfs_visit
        function MST_DFS_Visit2(u) {
            for (let j = 0; j < u.Adj.length; j++) {
                let v = u.Adj[j];
                if (v.visited === false) {
                    v.visited = true;
                    MST_DFS_Visit2(v);
                }
            }
        }

        function Kruskal2() {
            let count = 0;
            for (let i = 0; i < Graph2.Edges.length; i++) {
                PriorityQueue2.insert2(Graph2.Edges[i]);
            }

            //kruskal
            while (MST2.edge_count !== Graph2.Vertices.length - 1) {
                let e = PriorityQueue2.extract_min2();//边集中的最小值
                if (!creates_cycle2(e)) {
                    //如果不成环，颜色为绿色
                    color_edge2(e, count, "#8cff66");
                } else {
                    //否则颜色为橙色
                    color_edge2(e, count, "#ff9933");
                }
                count = count + 1;
            }
        }

//给边染色
        function color_edge2(edge, count, color) {
            let edge_line = edge.line;
            edge_line.style.transitionDelay = count + "s";
            edge_line.style.backgroundColor = color;
            edge_line.color = "white";
        }

        function Restart2() {
            let i;
            for (i = 0; i < Graph2.Vertices.length; i++) {
                Graph2.Vertices[i].element.style.transitionDelay = "0s";
                Graph2.Vertices[i].element.style.backgroundColor = "white";
            }

            for (i = 0; i < Graph2.Edges.length; i++) {
                Graph2.Edges[i].line.style.transitionDelay = "0s";
                Graph2.Edges[i].line.style.backgroundColor = "black";
                Graph2.Edges[i].line.style.color = "black";
            }

            while (MST2.Vertices.length !== 0) {
                MST2.Vertices.pop();
            }
            MST2.edge_count = 0;
            while (PriorityQueue2._size > 0 || !PriorityQueue2.is_empty()) {
                if (PriorityQueue2.is_empty() || (PriorityQueue2._size <= 0)) {
                    break;
                }
                PriorityQueue2.extract_min();
            }
        }

        function CleanCanvas2() {
            location.reload();
        }
    }
}
