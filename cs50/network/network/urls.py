from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("posts", views.all_posts, name="all_posts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.new_post, name="new_post"),
    path("profile/<str:username>/", views.profile, name="profile"),
    path("profile_posts/<str:username>/", views.profile_posts, name="profile_posts"),
    path("follow/<str:username>", views.follow_toggle, name="follow_toggle"),
    path("following", views.following, name="following"),
    path("following_posts", views.following_posts, name="following_posts"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit_post"),
    path("like_post/<int:post_id>", views.like_post, name="like_post")
]
