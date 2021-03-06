class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    before_filter :getServerUrl
    before_filter :get_current_user
    # before_filter :show_mode, :except => [:get_current_user]
    helper FlashHelper

    # app modes: "guest"
    # session modes: "loginUser", "logout", "profile"
    # users modes: "loginUser", "users", "signup", "editUser"
    # photos modes: "userPhotos", "showPhoto", "editPhoto", "updatePhoto", "newPhoto"
    # categories modes: "editCategory"

    def getServerUrl
        puts "******* getServerUrl " + "*" * 21
        reqUrl = request.original_url
        puts "     ** reqUrl " + reqUrl
        gon.currentServerUrl = reqUrl
    end

    def show_mode
        puts "******* show_mode " + "*" * 21
        flash[:notice] = "Mode: " + @mode
    end

    def make_selection_array(whichCategory)
        puts "******* make_selection_array " + "*" * 21
        category_array = []
        whichCategory.each do |category|
            category_array << category.name
        end
        return category_array
    end

    def get_current_user
        puts "******* get_current_user " + "*" * 21
        if session[:user_id]
            @current_user = User.find session[:user_id]
            if @current_user
                @user_name = @current_user.user_name
                return true
            else
                @mode = "guest"
                gon.mode = @mode
                return false
            end
        else
            @mode = "guest"
            gon.mode = @mode
            return false
        end
    end

    def get_genres_groups_tags
        puts "******* get_genres_groups_tags " + "*" * 21
        if @current_user
            @genres = Genre.all
            @groups = Group.all
            @tags = Tag.all
        end
    end

    def get_random_photo
        puts "******* get_random_photo " + "*" * 21
        if Photo.count > 0
            random_record = rand(Photo.count)
        else
            random_record = 0
        end
        if random_record > 0
            random_id = Photo.order(:id).offset(random_record).limit(1).first.id
            @photo = Photo.find_by_id(random_id)
            # binding.pry
            return @photo
        end
    end

    protected
        def authenticate_user
            puts "******* authenticate_user " + "*" * 21
            if session[:user_id]
                @current_user = User.find session[:user_id]
                return true
            else
                return false
            end
        end

        def save_login_state
            puts "******* save_login_state " + "*" * 21
            if session[:user_id]
                redirect_to(:controller => 'users', :action => 'home')
                return false
            else
                return true
            end
        end

end
