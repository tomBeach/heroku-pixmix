class Group < ActiveRecord::Base
    has_many :photo_groups
    has_many :groups, through: :photo_groups
end
