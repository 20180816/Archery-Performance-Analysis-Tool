d3.select("body")
  .append("div")
  .style("display", "none")
  .attr("position", "absolute")
  .attr("class", "d3-tip");

let colors = {
  Leo: "#68dae3",
  Lina: "#ff5eff",
};

let dates = new Array(
  "2022-05-04",
  "2022-05-11",
  "2022-05-18",
  "2022-05-24",
  "2022-05-26",
  "2022-06-01",
  "2022-06-07",
  "2022-06-21",
  "2022-07-05",
  "2022-07-19",
  "2022-08-02",
  "2022-08-16",
  "2022-08-20",
  "2022-08-30",
  "2022-10-04",
  "2022-10-18",
  "2022-11-01",
  "2022-11-15",
  "2022-11-29",
  "2022-12-13",
  "2022-12-29",
  "2022-12-30",
  "2023-01-03",
  "2023-01-05",
  "2023-01-06",
  "2023-01-21",
  "2023-01-28",
  "2023-02-04",
  "2023-02-11",
  "2023-03-02",
  "2023-03-12",
  "2023-03-25",
  "2023-03-31",
  "2023-04-08",
  "2023-04-22",
  "2023-05-02"
);
class Arrow {
  circles = [15, 47, 94, 191, 288, 385, 483, 583, 679, 777, 873, 970];
  constructor(id, data) {
    this.data = data;
    this.id = id;
    this.init();
  }
  init() {
    this.init_svg();
    this.init_circles();
    this.init_scatter();
    this.set_x_y_line();
    this.set_center_xy_line();
  }
  init_svg() {
    const div = d3.select(`#${this.id}`);
    div.selectAll("*").remove();
    this.width = div.node().getBoundingClientRect().width;
    this.height = div.node().getBoundingClientRect().height;

    let width = Math.min(this.width, this.height);
    this.min_w_h = width;
    // 要求是个正方形
    this.svg = div
      .append("svg")
      .attr("width", width)
      .attr("height", width)
      .attr("viewBox", "0 0 2048  2048 ")
      .attr("fill", "none");
    this.g = this.svg.append("g").attr("transform", "translate(1024,1024)");
  }
  init_circles() {
    let arc = d3
      .arc()
      .innerRadius((d, index) => (index === 0 ? 0 : d))
      .outerRadius((d, index) => this.circles[index + 1])
      .startAngle(0)
      .endAngle(Math.PI * 2);

    let g = this.g
      .selectAll(".mycircle")
      .data([0])
      .join("g")
      .attr("class", "mycircle");

    let circles = g.selectAll(".arrow_circle").data(this.circles).join("path");
    circles
      .attr("d", arc)
      .attr("stroke", (d) => (d === 679 ? "white" : "black")) //583是黑色区域的白色线条
      .attr("stroke-width", (d) => (d === 679 ? 3 : 2))
      .attr("fill", (d, index) => {
        if (index <= 0) return "#ffff00";
        if (index <= 2) return "#ffff00";
        if (index <= 4) return "#ff6666";
        if (index <= 6) return "#1e90ff";
        if (index <= 8) return "#494949";
        if (index <= 10) return "#ffffff";
      });
  }

  init_scatter() {
    this.scatter_g = this.g
      .selectAll(".scatter")
      .data([0])
      .join("g")
      .attr("class", "scatter");
    this.add_scatter_circles();
  }
  add_scatter_circles() {
    let scatter = this.scatter_g
      .selectAll("circle")
      .data(this.data)
      .join("circle");

    scatter
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => -d.y)
      .attr("r", 12)
      .attr("class", (d) => "zone" + d.zone + " arrow" + d.name)
      .attr("id", (d) => "scatter" + d.id)
      .attr("fill", (d) => colors[d.name]);

