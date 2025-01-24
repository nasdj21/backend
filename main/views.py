from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, permission_required
from collections import Counter
from datetime import datetime


# Importe requests y json
import requests
import json

# Restricción de acceso con @login_required y permisos con @permission_required
@login_required
@permission_required('main.index_viewer', raise_exception=True)
def index(request):

    # Arme el endpoint del REST API
    current_url = request.build_absolute_uri()
    url = current_url + '/api/v1/landing'

    # Petición al REST API
    response_http = requests.get(url)
    response_dict = json.loads(response_http.content)


    # Respuestas totales
    total_response = len(response_dict.keys())

    
    #Valores de la respuesta
    responses = response_dict.values()

    #primera respuesta
    if responses: #Verifica que no este vacio       
        first_key = list(response_dict.keys())[0]  # Verifica que haya claves
        first_response = response_dict.get(first_key, {})
        first_responses = first_response.get('saved') #Extrae la fecha de saved

    #Ultima respuesta
    if responses: #Verifica que no este vacio       
        last_key = list(response_dict.keys())[-1]  # Verifica que haya claves
        last_response = response_dict.get(last_key, {})
        last_responses = last_response.get('saved') #Extrae la fecha de saved

     # Calcular el día con más respuestas
    date_counter = Counter()  # Contador para almacenar la cantidad de respuestas por día
    for response in response_dict.values():
        saved_date = response.get('saved')  # Extraer la fecha de 'saved'
        if saved_date:
            try:
                # Parsear la fecha en formato dd/mm/aaaa
                date_obj = datetime.strptime(saved_date, "%d/%m/%Y")
                weekday = date_obj.strftime("%A")  # Obtener el día de la semana como texto
                date_counter[weekday] += 1  # Incrementar el contador para ese día
            except ValueError:
                continue  # Omitir errores de formato

    # Encontrar el día con más respuestas
    high_rate_responses= None
    if date_counter:
        high_rate_responses = max(date_counter, key=date_counter.get)  # Día con más respuestas
     
    #Objeto con los datos a render
    data = {
        'title':'Landing - Dashboard',
        'total_responses':total_response,
        'responses': responses,
        'first_responses': first_responses,
        'last_responses': last_responses,
        'high_rate_responses': high_rate_responses,
    }

    return render(request, 'main/index.html', data)




