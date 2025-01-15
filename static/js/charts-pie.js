// Configuración inicial del gráfico
const pieConfig = {
  type: 'doughnut',
  data: {
    datasets: [
      {
        data: [], // Inicialmente vacío
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2', '#f97316', '#10b981', '#6366f1', '#d97706'],
        label: 'Comentarios por Región',
      },
    ],
    labels: [], // Inicialmente vacío
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
    legend: {
      display: true,
      position: 'bottom', // Muestra las etiquetas debajo del gráfico
    },
  },
};

// Crear el gráfico en el canvas con ID 'pie'
const pieCtx = document.getElementById('pie');
window.myPie = new Chart(pieCtx, pieConfig);

// Función para procesar el JSON
const countCommentsByRegion = (data) => {
  // Inicializar contadores para cada región
  const labels = ['Asia', 'Norte America', 'Centro America', 'Sudamerica', 'Africa', 'Europa', 'Oceania'];
  const counts = Array(labels.length).fill(0); // Crear un array de ceros con longitud igual a las etiquetas

  // Procesar los registros
  Object.values(data).forEach((record) => {
    const savedRegion = record.region;
    if (!savedRegion) return;

    // Buscar el índice de la región en las etiquetas
    const index = labels.indexOf(savedRegion);
    if (index !== -1) {
      counts[index]++; // Incrementar el contador de la región correspondiente
    }
  });

  return { labels, counts };
};

// Función para actualizar el gráfico
const update = () => {
  fetch('/api/v1/landing') 
    .then((response) => response.json())
    .then((data) => {
      // Procesar datos del JSON
      const { labels, counts } = countCommentsByRegion(data);

      // Resetear datos actuales del gráfico
      window.myPie.data.labels = [];
      window.myPie.data.datasets[0].data = [];

      // Asignar nuevos datos al gráfico
      window.myPie.data.labels = [...labels];
      window.myPie.data.datasets[0].data = [...counts];

      // Refrescar el gráfico para reflejar los nuevos datos
      window.myPie.update();
    })
    .catch((error) => console.error('Error:', error));
};

// Llamar a la función de actualización
update();