    let that = this;
    scatter
      .on("mouseenter", function (e, d) {
        let html = ` 
        <li> Name: ${d.name === "Leo" ? "Boy" : "Girl"}  </li>
        <li> X: ${parseInt(d.x)}  </li>
        <li> Y: ${parseInt(d.y)}  </li>
        <li> Date: ${d.date}  </li>
        <li> Point: ${d.score}  </li>
        
        `;
        that.tips_show(e, d, html);

        //
        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("r", 28)
          .raise();
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("r", 12)
          .raise();
        that.tips_hide();
      });
  }
  update_scatter(data) {
    this.data = data;
    this.add_scatter_circles();
  }
  init_desity() {
    const contours = d3
      .contourDensity()
      .x((d) => d.x + 1024)
      .y((d) => d.y + 1024)
      .size([2048, 2048])
      .bandwidth(30)
      .thresholds(30)(this.data);

    let g = this.svg
      .selectAll(".density")
      .data([0])
      .join("g")
      .attr("class", "density");
    let paths = g.selectAll("path").data(contours).join("path");
    paths
      .attr("stroke-width", 1)
      .attr("d", d3.geoPath())
      .attr("stroke", "black");
  }
  remove_density() {
    this.svg.select(".density").remove();
  }
  remove_scatter() {
    this.scatter_g.selectAll("*").remove();
  }

  set_x_y_line() {
    let x_line = this.svg.selectAll(".x_line").data([0]).join("line");

    x_line
      .attr("class", "x_line")
      .attr("x1", 0)
      .attr("x2", 2048)
      .attr("y1", 1024)
      .attr("y2", 1024)
      .attr("stroke-width", 9)
      .attr("stroke", "gray");
    let y_line = this.svg.selectAll(".y_line").data([0]).join("line");

    y_line
      .attr("class", "y_line")
      .attr("x1", 1024)
      .attr("x2", 1024)
      .attr("y1", 0)
      .attr("y2", 2048)
      .attr("stroke-width", 9)
      .attr("stroke", "gray");
  }
  del_X_y_line() {
    this.svg.select(".y_line").remove();
    this.svg.select(".x_line").remove();
  }

  set_center_xy_line() {
    const add_line = (classname, x1, x2, y1, y2) => {
      let line = this.svg.selectAll(`.${classname}`).data([0]).join("line");
      line
        .attr("class", classname)
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .attr("stroke-width", 2)
        .attr("stroke", "gray");
    };

    add_line("center_line_x", 1000, 1048, 1024, 1024);
    add_line("center_line_y", 1024, 1024, 1000, 1048);
  }
  tips_show(e, v, html) {
    d3.select(".d3-tip")
      .style("display", "block")
      .style("position", "absolute")
      .style("top", e.pageY + "px")
      .style("left", e.pageX + "px")
      .style("padding", "5px")
      .html(html);
  }
  tips_hide() {
    d3.select(".d3-tip").style("display", "none");
  }

  //
  set_rects() {
    // xy 各100
    // 掉落在某个区域里的数量作为颜色
    let tick = 20.48;
    let g = this.svg
      .selectAll(".my_rect")
      .data([0])
      .join("g")
      .attr("class", "my_rect");

    let x = d3.scaleLinear().domain([-1024, 1024]).range([0, 99]);
    let y = d3.scaleLinear().domain([-1024, 1024]).range([0, 99]);

    let _data = d3.flatRollup(
      this.data,
      (d) => d.length,
      (d) => Math.round(x(d.x)),
      (d) => Math.round(y(d.y))
    );

    let color_scale = d3
      .scaleLinear()
      .domain([1, d3.max(_data, (d) => d[2])])
      .range(["#FFCDA8", "#FF0060"]);

    let rects = g.selectAll("rect").data(_data).join("rect");
    rects
      .attr("width", tick)
      .attr("height", tick)
      .attr("x", (d, i) => tick * d[0])
      .attr("y", (d, i) => tick * d[1])
      .attr("fill", (d) => color_scale(d[2]));
  }
  remove_rects() {
    this.svg.select(".my_rect").remove();
  }
}
class Line {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.init();
  }

  init() {
    this.add_svg();

    this.update_chart();
  }
  add_svg() {
    this.add_margin();
    this.add_chart_area();
    this.add_label();
  }

  add_margin() {
    const div = d3.select(`#${this.id}`);
    div.selectAll("*").remove();
    this.getWH(div);
    this.margin = { left: 50, right: 50, top: 50, bottom: 50 };
    this.innerW = this.width - this.margin.left - this.margin.right;
    this.innerH = this.height - this.margin.top - this.margin.bottom;
    this.svg = div
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  add_chart_area() {
    this.ChartArea = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    this.draw_area = this.ChartArea.append("g");
    this.AxisYLeft = this.ChartArea.append("g");
    this.AxisYRight = this.ChartArea.append("g").attr(
      "transform",
      `translate(${this.innerW},0)`
    );
    this.AxisX = this.ChartArea.append("g").attr(
      "transform",
      `translate(0,${this.innerH})`
    );
  }
  add_label() {
    this.ChartArea.selectAll(".x_label")
      .data([0])
      .join("text")
      .attr("class", "x_label")
      .attr("transform", `translate(${this.innerW / 2},${this.innerH + 30})`)
      .text("Date");
    // y1
    this.ChartArea.selectAll(".y_label")
      .data([0])
      .join("text")
      .attr("class", "y_label")
      .attr("transform", `translate(-30,${this.innerH / 2}) rotate(270)`)
      .text("Mean");
  }

  add_axis() {
    this.AxisX.call(d3.axisBottom(this.x).ticks(5));
    this.AxisYLeft.call(d3.axisLeft(this.y1));
  }
  tips_show(e, v, html) {
    d3.select(".d3-tip")
      .style("display", "block")
      .style("position", "absolute")
      .style("top", e.pageY + "px")
      .style("left", e.pageX + "px")
      .style("padding", "5px")
      .html(html);
  }
  tips_hide() {
    d3.select(".d3-tip").style("display", "none");
  }
  update_chart() {
    this.update_data();
    this.add_scale();
    this.add_axis();
    this.draw_chart();
  }

  update_data() {
    this.line_data = d3.rollups(
      this.data,
      (d) => d3.mean(d, (v) => v.score),
      (d) => d.date
    );

    this.line_data_by_name = d3.rollups(
      this.data,
      (d) => d3.mean(d, (v) => v.score),
      (d) => d.name,
      (d) => d.date
    );
  }
  add_scale() {
    this.x = d3
      .scaleBand()
      .domain(this.line_data.map((d, index) => index + 1))
      .range([0, this.innerW]);
    this.y1 = d3.scaleLinear().domain([0, 10]).range([this.innerH, 0]);
  }
  draw_chart() {
    this.line_data_by_name.forEach((data_by_name) => {
      let color = colors[data_by_name[0]];
      let name = data_by_name[0];
      let line = d3
        .line()
        .x((d, index) => this.x(index + 1))
        .y((d) => this.y1(d[1]));
      let g = this.ChartArea.selectAll(`.${name}`)
        .data([0])
        .join("g")
        .attr("class", color);

      g.append("path")
        .datum(data_by_name[1])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", color);

      let circles = g
        .selectAll(".circle" + name)
        .data(data_by_name[1])
        .join("circle")
        .attr("class", "circle" + name);
      circles
        .attr("cx", (d, index) => this.x(index + 1))
        .attr("cy", (d) => this.y1(d[1]))
        .attr("r", 6)
        .attr("fill", color);

      circles
        .on("mouseenter", (e, d) => {
          let circle = d3.select(e.target);
          circle.attr("stroke", "black");
          let highlight_data = this.data.filter(
            (v) => v.date == d[0] && v.name === name
          );
          let scatter = d3.select(".scatter");
          scatter.selectAll("circle").attr("fill-opacity", 0.3);

          highlight_data.forEach((d) => {
            scatter
              .select("#scatter" + d.id)
              .raise()
              .attr("fill-opacity", 1)
              .attr("r", 22)
              .attr("stroke", "black");
          });
          let html = `
          
          <li>Date: ${d[0]}  </li>
          <li>Count: ${highlight_data.length}  </li>
          <li>Score: ${d3.format("d")(
            d3.sum(highlight_data, (d) => d.score)
          )}  </li>
          <li>Mean: ${d3.format(".2f")(
            d3.mean(highlight_data, (d) => d.score)
          )}  </li>
          
          <li>Std Dev: ${d3.format(".2f")(
            d3.deviation(highlight_data, (d) => d.score)
          )}  </li>
          `;
          this.tips_show(e, d, html);
          new Table(highlight_data);
        })
        .on("mouseout", (e, d) => {
          let circle = d3.select(e.target);
          circle.attr("stroke", "none");
          this.tips_hide();
          // Object.entries(colors).forEach((d) => {
          //   let scatter = d3.selectAll(".arrow" + d[0]);
          //   scatter.attr("fill", d[1]).attr("stroke", "none");
          // });

          new Arrow("chart", this.data);
          new Table(this.data);
        });
    });
  }
  getWH(node) {
    this.width = node.node().getBoundingClientRect().width;
    this.height = node.node().getBoundingClientRect().height;
  }
}

