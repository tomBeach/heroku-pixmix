class PhotoGroup < ActiveRecord::Base
  belongs_to :photo
  belongs_to :group
end
