from django.conf.urls import patterns, include, url
from django.views.generic import ListView
from games.models import Game
from django.conf import settings
from django.contrib.auth.views import login, logout

# import django_socketo.urls

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
#from dajaxice.core import dajaxice_autodiscover
#dajaxice_autodiscover()

urlpatterns = patterns('',
    # (r'^login/$', 'auth.views.login_user'),
    (r'^login/$', login),
    (r'^accounts/login/$', login),
    (r'^logout/$', logout, {'next_page': '/login/'}),
    # ("", include('django_socketio.urls')),
    (r'^hub/$', 'auth.views.display_hub'),
    (r'^games/$',
    	ListView.as_view(
    		queryset=Game.objects.order_by('-pubDate')[:50],
    		context_object_name = 'latest_games_list',
    		template_name='lucura/games.html')),
    (r'^games/(?P<game_id>\d+)/$', 'games.views.game'),
    (r'^build/$',
        ListView.as_view(
            queryset=Game.objects.order_by('-pubDate')[:50],
            context_object_name = 'latest_games_list',
            template_name='lucura/build_list.html')),
    (r'^build/(?P<game_id>\d+)/$', 'games.views.build_game'),
    (r'^social/$', 'auth.views.display_hub'),
    (r'^build/new_game/$', 'games.views.new_game'),
    (r'^save_game/$', 'games.views.save_game'),
    (r'^get_game/(?P<game_id>\d+)/$', 'games.views.get_game'),
    (r'^ajaxsubmit/$', 'games.views.ajaxsubmit'),
    (r'^messaging/$', 'games.views.message_view'),
    (r'^ape-jsf/(?P<url>.*)$', 'django.views.static.serve',{'document_root': 'ape-jsf'}),
    (r'^ape-jsfindex.html/(?P<url>.*)$', 'django.views.static.serve',{'document_root': 'ape-jsf'}),
    url(r'^admin/', include(admin.site.urls)),
    #(r'^%s/' % settings.DAJAXICE_MEDIA_PREFIX, include('dajaxice.urls')),
)