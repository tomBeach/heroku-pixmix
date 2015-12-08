class Group < ActiveRecord::Base
    has_many :photo_groups, dependent: :destroy
    has_many :photos, through: :photo_groups
end
