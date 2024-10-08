from django.urls import path

from . import views

urlpatterns = [
    path("v1/", views.index, name="index"),
    path("v1/analyze/", views.analyze, name="analyze"),
    path("v1/files/<int:file_id>/", views.image, name="image"),
    path("v1/data_excel/", views.data_excel, name="data_excel")
]