class Parallel {
  constructor(id, data) {
    // 这个是保多个存筛选条件的对象.
    this.filters_obj = {};

    this.id = id;
    this.data = data;
    this.init();
  }

  init() {
    this.init_svg();
    this.add_parallel();
  }

  init_svg() {
    const div = d3.select(`#${this.id}`);
    div.selectAll("*").remove();
    this.getWH(div);
    this.margin = { left: 50, right: 50, top: 50, bottom: 50 };
    this.innerW = this.width - this.margin.left - this.margin.right;
    this.innerH = this.height - this.margin.top - this.margin.bottom;
    this.svg = div
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    this.g = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  add_parallel() {
    let arr = ["x", "y", "zone", "score"];
    arr.forEach((d, index) => {
      this.add_axis(d, index);
    });
    this.add_lines();
  }
  add_lines() {
    // add_line
    let generate_line = (item) => {
      return `M ${this.x(item.x)},${0} L${this.y(item.y)},${
        this.innerH / 3
      } L${this.zone(+item.zone)},${(this.innerH / 3) * 2} L ${this.score(
        item.score
      )} ,${this.innerH}  `;
    };

    this.paths = this.g
      .selectAll(".myline")
      .data(this.data)
      .join("path")
      .attr("class", "parallel_line")
      .lower();

    this.paths
      .attr("d", generate_line)
      .attr("stroke", "blue")
      .attr("fill", "none")
      .attr("id", (d) => d.id);
    try{
      let value = d3.select("#parallel_selectors").select("select").property("value");
      
       this.update_color(value);
    }catch {
      this.update_color("x");
    }

 
  }
  add_axis(d, index) {
    let g = this.g.append("g");
    this.g
      .append("text")
      .attr("x", -10)
      .attr("y", (this.innerH / 3) * index)
      .text(
        d === "score" ? "Point" : d === "x" ? "X" : d === "y" ? "Y" : "Zone"
      )
      .attr("text-anchor", "end");

    g.attr("transform", `translate(${0},${(this.innerH / 3) * index})`);

    this[d] = d3
      .scaleLinear()
      .domain(d3.extent(this.data, (v) => +v[d]))
      .range([0, this.innerW]);

    this.zones = [...new Set(this.data.map((d) => d.zone))];
    this.zones.sort();
    this.scores = [...new Set(this.data.map((d) => d.score))];
    this.scores.sort();
    if (d === "zone") {
      g.call(
        d3.axisBottom(this[d]).tickValues(this.zones).tickFormat(d3.format("d"))
      );
    } else if (d === "score") {
      g.call(
        d3
          .axisBottom(this[d])
          .tickValues(this.scores)
          .tickFormat(d3.format("d"))
      );
    } else {
      g.call(d3.axisBottom(this[d]).tickFormat(d3.format("d")));
    }

    let brush_x = this.add_brush(d);
    g.call(brush_x);
  }
  getWH(node) {
    this.width = node.node().getBoundingClientRect().width;
    this.height = node.node().getBoundingClientRect().height;
  }

  add_brush(scale_name) {
    let brushed = (event) => {
      console.log(event);
      // 如果取消筛选
      if (event.selection == null) {
        this.filters_obj[scale_name] = this[scale_name].domain();
      } else {
        let { selection } = event;
        let domain_start = this[scale_name].invert(selection[0]);
        let domain_end = this[scale_name].invert(selection[1]);
        this.filters_obj[scale_name] = [domain_start, domain_end];
      }

      this.filter_data = this.data.filter((d) => {
        // 循环fiLter的多个条件.计算交集
        let filters = Object.entries(this.filters_obj);
        let result = filters.reduce((pre, cur) => {
          return pre && d[cur[0]] >= cur[1][0] && d[cur[0]] <= cur[1][1];
        }, true);
        return result;
      });

      console.log(this.filter_data, this.filters_obj);

      // 筛选数据,高亮线条
      this.svg.selectAll(".parallel_line").attr("stroke-opacity", 0.01);

      this.filter_data.forEach((d) => {
        this.svg.select("#" + d.id).attr("stroke-opacity", 1);
      });

      new Arrow("chart", this.filter_data);
      new Line("line_chart", this.filter_data);
      new Table(this.filter_data);
    };
    let brush = d3
      .brushX()
      .extent([
        [0, -30],
        [this.innerW, 30],
      ])
      .on("end", brushed);

    return brush;
  }
  update_color(scale_name) {
    this[scale_name + "color"] = d3
      .scaleSequential()
      .domain(d3.extent(this.data, (d) => d[scale_name])) // 输入域
      .interpolator(d3.interpolateBrBG); // 指定插值函数
    this.paths.attr("stroke", (d) => this[scale_name + "color"](d[scale_name]));
  }
}

class Table {
  Score_objs = {
    Score1: "White (0~2)",
    Score2: "Black (3~4)",
    Score3: "Blue (5~6)",
    Score4: "Red (7~8)",
    Score5: "Yellow (9~10)",
  };
  score_map = new Map([
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 2],
    [5, 3],
    [6, 3],
    [7, 4],
    [8, 4],
    [9, 5],
    [10, 5],
  ]);
  zone = ["Zone 1", "Zone 2", "Zone 3", "Zone 4"];
  constructor(data) {
    this.update_table(data);
  }
  draw_table(id, data, columns) {
    const div = d3.select(`#${id}`);
    div.selectAll("*").remove();
    // 表头

    let table = div
      .append("table")
      .attr("class", " mx-[10%] w-[80%]  table-auto border-b border-gray-300");
    let thead = table.append("thead").attr("class", "justify-between");
    let tr = thead.append("tr").attr("class", "bg-white");
    let th = tr
      .selectAll("th")
      .data(columns)
      .join("th")
      .attr("class", "px-1  ");
    th.append("span")
      // .attr("class", "text-gray-300")
      .html((d) => d);

    let tbody = table
      .append("tbody")
      .attr("class", "bg-gray-200 justify-between");
    let rows = ["count", "sum", "mean"];
    rows.forEach((d) => {
      let tr = tbody.append("tr").attr("class", "bg-white  justify-between");
      let td = tr
        .selectAll("td")
        .data(data[d])
        .join("td")
        .attr("class", "px-1 py-0 text-center");
      td.append("span")
        .attr("class", "")
        .html((d) => d[1]);
    });
  }

