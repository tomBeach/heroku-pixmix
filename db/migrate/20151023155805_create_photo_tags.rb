class CreatePhotoTags < ActiveRecord::Migration
  def change
    create_table :photo_tags do |t|
      t.references :photo, index: true, foreign_key: true
      t.belongs_to :tag, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
