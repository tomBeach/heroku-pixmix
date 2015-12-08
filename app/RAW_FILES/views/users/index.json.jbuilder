json.array!(@users) do |user|
  json.extract! user, :id, :user_name, :first_name, :last_name, :encrypted_password, :password_digest, :salt, :email
  json.url user_url(user, format: :json)
end
