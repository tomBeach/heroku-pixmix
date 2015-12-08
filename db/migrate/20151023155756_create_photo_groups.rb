class CreatePhotoGroups < ActiveRecord::Migration
  def change
    create_table :photo_groups do |t|
      t.references :photo, index: true, foreign_key: true
      t.belongs_to :group, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
