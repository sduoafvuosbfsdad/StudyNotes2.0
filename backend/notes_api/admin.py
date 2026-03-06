from django.contrib import admin
from .models import Document, DocumentVersion, HtmlSnippet

admin.site.register(Document)
admin.site.register(DocumentVersion)
admin.site.register(HtmlSnippet)
