class PhotoGenre < ActiveRecord::Base
  belongs_to :photo
  belongs_to :genre
end
