class UsersController < ApplicationController
    before_filter :get_genres_groups_tags
    skip_before_filter :verify_authenticity_token, :only=> :home
    # layout proc { false if request.xhr? }

    def home
        puts "******* home " + "*" * 21
        if @current_user
            @genres = Genre.all
            @groups = Group.all
            @tags = Tag.all
            @mode = "loginUser"
            gon.mode = @mode
            gon.userId = session[:user_id]
            gon.genres = make_selection_array(@genres)
            gon.groups = make_selection_array(@groups)
            gon.tags = make_selection_array(@tags)
        end
        @photo = get_random_photo
    end

    def index
        puts "******* index " + "*" * 21
        @users = User.all
        @mode = "users"
        gon.mode = @mode
    end

    def new
        puts "******* new " + "*" * 21
        @user = User.new
        @mode = "signup"
        gon.mode = @mode
    end

    def create
        puts "******* create " + "*" * 21
        @user = User.new(user_params)
        respond_to do |format|
            if @user.save
                session[:user_id] = @user.id
                @current_user = User.find session[:user_id]
                # format.html { redirect_to home_path(@user), notice: 'New user created.' }
                format.html { redirect_to home_path, notice: 'New user created.' }
            else
                format.html { render :new }
            end
        end
    end

    def show
        puts "******* show " + "*" * 21
        @user = User.find(params[:id])
        @mode = "profile"
        gon.mode = @mode
    end

    def edit
        puts "******* edit " + "*" * 21
        @user = User.find(params[:id])
        @mode = "editUser"
        gon.mode = @mode
    end

    def update
        puts "******* update " + "*" * 21
        @user = User.find(params[:id])

        if @user.update(user_params)
            redirect_to @user
        else
            render 'edit'
        end
    end

    def destroy
        puts "******* destroy " + "*" * 21
        @user = User.find(params[:id])
        @user.destroy
        redirect_to users_path
    end

    # ======= permitted params =======
    private
        def user_params
            params.require(:user).permit(:first_name, :last_name, :user_name, :password, :password_confirmation, :email)
        end

end
