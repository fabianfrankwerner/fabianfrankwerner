from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create/", views.create_listing, name="create_listing"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<int:listing_id>/", views.listing, name="listing"),
    path("watchlist/<int:listing_id>/toggle/", views.toggle_watchlist, name="toggle_watchlist"),
    path("watchlist/", views.watchlist, name="watchlist"),
    path("bid/<int:listing_id>/", views.place_bid, name="place_bid"),
    path("close/<int:listing_id>/", views.close_auction, name="close_auction"),
    path("comment/<int:listing_id>/", views.add_comment, name="add_comment"),
    path("categories/", views.categories, name="categories"),
    path("categories/<str:category_name>/", views.category_listings, name="category_listings")
]
