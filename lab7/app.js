window.onload = function () {
    initCoffeeChart();
    initNetworkGraph();
};

/* =========================
   1) DOUGHNUT GRAF
========================= */
function initCoffeeChart() {
    const canvas = document.getElementById('myPieChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const outerData = [12, 19, 3];
    const innerData = [4, 3, 3, 2];

    const outerLabels = ['Červená', 'Modrá', 'Žlutá'];
    const innerLabels = ['Espresso', 'Lungo', 'Americano', 'Latte'];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [...outerLabels, ...innerLabels],
            datasets: [
                {
                    label: 'Hlavní barvy',
                    data: outerData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    radius: '100%',
                    cutout: '60%'
                },
                {
                    label: 'Druhy kávy',
                    data: innerData,
                    backgroundColor: [
                        '#5D4037',
                        '#795548',
                        '#8D6E63',
                        '#A1887F'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    radius: '58%',
                    cutout: '25%'
                }
            ]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 20
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Přehled barev a druhů kávy',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        generateLabels(chart) {
                            const datasets = chart.data.datasets;
                            const result = [];

                            datasets.forEach((dataset, datasetIndex) => {
                                dataset.data.forEach((value, i) => {
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);

                                    const labelText =
                                        datasetIndex === 0
                                            ? `${outerLabels[i]} (${value}, ${percentage}%)`
                                            : `${innerLabels[i]} (${value}, ${percentage}%)`;

                                    result.push({
                                        text: labelText,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.backgroundColor[i],
                                        lineWidth: 1,
                                        hidden: false,
                                        index: i,
                                        datasetIndex: datasetIndex
                                    });
                                });
                            });

                            return result;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: (value, context) => {
                        const dataset = context.chart.data.datasets[context.datasetIndex];
                        const total = dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%';
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const dataset = context.dataset;
                            const total = dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/* =========================
   2) SÍŤOVÝ GRAF / MIND MAP
========================= */
function initNetworkGraph() {
    const container = document.getElementById('network');
    const statusEl = document.getElementById('status');
    const jsonPreview = document.getElementById('jsonPreview');

    if (!container) return;

    const STORAGE_KEY = 'coffee-network-graph-v1';

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 620;

    let selectedNodeId = null;
    let nextId = 1;

    let graphData = loadGraph();

    if (!Array.isArray(graphData.nodes)) graphData.nodes = [];
    if (!Array.isArray(graphData.links)) graphData.links = [];

    nextId = graphData.nodes.reduce((max, n) => Math.max(max, Number(n.id) || 0), 0) + 1;

    const svg = d3
        .select('#network')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const linkLayer = svg.append('g');
    const nodeLayer = svg.append('g');

    const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(130))
        .force('charge', d3.forceManyBody().strength(-480))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(42));

    svg.on('click', function (event) {
        if (event.target !== this) return;

        const [x, y] = d3.pointer(event, this);
        createNode(x, y);
    });

    d3.select('#clearSelectionBtn').on('click', () => {
        selectedNodeId = null;
        setStatus('Výběr zrušen.');
        updateGraph();
    });

    d3.select('#deleteSelectedBtn').on('click', () => {
        if (selectedNodeId == null) {
            setStatus('Nejdřív vyber node, který chceš smazat.');
            return;
        }
        deleteNode(selectedNodeId);
    });

    d3.select('#exportJsonBtn').on('click', () => {
        exportGraphJson();
    });

    d3.select('#resetGraphBtn').on('click', () => {
        const confirmed = confirm('Opravdu chceš smazat celý síťový graf?');
        if (!confirmed) return;

        graphData = {
            nodes: [
                { id: 1, label: 'Start', x: width / 2 - 120, y: height / 2 },
                { id: 2, label: 'Káva', x: width / 2 + 40, y: height / 2 - 60 },
                { id: 3, label: 'Latte', x: width / 2 + 160, y: height / 2 + 40 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 2, target: 3 }
            ]
        };
        nextId = 4;
        selectedNodeId = null;
        saveGraph();
        rebindSimulation();
        updateGraph();
        setStatus('Graf byl resetován.');
    });

    if (graphData.nodes.length === 0) {
        graphData = {
            nodes: [
                { id: 1, label: 'Start', x: width / 2 - 120, y: height / 2 },
                { id: 2, label: 'Káva', x: width / 2 + 40, y: height / 2 - 60 },
                { id: 3, label: 'Latte', x: width / 2 + 160, y: height / 2 + 40 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 2, target: 3 }
            ]
        };
        nextId = 4;
        saveGraph();
    }

    updateGraph();

    function createNode(x, y) {
        const label = `Node ${nextId}`;
        const node = {
            id: nextId++,
            label,
            x,
            y
        };

        graphData.nodes.push(node);
        saveGraph();
        rebindSimulation();
        updateGraph();
        setStatus(`Přidán nový node: ${label}`);
    }

    function connectNodes(sourceId, targetId) {
        if (sourceId === targetId) {
            setStatus('Node nelze propojit sám se sebou.');
            return;
        }

        const exists = graphData.links.some(link => {
            const s = getNodeId(link.source);
            const t = getNodeId(link.target);
            return (
                (s === sourceId && t === targetId) ||
                (s === targetId && t === sourceId)
            );
        });

        if (exists) {
            setStatus('Toto propojení už existuje.');
            return;
        }

        graphData.links.push({
            source: sourceId,
            target: targetId
        });

        saveGraph();
        rebindSimulation();
        updateGraph();

        const a = graphData.nodes.find(n => n.id === sourceId);
        const b = graphData.nodes.find(n => n.id === targetId);
        setStatus(`Propojeno: ${a?.label || sourceId} ↔ ${b?.label || targetId}`);
    }

    function deleteNode(nodeId) {
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (!node) return;

        graphData.nodes = graphData.nodes.filter(n => n.id !== nodeId);
        graphData.links = graphData.links.filter(link => {
            const s = getNodeId(link.source);
            const t = getNodeId(link.target);
            return s !== nodeId && t !== nodeId;
        });

        selectedNodeId = null;
        saveGraph();
        rebindSimulation();
        updateGraph();
        setStatus(`Node "${node.label}" byl smazán.`);
    }

    function rebindSimulation() {
        simulation.nodes(graphData.nodes);
        simulation.force('link').links(graphData.links);
        simulation.alpha(1).restart();
    }

    function updateGraph() {
        const links = linkLayer
            .selectAll('line')
            .data(graphData.links, d => `${getNodeId(d.source)}-${getNodeId(d.target)}`);

        links.exit().remove();

        links.enter()
        .append('line')
        .attr('class', 'link')
        .on('click', function(event, d) {
            event.stopPropagation();

        const sourceId = getNodeId(d.source);
        const targetId = getNodeId(d.target);

        // odstranění linku
        graphData.links = graphData.links.filter(link => {
            const s = getNodeId(link.source);
            const t = getNodeId(link.target);

            return !(
                (s === sourceId && t === targetId) ||
                (s === targetId && t === sourceId)
            );
        });

        saveGraph();
        rebindSimulation();
        updateGraph();

        setStatus(`Spojení ${sourceId} ↔ ${targetId} bylo odstraněno`);
    })
    .merge(links);

        const nodes = nodeLayer
            .selectAll('g.node')
            .data(graphData.nodes, d => d.id);

        nodes.exit().remove();

        const nodesEnter = nodes.enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded)
            );

        nodesEnter.append('circle')
            .attr('r', 28)
            .attr('fill', '#6d4c41');

        nodesEnter.append('text')
            .text(d => shortLabel(d.label));

        const allNodes = nodesEnter.merge(nodes);

        allNodes
            .classed('selected', d => d.id === selectedNodeId)
            .on('click', function (event, d) {
                event.stopPropagation();

                if (selectedNodeId == null) {
                    selectedNodeId = d.id;
                    setStatus(`Vybrán node: ${d.label}. Teď klikni na další node pro propojení.`);
                } else if (selectedNodeId === d.id) {
                    const newLabel = prompt('Uprav název nodu:', d.label);
                    if (newLabel && newLabel.trim()) {
                        d.label = newLabel.trim();
                        saveGraph();
                        updateGraph();
                        setStatus(`Node přejmenován na "${d.label}".`);
                    } else {
                        setStatus(`Node zůstal vybraný: ${d.label}.`);
                    }
                } else {
                    connectNodes(selectedNodeId, d.id);
                    selectedNodeId = null;
                }

                updateGraph();
            });

        allNodes.select('text')
            .text(d => shortLabel(d.label));

        simulation.on('tick', () => {
            linkLayer.selectAll('line')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodeLayer.selectAll('g.node')
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        updateJsonPreview();
    }

    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        saveGraph();
        updateJsonPreview();
    }

    function loadGraph() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { nodes: [], links: [] };
            return JSON.parse(raw);
        } catch (err) {
            console.error('Chyba při načítání grafu:', err);
            return { nodes: [], links: [] };
        }
    }

    function saveGraph() {
        try {
            const cleanGraph = {
                nodes: graphData.nodes.map(n => ({
                    id: n.id,
                    label: n.label,
                    x: n.x,
                    y: n.y
                })),
                links: graphData.links.map(l => ({
                    source: getNodeId(l.source),
                    target: getNodeId(l.target)
                }))
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanGraph, null, 2));
            updateJsonPreview();
        } catch (err) {
            console.error('Chyba při ukládání grafu:', err);
        }
    }

    function exportGraphJson() {
        const cleanGraph = {
            nodes: graphData.nodes.map(n => ({
                id: n.id,
                label: n.label,
                x: Math.round(n.x || 0),
                y: Math.round(n.y || 0)
            })),
            links: graphData.links.map(l => ({
                source: getNodeId(l.source),
                target: getNodeId(l.target)
            }))
        };

        const blob = new Blob([JSON.stringify(cleanGraph, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'network-graph.json';
        a.click();
        URL.revokeObjectURL(url);

        setStatus('JSON byl exportován.');
    }

    function updateJsonPreview() {
        const cleanGraph = {
            nodes: graphData.nodes.map(n => ({
                id: n.id,
                label: n.label,
                x: Math.round(n.x || 0),
                y: Math.round(n.y || 0)
            })),
            links: graphData.links.map(l => ({
                source: getNodeId(l.source),
                target: getNodeId(l.target)
            }))
        };

        if (jsonPreview) {
            jsonPreview.textContent = JSON.stringify(cleanGraph, null, 2);
        }
    }

    function getNodeId(nodeOrId) {
        return typeof nodeOrId === 'object' ? nodeOrId.id : nodeOrId;
    }

    function shortLabel(text) {
        if (!text) return '';
        return text.length > 10 ? text.slice(0, 10) + '…' : text;
    }

    function setStatus(message) {
        if (statusEl) {
            statusEl.textContent = message;
        }
    }
}