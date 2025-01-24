// Configuración inicial del gráfico de líneas
const lineConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
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
          text: 'Día de la Semana',
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

// Generador de colores fijos para regiones
const regionColors = {};
const colorPalette = [
  '#4CAF50', // Verde esmeralda
  '#FF9800', // Naranja brillante
  '#03A9F4', // Azul claro
  '#E91E63', // Rosa vibrante
  '#9C27B0', // Púrpura profundo
  '#FFC107', // Amarillo cálido
  '#00BCD4', // Turquesa
  '#8BC34A', // Verde lima
  '#FF5722', // Rojo anaranjado
  '#607D8B', // Azul grisáceo
];

let colorIndex = 0;

const getColorForRegion = (region) => {
  if (!regionColors[region]) {
    // Asignar un color de la paleta si no se ha asignado antes
    regionColors[region] = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;
  }
  return regionColors[region];
};

// Función para agrupar respuestas por región y día
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

// Función para preparar los datos del gráfico
const prepareChartData = (groupedData) => {
  const regions = Object.keys(groupedData);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const datasets = regions.map((region) => ({
    label: region,
    data: daysOfWeek.map((day) => groupedData[region][day] || 0),
    borderColor: getColorForRegion(region), // Asignar color fijo a cada región
    backgroundColor: getColorForRegion(region), // Usar el mismo color para el fondo
    fill: false,
  }));

  return { labels: daysOfWeek, datasets };
};

// Función para actualizar el gráfico
const updateLineChart = () => {
  fetch('/api/v1/landing')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
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

// Llamar a la función para actualizar el gráfico
updateLineChart();