  update_table(data) {
    this.update_score_table(data);
    this.update_zone_table(data);
    this.add_range_dispersion(data);
  }

  update_score_table(data) {
    let order = [
      "White (0~2)",
      "Black (3~4)",
      "Blue (5~6)",
      "Red (7~8)",
      "Yellow (9~10)",
    ];
    let count_data = d3.flatRollup(
      data,
      (d) => d.length,
      (d) => this.Score_objs["Score" + this.score_map.get(d.score)]
    );

    count_data.unshift(["Count", "Count"]);

    let sum_data = d3.flatRollup(
      data,
      (d) => d3.sum(d, (v) => v.score),
      (d) => this.Score_objs["Score" + this.score_map.get(d.score)]
    );
    sum_data.unshift(["Score", "Score"]);
    sum_data.sort((a, b) =>
      order.findIndex((d) => d === a[0]) > order.findIndex((d) => d === b[0])
        ? 1
        : -1
    );
    let mean_data = d3.flatRollup(
      data,
      (d) => d3.format(".2f")(d3.mean(d, (v) => v.score)),
      (d) => this.Score_objs["Score" + this.score_map.get(d.score)]
    );

    mean_data.unshift(["Mean", "Mean"]);

    mean_data.sort((a, b) =>
      order.findIndex((d) => d === a[0]) > order.findIndex((d) => d === b[0])
        ? 1
        : -1
    );
    count_data.sort((a, b) =>
      order.findIndex((d) => d === a[0]) > order.findIndex((d) => d === b[0])
        ? 1
        : -1
    );
    let score_data = { count: count_data, mean: mean_data, sum: sum_data };

    let columns = [
      ...new Set(
        data.map((d) => this.Score_objs["Score" + this.score_map.get(d.score)])
      ),
    ];

    columns.sort((a, b) =>
      order.findIndex((d) => d === a) > order.findIndex((d) => d === b) ? 1 : -1
    );

    columns.unshift(" ");
    this.draw_table("table1", score_data, columns);
  }

