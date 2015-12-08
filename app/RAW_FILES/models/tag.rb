class Tag < ActiveRecord::Base
    has_many :photo_tags, dependent: :destroy
    has_many :photos, through: :photo_tags
end
