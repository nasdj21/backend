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

        # Referencia a la coleccion
        ref = db.reference(f'{self.collection_name}')

        # get: Obtiene todos los elementos de la coleccion
        data = ref.get()

        # Devuelve un arreglo JSON
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):

        # Referencia a coleccion
        ref = db.reference(f'{self.collection_name}')

        current_time = datetime.now()
        custom_format = current_time.strftime("%d/%m/%Y, %I:%M:%S %p").lower().replace('am', 'a. m.').replace('pm', 'p. m.')
        request.data.update({"saved": custom_format })

        # push: Guarda el objeto en la coleccion
        new_resource = ref.push(request.data)

        # devuelve el id del objeto guardado
        return Response({"id": new_resource.key}, status=status.HTTP_201_CREATED)

class LandingAPIDetail(APIView):

    name = 'Landing Detail API'

    collection_name = 'coleccion'

    def get(self, request, pk):
        # Referencia al documento
        ref = db.reference(f'{self.collection_name}/{pk}')
        data = ref.get()

        if data:
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        # Referencia al documento especifico
        ref = db.reference(f'{self.collection_name}/{pk}')
        data = ref.get()

        if data:
            # Validar que el cuerpo contenga datos
            if not request.data:
                return Response({"error": "No data provided for update"}, status=status.HTTP_400_BAD_REQUEST)

           
            ref.update(request.data) #Actualiza el doc
            return Response({"message": "Document updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Referencia al documento especifico
        ref = db.reference(f'{self.collection_name}/{pk}')
        data = ref.get()

        if data:
            # Eliminar el documento
            ref.delete()
            return Response({"message": "Document deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
