# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151023155805) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "genres", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "groups", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "photo_genres", force: :cascade do |t|
    t.integer  "photo_id"
    t.integer  "genre_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "photo_genres", ["genre_id"], name: "index_photo_genres_on_genre_id", using: :btree
  add_index "photo_genres", ["photo_id"], name: "index_photo_genres_on_photo_id", using: :btree

  create_table "photo_groups", force: :cascade do |t|
    t.integer  "photo_id"
    t.integer  "group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "photo_groups", ["group_id"], name: "index_photo_groups_on_group_id", using: :btree
  add_index "photo_groups", ["photo_id"], name: "index_photo_groups_on_photo_id", using: :btree

  create_table "photo_tags", force: :cascade do |t|
    t.integer  "photo_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "photo_tags", ["photo_id"], name: "index_photo_tags_on_photo_id", using: :btree
  add_index "photo_tags", ["tag_id"], name: "index_photo_tags_on_tag_id", using: :btree

  create_table "photos", force: :cascade do |t|
    t.string   "source"
    t.string   "wt_ht"
    t.string   "title"
    t.text     "caption"
    t.string   "loc_taken"
    t.string   "date_taken"
    t.integer  "rating"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "photos", ["user_id"], name: "index_photos_on_user_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "user_name"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "encrypted_password"
    t.string   "password_digest"
    t.string   "salt"
    t.string   "email"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_foreign_key "photo_genres", "genres"
  add_foreign_key "photo_genres", "photos"
  add_foreign_key "photo_groups", "groups"
  add_foreign_key "photo_groups", "photos"
  add_foreign_key "photo_tags", "photos"
  add_foreign_key "photo_tags", "tags"
  add_foreign_key "photos", "users"
end
