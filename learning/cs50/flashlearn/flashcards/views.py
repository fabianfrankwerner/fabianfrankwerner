from django.shortcuts import render, redirect, get_object_or_404
from .models import Deck, Flashcard
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import datetime, timedelta

from .forms import Profile, DeckForm, FlashcardForm

@login_required
def home(request):
    decks = Deck.objects.filter(user=request.user)
    deck_stats = []

    today = timezone.now().date()
    for deck in decks:
        flashcards = Flashcard.objects.filter(deck=deck)
        due_today = flashcards.filter(next_review__date=today).count()
        due_soon = flashcards.filter(next_review__date__gt=today, next_review__date__lte=today + timedelta(days=3)).count()
        mastered = flashcards.filter(interval__gte=30).count()

        total = flashcards.count()
        progress = int(((total - due_today - due_soon) / total) * 100) if total > 0 else 0

        deck_stats.append({
            "deck": deck,
            "due_today": due_today,
            "due_soon": due_soon,
            "mastered": mastered,
            "progress": progress,
        })

    # Streak tracking
    profile, created = Profile.objects.get_or_create(user=request.user)
    if profile.last_practiced != today:
        if profile.last_practiced == today - timedelta(days=1):
            profile.streak += 1
        else:
            profile.streak = 1
        profile.last_practiced = today
        profile.save()

    return render(request, 'flashcards/home.html', {
        "deck_stats": deck_stats,
        "streak": profile.streak
    })

@login_required
def study_deck(request, deck_id):
    deck = get_object_or_404(Deck, pk=deck_id, user=request.user)
    flashcards = Flashcard.objects.filter(deck=deck, next_review__lte=timezone.now()).values("id", "front", "back")
    return render(request, "flashcards/study.html", {
        "deck": deck,
        "flashcards": list(flashcards)
    })

@login_required
def review_card(request, card_id, result):
    card = get_object_or_404(Flashcard, pk=card_id, deck__user=request.user)
    card.update_schedule(correct=(result == "correct"))
    return JsonResponse({"status": "updated"})

@login_required
def create_deck(request):
    if request.method == "POST":
        form = DeckForm(request.POST)
        if form.is_valid():
            deck = form.save(commit=False)
            deck.user = request.user
            deck.save()
            return redirect('home')
    else:
        form = DeckForm()
    return render(request, 'flashcards/create_deck.html', {'form': form})

@login_required
def create_flashcard(request):
    if request.method == "POST":
        form = FlashcardForm(request.POST)
        form.fields['deck'].queryset = Deck.objects.filter(user=request.user)
        if form.is_valid():
            card = form.save()
            return redirect('home')
    else:
        form = FlashcardForm()
        form.fields['deck'].queryset = Deck.objects.filter(user=request.user)
    return render(request, 'flashcards/create_flashcard.html', {'form': form})

@login_required
def delete_deck(request, deck_id):
    deck = get_object_or_404(Deck, id=deck_id)

    # Only allow the owner to delete
    if deck.user != request.user:
        return HttpResponseForbidden("You can't delete this deck.")

    if request.method == "POST":
        deck.delete()
        return redirect("home")

    return render(request, "flashcards/confirm_delete.html", {"deck": deck})

@login_required
def delete_flashcard(request, card_id):
    card = get_object_or_404(Flashcard, id=card_id, deck__user=request.user)
    deck_id = card.deck.id
    card.delete()
    return redirect("study", deck_id=deck_id)
