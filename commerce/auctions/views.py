from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib import messages

from .forms import ListingForm
from .models import User, Listing, Bid, Comment


def index(request):
    active_listings = Listing.objects.filter(is_active=True)
    return render(request, "auctions/index.html", {
        "listings": active_listings
    })


def categories(request):
    # Get all unique categories with at least one active listing
    category_set = Listing.CATEGORY_CHOICES
    return render(request, "auctions/categories.html", {
        "categories": category_set
    })


def category_listings(request, category_name):
    listings = Listing.objects.filter(category=category_name, is_active=True)
    category_display = dict(Listing.CATEGORY_CHOICES).get(category_name, "Unknown")
    return render(request, "auctions/category_listings.html", {
        "listings": listings,
        "category": category_display
    })


def listing(request, listing_id):
    listing = get_object_or_404(Listing, pk=listing_id)
    comments = Comment.objects.filter(listing=listing)
    is_in_watchlist = request.user.is_authenticated and listing in request.user.watchlist.all()
    highest_bid = listing.bids.order_by('-amount').first()
    is_owner = request.user == listing.owner
    is_winner = request.user == highest_bid.bidder if listing.is_active is False and highest_bid else False

    return render(request, "auctions/listing.html", {
        "listing": listing,
        "comments": comments,
        "is_in_watchlist": is_in_watchlist,
        "highest_bid": highest_bid,
        "is_owner": is_owner,
        "is_winner": is_winner
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


@login_required
def create_listing(request):
    if request.method == "POST":
        form = ListingForm(request.POST)
        if form.is_valid():
            listing = form.save(commit=False)
            listing.owner = request.user
            listing.current_price = form.cleaned_data['starting_bid']
            listing.save()
            return redirect("index")  # redirect to homepage or active listings
    else:
        form = ListingForm()

    return render(request, "auctions/create_listing.html", {
        "form": form
    })


@login_required
def toggle_watchlist(request, listing_id):
    listing = get_object_or_404(Listing, pk=listing_id)
    if request.user in listing.watchlist.all():
        listing.watchlist.remove(request.user)
    else:
        listing.watchlist.add(request.user)
    return redirect("listing", listing_id=listing_id)


@login_required
def watchlist(request):
    listings = request.user.watchlisted_listings.all()
    return render(request, "auctions/watchlist.html", {"listings": listings})


@login_required
def place_bid(request, listing_id):
    listing = get_object_or_404(Listing, pk=listing_id)

    if not listing.is_active:
        messages.error(request, "This auction is closed.")
        return redirect("listing", listing_id=listing.id)

    if request.method == "POST":
        bid_amount = request.POST.get("bid")
        try:
            bid_amount = float(bid_amount)
        except ValueError:
            messages.error(request, "Invalid bid amount.")
            return redirect("listing", listing_id=listing.id)

        current_highest_bid = listing.bids.order_by("-amount").first()
        min_required = max(listing.starting_bid, current_highest_bid.amount if current_highest_bid else 0)

        if bid_amount <= min_required:
            messages.error(request, f"Bid must be greater than ${min_required:.2f}.")
            return redirect("listing", listing_id=listing.id)

        Bid.objects.create(bidder=request.user, listing=listing, amount=bid_amount)
        listing.current_price = bid_amount
        listing.save()
        messages.success(request, "Your bid has been placed successfully!")
        return redirect("listing", listing_id=listing.id)


@login_required
def close_auction(request, listing_id):
    listing = get_object_or_404(Listing, pk=listing_id)

    if request.user != listing.owner:
        messages.error(request, "Only the owner can close this auction.")
        return redirect("listing", listing_id=listing.id)

    highest_bid = listing.bids.order_by("-amount").first()
    if highest_bid:
        listing.winner = highest_bid.bidder
    listing.is_active = False
    listing.save()

    messages.success(request, "Auction closed successfully.")
    return redirect("listing", listing_id=listing.id)


@login_required
def add_comment(request, listing_id):
    listing = get_object_or_404(Listing, pk=listing_id)

    if request.method == "POST":
        content = request.POST.get("comment")
        if content.strip():
            Comment.objects.create(
                listing=listing,
                commenter=request.user,
                content=content
            )
            messages.success(request, "Comment added.")
        else:
            messages.error(request, "Comment cannot be empty.")
    return redirect("listing", listing_id=listing.id)
