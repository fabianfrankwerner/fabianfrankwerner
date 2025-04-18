from django import forms
from .models import Profile, Deck, Flashcard

class DeckForm(forms.ModelForm):
    class Meta:
        model = Deck
        fields = ['title']

class FlashcardForm(forms.ModelForm):
    class Meta:
        model = Flashcard
        fields = ['deck', 'front', 'back']
