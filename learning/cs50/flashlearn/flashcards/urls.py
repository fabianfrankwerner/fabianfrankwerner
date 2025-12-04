from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('study/<int:deck_id>/', views.study_deck, name='study'),
    path('review/<int:card_id>/<str:result>/', views.review_card, name='review'),
    path('create_deck/', views.create_deck, name='create_deck'),
    path('create_flashcard/', views.create_flashcard, name='create_flashcard'),
    path('delete_deck/<int:deck_id>/', views.delete_deck, name='delete_deck'),
    path('delete_flashcard/<int:card_id>/', views.delete_flashcard, name='delete_flashcard'),
]
