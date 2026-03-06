import bleach
from rest_framework import serializers
from .models import Document, DocumentVersion, HtmlSnippet


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'slug', 'title', 'locale', 'status', 'created_at', 'updated_at']


class DocumentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'version_number', 'content_json', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']


class HtmlSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = HtmlSnippet
        fields = ['id', 'key', 'html', 'is_trusted', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def validate_html(self, value: str) -> str:
        raw_is_trusted = self.initial_data.get('is_trusted', None)

        if raw_is_trusted is None and self.instance is not None:
            raw_is_trusted = self.instance.is_trusted

        is_trusted = raw_is_trusted if isinstance(raw_is_trusted, bool) else str(raw_is_trusted).lower() in {'1', 'true', 'yes'}

        # For untrusted snippets, strip script and dangerous attributes to reduce XSS risk.
        if not is_trusted:
            allowed_tags = bleach.sanitizer.ALLOWED_TAGS.union({'div', 'span', 'p', 'img', 'section', 'article'})
            allowed_attributes = {
                '*': ['class', 'id', 'title'],
                'a': ['href', 'title', 'target', 'rel'],
                'img': ['src', 'alt', 'title', 'width', 'height'],
            }
            return bleach.clean(value, tags=allowed_tags, attributes=allowed_attributes, strip=True)

        return value
