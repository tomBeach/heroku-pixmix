class SessionsController < ApplicationController
    before_filter :authenticate_user, :only => [:home, :profile, :setting]
    before_filter :save_login_state, :only => [:login, :login_attempt]
    before_filter :get_genres_groups_tags
    layout proc { false if request.xhr? }

    def login
        puts "******* login " + "*" * 21
    end

    def login_attempt
        puts "******* login_attempt " + "*" * 21

        # ======= get user from database via username/email and secure password
        authorized_user = User.authenticate(params[:user_name_or_email], params[:login_password])
        if authorized_user
            session[:user_id] = authorized_user.id
            @mode = "loginUser"
            gon.mode = @mode
            gon.userId = session[:user_id]
            flash[:notice] = "Welcome #{authorized_user.user_name}!"
            redirect_to({ :controller => 'users', :action => 'home' })
        else
            flash[:notice] = "New? Please sign up!"
            redirect_to({ :controller => 'users', :action => 'new' })
        end
    end

    def logout
        puts "******* logout " + "*" * 21
        @mode = "logout"
        gon.mode = @mode
        session[:user_id] = nil
        redirect_to({:controller => 'users', :action => 'home'})
    end

    def profile
        puts "******* profile " + "*" * 21
        @mode = "profile"
        gon.mode = @mode
    end

end
