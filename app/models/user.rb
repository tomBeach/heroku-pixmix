class User < ActiveRecord::Base
    has_many :photos, dependent: :destroy
    before_save :encrypt_password
    after_save :clear_password

    attr_accessor :password
    EMAIL_REGEX = /A[A-Z0-9._%+-]+@[a-z0-9.]+.[a-z]+z/i
    validates :user_name, :presence => true, :uniqueness => true, :length => { :in => 3..20 }
    # validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
    validates :password, :confirmation => true #password_confirmation attr
    validates_length_of :password, :in => 6..20, :on => :create

    def self.authenticate(user_name_or_email="", login_password="")
        if  EMAIL_REGEX.match(user_name_or_email)
            user = User.find_by_email(user_name_or_email)
        else
            user = User.find_by_user_name(user_name_or_email)
        end
        if user && user.match_password(login_password)
            return user
        else
            return false
        end
    end

    def match_password(login_password="")
        encrypted_password == BCrypt::Engine.hash_secret(login_password, salt)
    end

    def encrypt_password
        if password.present?
            self.salt = BCrypt::Engine.generate_salt
            self.encrypted_password= BCrypt::Engine.hash_secret(password, salt)
        end
    end

    def clear_password
        self.password = nil
    end
end
