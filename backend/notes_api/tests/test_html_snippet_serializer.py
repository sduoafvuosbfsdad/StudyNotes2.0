from django.contrib.auth import get_user_model
from django.test import TestCase

from notes_api.models import HtmlSnippet
from notes_api.serializers import HtmlSnippetSerializer


class HtmlSnippetSerializerTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='pass')

    def test_untrusted_html_is_sanitized(self):
        serializer = HtmlSnippetSerializer(
            data={
                'key': 'sample-snippet',
                'html': '<p>Hello</p><script>alert(1)</script>',
                'is_trusted': False,
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['html'], '<p>Hello</p>alert(1)')

    def test_trusted_instance_keeps_html_on_partial_update_without_is_trusted(self):
        snippet = HtmlSnippet.objects.create(
            key='trusted-snippet',
            html='<p>Original</p>',
            is_trusted=True,
            created_by=self.user,
        )

        serializer = HtmlSnippetSerializer(
            snippet,
            data={'html': '<p>Updated</p><script>window.safe = true;</script>'},
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['html'], '<p>Updated</p><script>window.safe = true;</script>')
