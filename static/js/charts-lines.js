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
        beginAtZero: true,
        ticks: {
          callback: (value) => parseInt(value, 10),
        },
      },
    },
  },
};

// Crear el gráfico en el canvas con ID 'line'
const lineCtx = document.getElementById('line');
window.myLine = new Chart(lineCtx, lineConfig);
const groupResponsesByRegionAndDay = (data) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const groupedData = {};

  data.forEach((record) => {
    const region = record.region;
    const savedDate = record.saved;

    if (!region || !savedDate) return;

    const dayOfWeek = daysOfWeek[new Date(savedDate).getDay()];

    if (!groupedData[region]) {
      groupedData[region] = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
      };
    }

    groupedData[region][dayOfWeek]++;
  });

  return groupedData;
};

const prepareChartData = (groupedData) => {
  const regions = Object.keys(groupedData);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const datasets = regions.map((region) => ({
    label: region,
    data: daysOfWeek.map((day) => groupedData[region][day] || 0),
    borderColor: getRandomColor(),
    backgroundColor: getRandomColor(),
    fill: false,
  }));

  return { labels: daysOfWeek, datasets };
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


// Función para actualizar el gráfico
const updateLineChart = () => {
  fetch('/api/v1/landing')
    .then((response) => response.json())
    .then((data) => {
      const dataArray = Array.isArray(data) ? data : Object.values(data);

      const groupedData = groupResponsesByRegionAndDay(dataArray);

      const { labels, datasets } = prepareChartData(groupedData);

      window.myLine.data.labels = labels;
      window.myLine.data.datasets = datasets; 

      // Refrescar el gráfico
      window.myLine.update();
    })
    .catch((error) => console.error('Error:', error));
};


updateLineChart();
