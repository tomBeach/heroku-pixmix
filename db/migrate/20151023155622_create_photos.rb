class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :source
      t.string :wt_ht
      t.string :title
      t.text :caption
      t.string :loc_taken
      t.string :date_taken
      t.integer :rating
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
