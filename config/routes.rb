Rails.application.routes.draw do

    resources :users do
        resources :photos
    end
    # resources :genres
    # resources :groups
    # resources :tags

    root :to => "users#home"
    get "/home" => "users#home"
    get "/home/:id" => "photos#getPhoto"
    get "/users/:id/home" => "users#home"
    patch "/users/:id/home" => "users#home"
    patch "/users/:id/photos" => "users#home"

    get "/genres" => "categories#genres"
    get "/groups" => "categories#groups"
    get "/tags" => "categories#tags"

    get "getPhoto/:id" => "photos#getPhoto"
    get "getSelectedPhotos" => "photos#getSelectedPhotos"
    get "getUserPhotos" => "photos#getUserPhotos"
    get "showPhoto/:id" => "photos#show"
    post "newPhoto/" => "photos#new"
    patch "updatePhoto/:id" => "photos#update"

    get "/login" => "sessions#login"
    get "/loginForm" => "sessions#loginForm"
    get "/login_attempt" => "sessions#login_attempt"
    post "/login_attempt" => "sessions#login_attempt"
    get "/logout" => "sessions#logout"

    get "/signup" => "users#new"
    post "/signup" => "users#create"

    get "/profile" => "sessions#profile"
    get "/setting" => "sessions#setting"
    get "/sessions/get_user" => "sessions#get_user"

end
