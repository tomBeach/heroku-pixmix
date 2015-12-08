class CategoriesController < ApplicationController
    before_filter :set_mode

    def set_mode
        puts "******* set_mode " + "*" * 21
        @mode = "editCategory"
        gon.mode = @mode
    end

    def genres
        puts "******* genres " + "*" * 21
        @genres = Genre.all
        @selectArray = process_select_data("genres", @genres)
        @genreData = [@genres, @selectArray]
        render json: @genreData
    end

    def groups
        puts "******* groups " + "*" * 21
        @groups = Group.all
        @selectArray = process_select_data("groups", @groups)
        @groupData = [@groups, @selectArray]
        render json: @groupData
    end

    def tags
        puts "******* tags " + "*" * 21
        @tags = Tag.all
        @selectArray = process_select_data("tags", @tags)
        @tagData = [@tags, @selectArray]
        render json: @tagData
    end

    def process_select_data(whichCategory, whichCollection)
        selectArray = []
        whichCollection.each do |category|
            puts "     ** genre.id " + category.id.to_s
            puts "     ** genre.name " + category.name
            selectObject = Hash["name" => "", "count" => 0]
            if whichCategory == "genres"
                photoCategory = PhotoGenre.where(:genre_id => category.id)
            elsif whichCategory == "groups"
                photoCategory = PhotoGroup.where(:group_id => category.id)
            elsif whichCategory == "tags"
                photoCategory = PhotoTag.where(:tag_id => category.id)
            end
            count = photoCategory.length
            puts "     ** count " + count.to_s
            selectObject = { "name" => category.name, "count" => count }
            selectArray << selectObject
        end
        return selectArray
    end

end
