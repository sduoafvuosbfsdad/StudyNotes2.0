from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DocumentViewSet, DocumentVersionViewSet, HtmlSnippetViewSet, health_check

router = DefaultRouter()
router.register('documents', DocumentViewSet, basename='documents')
router.register('document-versions', DocumentVersionViewSet, basename='document-versions')
router.register('html-snippets', HtmlSnippetViewSet, basename='html-snippets')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
]
