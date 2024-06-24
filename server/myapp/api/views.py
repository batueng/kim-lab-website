from django.shortcuts import render,  HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from common.utils.return_results import *
from api.models import File

# Create your views here.
def index(request):
    """Return a list of services available."""
    response = {
        "analyze": "/api/v1/analyze"
    }
    return JsonResponse(response)

@csrf_exempt
def analyze(request):
    """Analyze file and return information."""
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        scale = request.POST.get('scale', None)
        if scale is None:
            return JsonResponse({'error': 'No scale provided'}, status=400)
        
        try:
            scale = int(scale)
        except ValueError:
            return JsonResponse({'error': 'Scale must be an integer'}, status=400)
        
        uploaded_files = request.FILES.getlist('file')
        scale = int(request.POST.get('scale'))
        response = []
        
        for uploaded_file in uploaded_files:
            destination = f'common/tmp/{uploaded_file.name}'
            with open(destination, 'wb+') as file:
                for chunk in uploaded_file.chunks():
                    file.write(chunk)
            path, results = return_results(destination, scale)
            f = File(path=path, num_cells=len(results), data=json.dumps(list(results)))
            f.save()
            id = f.id

            response.append({"id": id, "filename": uploaded_file.name,"results": results})
    else:
        return HttpResponse("Please send a POST request with a file.")

    return HttpResponse(json.dumps(response))

def image(request, file_id):
    file_object = File.objects.get(id=file_id)
    path = file_object.path
    with open(path, 'rb') as f:
        image_data = f.read()
    return HttpResponse(image_data, content_type='image/jpeg')