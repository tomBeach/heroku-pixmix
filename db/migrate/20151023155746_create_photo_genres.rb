class CreatePhotoGenres < ActiveRecord::Migration
  def change
    create_table :photo_genres do |t|
      t.references :photo, index: true, foreign_key: true
      t.belongs_to :genre, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
