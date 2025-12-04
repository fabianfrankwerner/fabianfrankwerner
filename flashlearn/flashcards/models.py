from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver

class Deck(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

class Flashcard(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    front = models.CharField(max_length=255)
    back = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    next_review = models.DateTimeField(default=datetime.now)
    interval = models.IntegerField(default=1)  # days

    def update_schedule(self, correct=True):
        if correct:
            self.interval *= 2
        else:
            self.interval = 1
        self.next_review = datetime.now() + timedelta(days=self.interval)
        self.save()

    def __str__(self):
        return self.front

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    last_practiced = models.DateField(null=True, blank=True)
    streak = models.IntegerField(default=0)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
