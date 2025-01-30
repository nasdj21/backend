from django.shortcuts import render
from django.contrib.auth.decorators import login_required, permission_required
from collections import Counter
from datetime import datetime
from api.views import LandingAPI


@login_required
@permission_required('main.index_viewer', raise_exception=True)
def index(request):
    try:
        # Llamar a la API directamente
        api = LandingAPI()
        response = api.get(request)
        response_dict = response.data if response.data else {}  # Verificar si hay datos

        # Si la respuesta está vacía, inicializar variables para evitar errores
        if not response_dict:
            return render(request, 'main/index.html', {
                'title': 'Landing - Dashboard',
                'total_responses': 0,
                'responses': [],
                'first_responses': None,
                'last_responses': None,
                'high_rate_responses': None,
            })

        # Respuestas totales
        total_response = len(response_dict.keys())

        # Valores de la respuesta
        # Convertir a lista para evitar problemas
        responses = list(response_dict.values())

        # Obtener la primera y última respuesta
        first_responses = responses[0].get('saved') if responses else None
        last_responses = responses[-1].get('saved') if responses else None

        # Calcular el día con más respuestas
        date_counter = Counter()
        for response in responses:
            saved_date = response.get('saved')
            if saved_date:
                try:
                    date_obj = datetime.strptime(saved_date, "%d/%m/%Y")
                    weekday = date_obj.strftime("%A")
                    date_counter[weekday] += 1
                except ValueError:
                    continue

        # Día con más respuestas
        high_rate_responses = max(
            date_counter, key=date_counter.get) if date_counter else None

        # Datos a renderizar en la plantilla
        data = {
            'title': 'Landing - Dashboard',
            'total_responses': total_response,
            'responses': responses,
            'first_responses': first_responses,
            'last_responses': last_responses,
            'high_rate_responses': high_rate_responses,
        }

        return render(request, 'main/index.html', data)

    except Exception as e:
        # Manejo de errores generales
        return render(request, 'main/index.html', {
            'title': 'Landing - Dashboard',
            'error': f"Ocurrió un error: {str(e)}",
        })
