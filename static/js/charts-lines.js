// Configuración inicial del gráfico de líneas
const lineConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Respuestas por Región',
        data: [],
        borderColor: '#0694a2',
        backgroundColor: '#0694a2',
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top', 
      },
      title: {
        display: true,
        text: 'Respuestas por Región',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Región',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Número de Respuestas',
        },
        beginAtZero: true, // Asegurar que el eje Y comience en 0
        ticks: {
          callback: (value) => Math.floor(value), // Mostrar únicamente números enteros
        },
      },
    },
  },
};

// Crear el gráfico en el canvas con ID 'line'
const lineCtx = document.getElementById('line');
window.myLine = new Chart(lineCtx, lineConfig);

// Función para procesar los datos agrupados por región
const countResponsesByRegion = (data) => {
  const regions = ['Asia', 'Norte America', 'Centro America', 'Sudamerica', 'Africa', 'Europa', 'Oceania'];
  const counts = Array(regions.length).fill(0); 
  console.log(counts)

  // Procesar los registros
  Object.values(data).forEach((record) => {
    const region = record.region;
    if (!region) return;

    const index = regions.indexOf(region);
    if (index !== -1) {
      counts[index]++; // Incrementar el contador de la región correspondiente
    }
  });

  return { labels: regions, counts };
};

// Función para actualizar el gráfico
const updateLineChart = () => {
  fetch('/api/v1/landing')
    .then((response) => response.json())
    .then((data) => {
      const { labels, counts } = countResponsesByRegion(data);

      window.myLine.data.labels = [];
      window.myLine.data.datasets[0].data = [];

      window.myLine.data.labels = [...labels];
      window.myLine.data.datasets[0].data = [...counts];

      window.myLine.update();
    })
    .catch((error) => console.error('Error:', error));
};

// Llamar a la función para actualizar el gráfico
updateLineChart();
