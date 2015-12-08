class Genre < ActiveRecord::Base
    has_many :photo_genres
    has_many :genres, through: :photo_genres
end
