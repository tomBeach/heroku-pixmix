json.array!(@photos) do |photo|
  json.extract! photo, :id, :source, :wt_ht, :title, :caption, :loc_taken, :date_taken, :rating, :user_id
  json.url photo_url(photo, format: :json)
end
