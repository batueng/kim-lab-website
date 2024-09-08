from django.shortcuts import render,  HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from common.utils.return_results import *
from common.utils.to_excel import *
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
        whole_length = 0
        whole_inner_average = 0
        whole_outer_average = 0
        for uploaded_file in uploaded_files:
            destination = f'common/tmp/{uploaded_file.name}'
            with open(destination, 'wb+') as file:
                for chunk in uploaded_file.chunks():
                    file.write(chunk)
            path, results, inner_sum, outer_sum, length = return_results(destination, scale)
            f = File(path=path, num_cells=len(results), data=json.dumps(list(results)))
            f.save()
            id = f.id

            response.append({
                "id": id,
                "filename": uploaded_file.name,
                "results": results,
                "inner_average": round(inner_sum / length, 2),
                "outer_average": round(outer_sum / length, 2)
            })
            whole_length += length
            whole_inner_average += inner_sum
            whole_outer_average += outer_sum
    else:
        return HttpResponse("Please send a POST request with a file.")

    whole_inner_average /= whole_length
    whole_outer_average /= whole_length
    d = {
        "whole_inner_average": round(whole_inner_average, 2),
        "whole_outer_average": round(whole_outer_average, 2),
        "files": response
    }
    to_excel(d, scale)
    return HttpResponse(json.dumps(d))

def image(request, file_id):
    file_object = File.objects.get(id=file_id)
    path = file_object.path
    with open(path, 'rb') as f:
        image_data = f.read()
    return HttpResponse(image_data, content_type='image/jpeg')

def data_excel(request):
    with open('common/tmp/excel/data.xlsx', 'rb') as f:
        data = f.read()
    response = HttpResponse(data, content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="data.xlsx"'
    return response