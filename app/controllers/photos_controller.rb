class PhotosController < ApplicationController
    before_filter :get_genres_groups_tags
    # layout proc { false if request.xhr? }

    def getUserPhotos
        puts "******* getUserPhotos " + "*" * 21
        @mode = "userPhotos"
        gon.mode = @mode
        puts "     ** @mode " + @mode
        if @current_user
            # binding.pry
            @photos = @current_user.photos
            @photoDataArray = []
            if @photos
                @photos.each do |nextPhoto|
                    photoDataObject = Hash["photo" => "", "photoWH" => "", "userID" => 0]
                    sourceType = nextPhoto.source[0...4]
                    puts "    ** sourceType " + sourceType
                    if sourceType == "http" || sourceType == "https"
                        photo_source = nextPhoto.source
                    # else
                    #     photo_source = "/app/assets/images/#{nextPhoto.source}"
                    end
                    puts "    ** photo_source " + photo_source
                    photoWH = FastImage.size(photo_source)
                    puts "    ** photoWH.to_s " + photoWH.to_s
                    photoDataObject = { "photo" => nextPhoto, "photoWH" => photoWH, "userID" => @current_user.id }
                    @photoDataArray << photoDataObject
                end
            end
            render json: @photoDataArray
        end
    end

    def getSelectedPhotos
        puts "******* getSelectedPhotos " + "*" * 21
        puts "     ** params[:genre] " + params[:genre]
        puts "     ** params[:group] " + params[:group]
        puts "     ** params[:tag] " + params[:tag]
        genreArray = params[:genre].split(", ")
        groupArray = params[:group].split(", ")
        tagArray = params[:tag].split(", ")
        puts "     ** genreArray " + genreArray.to_s
        if not params[:genre] == ""
            if not params[:group] == ""
                if not params[:tag] == ""
                    @photos = Photo.joins(:genres, :groups, :tags).where("genres.name" => params[:genre], "groups.name" => params[:group], "tags.name" => params[:tag])
                else
                    @photos = Photo.joins(:genres, :groups).where("genres.name" => params[:genre], "groups.name" => params[:group])
                end
            else
                if not params[:tag] == ""
                    @photos = Photo.joins(:genres, :tags).where("genres.name" => params[:genre], "tags.name" => params[:tag])
                else
                    if genreArray.length > 1
                        @photos = Photo.joins(:genres).where("genres.name = ? OR genres.name = ?", genreArray[0], genreArray[1])
                    else
                        @photos = Photo.joins(:genres).where("genres.name" => params[:genre])
                    end
                end
            end
        else
            if not params[:group] == ""
                if not params[:tag] == ""
                    @photos = Photo.joins(:groups, :tags).where("groups.name" => params[:group], "tags.name" => params[:tag])
                else
                    @photos = Photo.joins(:groups).where("groups.name" => params[:group])
                end
            else
                @photos = Photo.joins(:tags).where("tags.name" => params[:tag])
            end
        end
        @photoDataArray = []
        if @photos
            @photos.each do |nextPhoto|
                photoDataObject = Hash["photo" => "", "photoWH" => "", "userID" => 0]
                sourceType = nextPhoto.source[0...4]
                puts "    ** sourceType " + sourceType
                if sourceType == "http" || sourceType == "https"
                    photo_source = nextPhoto.source
                # else
                #     photo_source = "/app/assets/images/#{nextPhoto.source}"
                end
                puts "    ** photo_source " + photo_source
                photoWH = FastImage.size(photo_source)
                puts "    ** photoWH.to_s " + photoWH.to_s
                photoDataObject = { "photo" => nextPhoto, "photoWH" => photoWH, "userID" => @current_user.id }
                @photoDataArray << photoDataObject
            end
        end
        if @photoDataArray.length > 0
            render json: @photoDataArray
        else
            @photoDataArray = {}
            render json: @photoDataArray
        end
    end

    def show
        getPhoto
    end

    def getPhoto
        puts "******* getPhoto " + "*" * 21
        puts "     ** params " + params.to_s
        @mode = "showPhoto"
        gon.mode = @mode

        selectObject = Hash["id" => "0", "name" => "", "checked" => false]
        @photoDataArray = []

        @photo = @current_user.photos.find(params[:id])
        @genres = Genre.all
        @genres_checked = @photo.genres.includes( :photo_genres )
        @groups = Group.all
        @groups_checked = @photo.groups.includes( :photo_groups )
        @tags = Tag.all
        @tags_checked = @photo.tags.includes( :photo_tags )
        # binding.pry

        genreArray = make_data_array(@genres, @genres_checked)
        groupArray = make_data_array(@groups, @groups_checked)
        tagArray = make_data_array(@tags, @tags_checked)

        @photoDataArray = [@photo, genreArray, groupArray, tagArray]
        render json: @photoDataArray
    end

    def make_data_array(all_categories, checked_category)
        puts "******* make_data_array " + "*" * 21
        categoryArray = []
        # selectObject = Hash["id" => "0", "name" => "", "checked" => false]
        all_categories.each do |category|
            nextId = category.id
            nextName = category.name
            puts "     ** nextName " + nextName.to_s
            selectObject = { "id" => nextId, "name" => nextName, "checked" => "off" }
            checked_category.each do |categoryCheck|
                checkName = categoryCheck.name
                puts "          checkName " + checkName.to_s
                if nextName == checkName
                    selectObject = { "id" => nextId, "name" => nextName, "checked" => "on" }
                    puts "     ** selectObject " + selectObject.to_s
                    break
                end
            end
            categoryArray << selectObject
        end
        return categoryArray
    end

    def edit
        puts "******* editPhoto " + "*" * 21
        @mode = "editPhoto"
        gon.mode = @mode

        @photo = @current_user.photos.find(params[:id])
        @genres = Genre.all
        @genres_checked = @photo.genres.includes( :photo_genres )
        @groups = Group.all
        @groups_checked = @photo.groups.includes( :photo_groups )
        @tags = Tag.all
        @tags_checked = @photo.tags.includes( :photo_tags )
    end

    def update
        puts "******* updatePhoto " + "*" * 21
        @mode = "updatePhoto"
        gon.mode = @mode
        puts "     ** params " + params.to_s

        @photo = @current_user.photos.find(params[:id])
        genres = Genre.all
        groups = Group.all
        tags = Tag.all

        update_join_tables("genre", genres, @photo)
        update_join_tables("group", groups, @photo)
        update_join_tables("tag", tags, @photo)

        @photo = Photo.update(params[:id], source: params[:photoData][:source], wt_ht: params[:photoData][:wt_ht], title: params[:photoData][:title], caption: params[:photoData][:caption], loc_taken: params[:photoData][:loc_taken], date_taken: params[:photoData][:date_taken], rating: params[:photoData][:rating] )

        flash[:notice] = "Photo updated successfully!"
        render :js => "menuObject.getThumbnailPhoto(#{@photo.id.to_s})"
    end

    def newPhoto
        puts "******* newPhoto " + "*" * 21
        @mode = "newPhoto"
        gon.mode = @mode
        puts "     ** params " + params.to_s

        @photo = Photo.new()
        flash[:notice] = "Photo added successfully!"
        render :js => "menuObject.getThumbnailPhoto(#{@photo.id.to_s})"
    end

    def update_join_tables(whichCategory, whichCategoryItems, whichPhoto)
        puts "******* update_join_tables " + "*" * 21
        whichCategoryItems.each do |category|
            nextName = category.name
            nextObject = params[nextName]
            nextChecked = nextObject["checked"]
            if nextChecked == "on"
                if whichCategory == "genre"
                    whichCategory_checked = PhotoGenre.where(photo_id: whichPhoto.id, genre_id: category.id)
                elsif whichCategory == "group"
                    whichCategory_checked = PhotoGroup.where(photo_id: whichPhoto.id, group_id: category.id)
                elsif whichCategory == "tag"
                    whichCategory_checked = PhotoTag.where(photo_id: whichPhoto.id, tag_id: category.id)
                end
                if whichCategory_checked.length == 0
                    if whichCategory == "genre"
                        newCategory = PhotoGenre.new(:photo_id => whichPhoto.id, :genre_id => category.id)
                    elsif whichCategory == "group"
                        newCategory = PhotoGroup.new(:photo_id => whichPhoto.id, :group_id => category.id)
                    elsif whichCategory == "tag"
                        newCategory = PhotoTag.new(:photo_id => whichPhoto.id, :tag_id => category.id)
                    end
                    newCategory.save
                end
            else
                if whichCategory == "genre"
                    remove_whichCategory = PhotoGenre.where(photo_id: whichPhoto.id, genre_id: category.id)
                elsif whichCategory == "group"
                    remove_whichCategory = PhotoGroup.where(photo_id: whichPhoto.id, group_id: category.id)
                elsif whichCategory == "tag"
                    remove_whichCategory = PhotoTag.where(photo_id: whichPhoto.id, tag_id: category.id)
                end
                if remove_whichCategory.length > 0
                    remove_whichCategory.each do |remove_category|
                        remove_category.destroy
                    end
                end
            end
        end
        return true
    end

    def getSelectedPhoto
        puts "******* getSelectedPhoto " + "*" * 21
        redirect_to(:controller => 'photos', :action => 'show')
    end

    def index
        puts "******* index " + "*" * 21
        getUserPhotos
        # if @current_user
        #     @photos = @current_user.photos
        #     @genres = Genre.all
        #     @groups = Group.all
        #     @tags = Tag.all
        # end
    end

    def new
        puts "******* newPhoto " + "*" * 21
        @mode = "newPhoto"
        gon.mode = @mode
        @photo = Photo.new()
    end

    def create
        puts "******* create " + "*" * 21
        @photo = @current_user.photos.build(photo_params)

        if @photo.save
            puts "**     photo SAVED "
            flash[:notice] = "New photo saved!"
            @mode = "loginUser"
            gon.mode = @mode
            render :js => "menuObject.getThumbnailPhoto(#{@photo.id.to_s})"
        else
            puts "**     photo NOT saved "
            flash[:notice] = "New photo failed"
            redirect_to({ :controller => 'photos', :action => 'new' })
        end
    end

    def destroy
        puts "******* destroy " + "*" * 21
        @photo = @current_user.photos.find(params[:id])
        @photo.destroy
        redirect_to user_photos_path
    end

    private
        def photo_params
            puts "******* photo_params " + "*" * 21
            puts "     ** params " + params.to_s
            puts "     ** params[:photo] " + params[:photo].to_s

            params.require(:photo).permit(:source, :title, :loc_taken, :date_taken, :wt_ht, :rating, :caption)
            # params.require(:photo).permit(:photo[:source], :photo[:wt_ht], :photo[:title], :photo[:caption], :photo[:loc_taken], :photo[:date_taken], :photo[:rating], :photo[:genre], :photo[:group], :photo[:tag])
        end
end
