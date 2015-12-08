require 'test_helper'

class PhotosControllerTest < ActionController::TestCase
  setup do
    @photo = photos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:photos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create photo" do
    assert_difference('Photo.count') do
      post :create, photo: { caption: @photo.caption, date_taken: @photo.date_taken, loc_taken: @photo.loc_taken, rating: @photo.rating, source: @photo.source, title: @photo.title, user_id: @photo.user_id, wt_ht: @photo.wt_ht }
    end

    assert_redirected_to photo_path(assigns(:photo))
  end

  test "should show photo" do
    get :show, id: @photo
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @photo
    assert_response :success
  end

  test "should update photo" do
    patch :update, id: @photo, photo: { caption: @photo.caption, date_taken: @photo.date_taken, loc_taken: @photo.loc_taken, rating: @photo.rating, source: @photo.source, title: @photo.title, user_id: @photo.user_id, wt_ht: @photo.wt_ht }
    assert_redirected_to photo_path(assigns(:photo))
  end

  test "should destroy photo" do
    assert_difference('Photo.count', -1) do
      delete :destroy, id: @photo
    end

    assert_redirected_to photos_path
  end
end
