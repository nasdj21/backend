from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime
	
from firebase_admin import db

class LandingAPI(APIView):
 
    name = 'Landing API'

     # Coloque el nombre de su colección en el Realtime Database
    collection_name = 'coleccion'

    def get(self, request):

        #Referencia a la coleccion
        ref = db.reference(f'{self.collection_name}')

        #get: Obtiene todos los elementos de la coleccion
        data = ref.get()

        #Devuelve un arreglo JSON
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):

        #Referencia a coleccion
        ref = db.reference(f'{self.collection_name}')

        current_time = datetime.now()
        custom_format = current_time.strftime("%d/%m/%Y, %I:%M:%S %p").lower().replace('am', 'a. m.').replace('pm', 'p. m.')
        request.data.update({"saved": custom_format })

        #push: Guarda el objeto en la coleccion
        new_resource = ref.push(request.data)

        #devuelve el id del objeto guardado
        return Response({"id": new_resource.key}, status=status.HTTP_201_CREATED)