  update_zone_table(data) {
    let order = this.zone;

    let count_data = d3.flatRollup(
      data,
      (d) => d.length,
      (d) => "Zone " + d.zone
    );

    let mean_data = d3.flatRollup(
      data,
      (d) => d3.format(".2f")(d3.mean(d, (v) => v.score)),
      (d) => "Zone " + d.zone
    );

    let sum_data = d3.flatRollup(
      data,
      (d) => d3.sum(d, (v) => v.score),
      (d) => "Zone " + d.zone
    );

    sum_data.sort((a, b) =>
      order.findIndex((d) => d === a[0]) > order.findIndex((d) => d === b[0])
        ? 1
        : -1
    );

    mean_data.sort((a, b) =>
      order.findIndex((d) => d === a[0]) > order.findIndex((d) => d === b[0])
        ? 1
        : -1
    );
    count_data.sort((a, b) =>
      order.findIndex((d) => d === a[0]) > order.findIndex((d) => d === b[0])
        ? 1
        : -1
    );
    sum_data.unshift(["Score", "Score"]);
    count_data.unshift(["Count", "Count"]);
    mean_data.unshift(["Mean", "Mean"]);
    let score_data = { count: count_data, mean: mean_data, sum: sum_data };

    let columns = [...new Set(data.map((d) => "Zone " + d.zone))];

    columns.sort((a, b) =>
      order.findIndex((d) => d === a) > order.findIndex((d) => d === b) ? 1 : -1
    );
    columns.unshift(" ");
    this.draw_table("table2", score_data, columns);
  }

