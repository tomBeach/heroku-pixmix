class Genre < ActiveRecord::Base
    has_many :photo_genres, dependent: :destroy
    has_many :photos, through: :photo_genres
end
