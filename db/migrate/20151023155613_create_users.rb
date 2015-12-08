class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :user_name
      t.string :first_name
      t.string :last_name
      t.string :encrypted_password
      t.string :password_digest
      t.string :salt
      t.string :email

      t.timestamps null: false
    end
  end
end
