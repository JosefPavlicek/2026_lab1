window.onload = function () {
    const ctx = document.getElementById('myPieChart').getContext('2d');

    const outerData = [12, 19, 3]; // původní 3 barvy
    const innerData = [4, 3, 3, 2]; // kávy uvnitř

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
                        'rgba(255, 99, 132, 0.8)', // Červená
                        'rgba(54, 162, 235, 0.8)', // Modrá
                        'rgba(255, 205, 86, 0.8)'  // Žlutá
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
                        '#5D4037', // Espresso
                        '#795548', // Lungo
                        '#8D6E63', // Americano
                        '#A1887F'  // Latte
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
                        label: function(context) {
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
};