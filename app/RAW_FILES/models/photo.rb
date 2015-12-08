class Photo < ActiveRecord::Base
    belongs_to :user
    has_many :photo_genres, dependent: :destroy
    has_many :photo_groups, dependent: :destroy
    has_many :photo_tags, dependent: :destroy
    has_many :genres, through: :photo_genres
    has_many :groups, through: :photo_groups
    has_many :tags, through: :photo_tags
end
