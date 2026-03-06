from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Document, DocumentVersion, HtmlSnippet
from .serializers import DocumentSerializer, DocumentVersionSerializer, HtmlSnippetSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(_request):
    return Response({'status': 'ok'})


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-updated_at')
    serializer_class = DocumentSerializer


class DocumentVersionViewSet(viewsets.ModelViewSet):
    queryset = DocumentVersion.objects.select_related('document', 'created_by').all()
    serializer_class = DocumentVersionSerializer

    def perform_create(self, serializer: DocumentVersionSerializer) -> None:
        serializer.save(created_by=self.request.user)


class HtmlSnippetViewSet(viewsets.ModelViewSet):
    queryset = HtmlSnippet.objects.select_related('created_by').all().order_by('-updated_at')
    serializer_class = HtmlSnippetSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]

        # Restrict snippet write operations to staff/admin users in production.
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer: HtmlSnippetSerializer) -> None:
        serializer.save(created_by=self.request.user)
