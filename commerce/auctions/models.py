from django.contrib.auth.models import User, AbstractUser
from django.db import models

class User(AbstractUser):
    watchlist = models.ManyToManyField('Listing', blank=True, related_name="watched_by")

class Listing(models.Model):
    CATEGORY_CHOICES = [
        ('fashion', 'Fashion'),
        ('toys', 'Toys'),
        ('electronics', 'Electronics'),
        ('home', 'Home'),
        ('other', 'Other')
    ]

    title = models.CharField(max_length=64)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image_url = models.URLField(blank=True)
    category = models.CharField(max_length=64, choices=CATEGORY_CHOICES, blank=True)
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    winner = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="won_auctions")
    created_at = models.DateTimeField(auto_now_add=True)
    watchlist = models.ManyToManyField(User, blank=True, related_name="watchlisted_listings")

    def __str__(self):
        return f"{self.title} (${self.current_price or self.starting_bid})"

class Bid(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")
    bidder = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder} bid ${self.amount} on {self.listing}"

class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.commenter} on {self.listing}: {self.content}"