  add_range_dispersion(data) {
    let content = "Horizontal Dispersion: ";
    let max = d3.max(data, (d) => d.x);
    let min = d3.min(data, (d) => d.x);
    let y_content = "Vertical Dispersion: ";
    let max_y = d3.max(data, (d) => d.y);
    let min_y = d3.min(data, (d) => d.y);

    d3.select("#dispersion")
      .attr("class", "mx-[4%] flex justify-around")
      .html(
        ` 
        <span>${content + d3.format("d")(max - min) + "  "}</span>
     
        <span>${y_content + d3.format("d")(max_y - min_y)}</span>
        
     `
      );
  }
}

class chart {
  dates_set = new Set(dates);
  score_set = new Set(["Score1", "Score2", "Score3", "Score4", "Score5"]);
  Score_objs = {
    Score1: "White (0~2)",
    Score2: "Black (3~4)",
    Score3: "Blue (5~6)",
    Score4: "Red (7~8)",
    Score5: "Yellow (9~10)",
  };
  score_map = new Map([
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 2],
    [5, 3],
    [6, 3],
    [7, 4],
    [8, 4],
    [9, 5],
    [10, 5],
  ]);
  names = ["Leo", "Lina"];
  score_type = ["Score1", "Score2", "Score3", "Score4", "Score5"];
  visualization_methods = ["Basic", "Density", "Parallel"];
  zone = ["Zone1", "Zone2", "Zone3", "Zone4"];
  viewType = []; // 移除"Heatmap", "Density"

  //viewType = ["Heatmap", "Density"];
  filter_zone = new Set([1, 2, 3, 4]);
  show_parallel = true;
  Parallel_color_map = ["x", "y", "zone", "score"];
  filters = new Map();
  compared_status = false;
  // compare button

  constructor() {
    this.filters.set("zones_set", this.filter_zone);
    this.filters.set("name", "Leo");
    this.filters.set("dates_set", new Set(dates));
    this.filters.set("score_set", this.score_set);
    this.init_data();
  }

  split_2_div(id) {
    // 分裂出来两个div
    // 分别画 leo的俩图 和lina
    let div = d3.select("#" + id);
    div.style("display", "grid");
    div.style("grid-template-rows", "48% 48%");
    div.style("rows-gap", "2%");

    div.selectAll("*").remove();
    div
      .selectAll("section")
      .data(this.names)
      .join("div")
      .attr("id", (d) => d + id)
      .style("border", "solid gray 1px")
      .style("margin", "0px 0px")
      .style("display", "grid")
      .style("justify-items", "center");
  }
  update_filtered_data() {
    this.filtered_data = this.data.filter((d) => {
      return (
        this.filters.get("zones_set").has(d.zone) &&
        (this.filters.get("name") === "All Person"
          ? true
          : this.filters.get("name") === d.name) &&
        this.filters.get("dates_set").has(d.date) &&
        this.filters.get("score_set").has("Score" + this.score_map.get(d.score))
      );
    });
  }
  init_selectors() {
    this.init_svg();

    this.init_name_select();
    this.init_score_type_select();
    this.init_zone_select();

    this.init_Parallel_color_map_select();

    this.init_dates_select();
    this.init_viewtype_select();

    // init select styele
    d3.selectAll("select").attr("class", "mx-3 mb-6 border-2 border-black ");
    d3.selectAll("label").attr("class", "mx-3 mt-3");
  }

  init_svg() {
    this.Basic = new Arrow("chart", this.filtered_data);
    this.Line = new Line("line_chart", this.filtered_data);
    this.Parallel = new Parallel("parallel", this.filtered_data);

    this.Table = new Table(this.filtered_data);
  }

  init_name_select() {
    d3.select("#dimention_selectors").append("label").html("Trainee");
    let selectors = d3.select("#dimention_selectors").append("select");
    let names = [...this.names];
    names.push("All Person");
    let options = selectors.selectAll("option").data(names).join("option");
    options
      .attr("value", (d) => d)
      .html((d) => (d === "Leo" ? "Boy" : d === "Lina" ? "Girl" : "All"));
    selectors.on("change", (e) => {
      this.filters.set("name", e.target.value);
      this.update_filtered_data();
      this.update_charts();
    });
  }
  init_dates_select() {
    d3.select("#dates").attr(
      "class",
      "h-[40vh] overflow-y-auto mb-6 border-2 border-black mx-3"
    );

    let fieldset = d3.select("#dates").append("fieldset");
    fieldset.attr("class", "mx-3");
    let div = fieldset.selectAll("input_div").data(dates).join("div");

    let date_checkbox = div
      .append("input")
      .attr("type", "checkbox")
      .attr("id", (d) => "dates" + d)
      .attr("class", "dates_checkbox")
      .attr("name", (d) => d)
      .property("checked", (d) => true);
    div.append("label").html((d) => d);
    date_checkbox.on("change", (e, d) => {
      // 清零 日期选择器

      this.set_date_slide_to_zero();
      let checked = d3.select(e.target).property("checked");
      checked ? this.dates_set.add(d) : this.dates_set.delete(d);
      this.filters.set("dates_set", this.dates_set);
      this.update_filtered_data();
      this.update_charts();
    });
    this.slide_range_changed();
  }

  slide_range_changed() {
    let that = this;
    d3.select("#date_start").html(dates[0]).style("font-size", "0.6vw");
    d3.select("#date_end")
      .html(dates[dates.length - 1])
      .style("font-size", "0.6vw");
    $(() => {
      $("#slider-range").slider({
        range: true,
        min: 0,
        max: dates.length - 1,
        values: [0, dates.length - 1],
        slide: function (event, ui) {
          console.log("ui==>", ui);
          let { values } = ui;

          that.update_dates_checkbox(values);
          that.update_charts();
        },
      });
    });
  }

  update_dates_checkbox(values) {
    let dates_range = new Set(dates.slice(values[0], values[1] + 1));

    d3.select("#date_start").html(dates[values[0]]);
    d3.select("#date_end").html(dates[values[1]]);
    this.dates_set = dates_range;
    this.filters.set("dates_set", dates_range);

    d3.selectAll(".dates_checkbox").property("checked", (d) =>
      dates_range.has(d)
    );
    this.update_filtered_data();
  }
  init_score_type_select() {
    d3.select("#dimention_selectors").append("label").html("Point Range");
    let fieldset = d3.select("#dimention_selectors").append("fieldset");
    fieldset.attr("class", "mx-3");
    let Score_objs = this.Score_objs;

    let div = fieldset.selectAll("input").data(this.score_type).join("div");

    let inputs = div
      .append("input")
      .attr("type", "checkbox")
      .attr("id", (d) => d)
      .attr("name", (d) => d)
      .property("checked", (d) => true);

    div.append("label").html((d) => Score_objs[d]);

    inputs.on("change", (e, d) => {
      let checked = d3.select(e.target).property("checked");
      checked ? this.score_set.add(d) : this.score_set.delete(d);
      this.filters.set("score_set", this.score_set);
      this.show_parallel = true;
      this.update_filtered_data();
      this.update_charts();
    });
  }

  init_zone_select() {
    const update_zone = (checked, index) => {
      let set = this.filters.get("zones_set");
      checked ? set.add(index) : set.delete(index);
      this.update_filtered_data();
      this.Basic = new Arrow("chart", this.filtered_data);
      this.Basic.update_scatter(this.filtered_data);
      this.Basic.set_x_y_line();
      this.Line = new Line("line_chart", this.filtered_data);
      this.Parallel = new Parallel("parallel", this.filtered_data);
      this.Table = new Table(this.filtered_data);
      set.size === 0 && this.Basic.del_X_y_line();
    };

    const handel_zone1 = (checked) => {
      update_zone(checked, 1);
    };
    const handel_zone2 = (checked) => {
      update_zone(checked, 2);
    };
    const handel_zone3 = (checked) => {
      update_zone(checked, 3);
    };
    const handel_zone4 = (checked) => {
      update_zone(checked, 4);
    };

    const hendel_Parallel = (checked) => {
      this.show_parallel = checked;

      this.Parallel = checked
        ? new Parallel("parallel", this.filtered_data)
        : d3.select("#parallel").selectAll("*").remove();
    };

    d3.select("#dimention_selectors").append("label").html("Zone");
    let fieldset = d3.select("#dimention_selectors").append("fieldset");
    fieldset.attr("class", "mx-3 mb-5");
    let div = fieldset.selectAll("input").data(this.zone).join("div");

    let inputs = div
      .append("input")
      .attr("type", "checkbox")
      .attr("id", (d) => d)
      .attr("name", (d) => d)
      .property("checked", (d) => d.includes("Zone"));
    div.append("label").html((d) => d.slice(0, 4) + " " + d.slice(4, 5));

    inputs.on("change", (e, d) => {
      let checked = d3.select(e.target).property("checked");
      switch (d) {
        case "Zone1":
          handel_zone1(checked);
          break;
        case "Zone2":
          handel_zone2(checked);
          break;
        case "Zone3":
          handel_zone3(checked);
          break;
        case "Zone4":
          handel_zone4(checked);
          break;
        case "Eclipse":
          console.log("这是橙子");
          break;

        case "Parallel":
          hendel_Parallel(checked);
          break;
        default:
          console.log("nothng");
      }
    });
  }

  init_viewtype_select() {
    const Heatmap = (checked) => {
      checked ? this.Basic.remove_scatter() : this.Basic.add_scatter_circles();
      checked
        ? this.Basic.set_rects()
        : this.Basic.remove_rects() && this.Basic.add_scatter_circles();
    };
    const handel_Density = (checked) => {
      checked ? this.Basic.init_desity() : this.Basic.remove_density();
    };
    // d3.select("#viewtype").append("label").html("View Type");
    let fieldset = d3.select("#viewtype").append("fieldset");
    fieldset.attr(
      "class",
      "mx-3 grid grid-cols-[50%_50%] w-96  justify-items-center"
    );
    let div = fieldset.selectAll("input").data(this.viewType).join("div");

    let inputs = div
      .append("input")
      .attr("type", "checkbox")
      .attr("id", (d) => d)
      .attr("name", (d) => d)
      .property("checked", (d) => d.includes("Zone"));
    div.append("label").html((d) => d);

    inputs.on("change", (e, d) => {
      let checked = d3.select(e.target).property("checked");
      switch (d) {
        case "Heatmap":
          Heatmap(checked);
          break;
        case "Density":
          handel_Density(checked);
          break;
      }
    });
  }
  init_Parallel_color_map_select() {
    d3.select("#parallel_selectors").append("label").html("Color Mapping");
    let selectors = d3.select("#parallel_selectors").append("select");
    let options = selectors
      .selectAll("option")
      .data(this.Parallel_color_map)
      .join("option");
    options
      .attr("value", (d) => d)
      .html((d) =>
        d === "score" ? "Point" : d === "x" ? "X" : d === "y" ? "Y" : "Zone"
      );
    selectors.on("change", (e) => {
      this.Parallel && this.Parallel.update_color(e.target.value);
    });
  }

  async init_data() {
    // 异步获取数据

    let _data = await Promise.all(
      this.names.map(async (name) => {
        return await Promise.all(
          dates.map(async (date) => {
            let data = await d3.csv(
              `../Data/${this.capitalizeFirstLetter(name)}-${date}.csv`
            );
            data.forEach((d) => {
              d.date = date;
              d.name = name;
              d.x = +d.x;
              d.y = +d.y;
              d.blob_size = +d.blob_size;
              d.zone = +d.zone;
              d.score = +d.score;
            });

            return data;
          })
        );
      })
    );

    this.data = _data.flat(Infinity);
    this.data.forEach((d, index) => (d.id = "id" + index));
    this.filtered_data = this.data;
    this.update_filtered_data();
    this.init_selectors();

    console.log(this.data);
  }
  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  update_charts() {
    this.Basic = new Arrow("chart", this.filtered_data);
    this.Line = new Line("line_chart", this.filtered_data);

    this.Parallel = this.show_parallel
      ? new Parallel("parallel", this.filtered_data)
      : d3.select("#parallel").selectAll("*").remove();

    this.Table = new Table(this.filtered_data);
  }

  set_date_slide_to_zero() {
    $("#slider-range").slider({
      range: true,
      values: [0, 0],
    });
  }
}

new chart();
