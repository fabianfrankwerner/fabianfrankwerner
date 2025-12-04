from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
import json

from .models import User, Post, Follow


def index(request):
    return render(request, "network/index.html")


def all_posts(request):
    posts = Post.objects.all().order_by('-timestamp')
    paginator = Paginator(posts, 10)  # Show 10 posts per page

    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    return JsonResponse({
        "posts": [
            {
                "id": post.id,
                "user": post.user.username,
                "content": post.content,
                "timestamp": post.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "likes": post.like_count(),
                "liked_by_user": request.user.is_authenticated and post.likes.filter(id=request.user.id).exists(),
                "is_users_post": request.user.is_authenticated and post.user.id == request.user.id
            }
            for post in page_obj
        ],
        "has_next": page_obj.has_next(),
        "has_previous": page_obj.has_previous(),
        "num_pages": paginator.num_pages,
        "current_page": page_obj.number
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def new_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get("content", "")
        if content:
            post = Post(user=request.user, content=content)
            post.save()
            return JsonResponse({"message": "Post created successfully."}, status=201)
        return JsonResponse({"error": "Content cannot be empty."}, status=400)
    return JsonResponse({"error": "POST request required."}, status=400)


@login_required
def profile(request, username):
    user = get_object_or_404(User, username=username)
    is_following = False

    if request.user.is_authenticated:
        is_following = Follow.objects.filter(user=request.user, following=user).exists()

    followers_count = Follow.objects.filter(following=user).count()
    following_count = Follow.objects.filter(user=user).count()

    return render(request, 'network/profile.html', {
        'profile_user': user,
        'followers_count': followers_count,
        'following_count': following_count,
        'is_following': is_following
    })


def profile_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(user=user).order_by('-timestamp')

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    return JsonResponse({
        "posts": [
            {
                "id": post.id,
                "user": post.user.username,
                "content": post.content,
                "timestamp": post.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "likes": post.like_count(),
                "liked_by_user": request.user.is_authenticated and post.likes.filter(id=request.user.id).exists(),
                "is_users_post": request.user.is_authenticated and post.user.id == request.user.id
            }
            for post in page_obj
        ],
        "has_next": page_obj.has_next(),
        "has_previous": page_obj.has_previous(),
        "num_pages": paginator.num_pages,
        "current_page": page_obj.number
    })


@csrf_exempt
@login_required
def follow_toggle(request, username):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    target = get_object_or_404(User, username=username)

    # Cannot follow yourself
    if request.user == target:
        return JsonResponse({"error": "Cannot follow yourself."}, status=400)

    follow_exists = Follow.objects.filter(user=request.user, following=target).exists()

    if follow_exists:
        # Unfollow
        Follow.objects.filter(user=request.user, following=target).delete()
        is_following = False
    else:
        # Follow
        Follow.objects.create(user=request.user, following=target)
        is_following = True

    followers_count = Follow.objects.filter(following=target).count()

    return JsonResponse({
        "is_following": is_following,
        "followers_count": followers_count
    })


@login_required
def following(request):
    return render(request, "network/following.html")


@login_required
def following_posts(request):
    following_users = Follow.objects.filter(user=request.user).values_list('following', flat=True)
    posts = Post.objects.filter(user__in=following_users).order_by('-timestamp')

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    return JsonResponse({
        "posts": [
            {
                "id": post.id,
                "user": post.user.username,
                "content": post.content,
                "timestamp": post.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "likes": post.like_count(),
                "liked_by_user": post.likes.filter(id=request.user.id).exists(),
                "is_users_post": post.user.id == request.user.id
            }
            for post in page_obj
        ],
        "has_next": page_obj.has_next(),
        "has_previous": page_obj.has_previous(),
        "num_pages": paginator.num_pages,
        "current_page": page_obj.number
    })


@csrf_exempt
@login_required
def edit_post(request, post_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    post = get_object_or_404(Post, id=post_id)

    # Ensure the user can only edit their own posts
    if post.user != request.user:
        return JsonResponse({"error": "Cannot edit another user's post."}, status=403)

    data = json.loads(request.body)
    post.content = data.get("content", post.content)
    post.save()

    return JsonResponse({
        "message": "Post updated successfully.",
        "content": post.content
    })


@csrf_exempt
@login_required
def like_post(request, post_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    post = get_object_or_404(Post, id=post_id)

    if post.likes.filter(id=request.user.id).exists():
        # User has already liked the post, so unlike it
        post.likes.remove(request.user)
        liked = False
    else:
        # User hasn't liked the post yet, so like it
        post.likes.add(request.user)
        liked = True

    return JsonResponse({
        "liked": liked,
        "count": post.like_count()
    })
