Rails.application.config.secret_key_base = ENV.fetch('SECRET_KEY_BASE')

# app::Application.config.secret_key_base = ENV['SECRET_KEY_BASE'] || "sometoken"
