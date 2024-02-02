from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.utils.translation import gettext_lazy as _

urlpatterns = i18n_patterns(
    path(_('admin/'), admin.site.urls),
    path(_('rosetta/'), include('rosetta.urls')),
    path('', include('website.urls'))
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
