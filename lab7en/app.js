// PIE CHART
new Chart(document.getElementById('pieChart'), {
  type: 'pie',
  data: {
    labels: ['Coffee', 'Tea', 'Juice', 'Lemonade'],
    datasets: [{
      data: [45, 25, 80, 30],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#0de926']
    }]
  }
});

// BAR CHART
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ['Europe', 'Asia', 'America', 'Afrika'],
    datasets: [{
      label: 'Sales',
      data: [300, 500, 400, 800],
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350']
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }, plugins: {
      legend: {
        labels: {
          usePointStyle: false,
          boxWidth: 0
        }
      }
    }
  }
});

// LINE CHART
new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Visitors',
      data: [200, 400, 300, 500, 450],
      borderColor: '#66bb6a',
      fill: false
    },
      {
        label: 'Sales',
        data: [150, 500, 250, 100, 380],
        borderColor: '#cd1b38',
        fill: false
      }]
  }
});

// D3 NETWORK GRAPH
const svg = d3.select("#networkGraph");
const width = +svg.attr("width");
const height = +svg.attr("height");

const nodes = [
  { id: "Alice" },
  { id: "Bob" },
  { id: "Carol" },
  { id: "Dave" },
  { id: "EVE" }
];

const links = [
  { source: "Alice", target: "Bob" },
  { source: "Alice", target: "Carol" },
  { source: "Bob", target: "Dave" },
  { source: "Alice", target: "EVE" },
  { source: "EVE", target: "Dave" }
];

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke", "#aaa");

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("r", 10)
  .attr("fill", "#2a9708")
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

const label = svg.append("g")
  .selectAll("text")
  .data(nodes)
  .enter().append("text")
  .text(d => d.id)
  .attr("font-size", 12)
  .attr("dy", -15);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  label
    .attr("x", d => d.x)
    .attr("y", d => d.y);
});

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
