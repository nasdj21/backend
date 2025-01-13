from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


# Importe requests y json
import requests
import json


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


    #Objeto con los datos a render
    data = {
        'title':'Landing - Dashboard',
        'total_responses':total_response,
        'responses': responses
    }

    return render(request, 'main/index.html', data)




