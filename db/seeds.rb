User.delete_all
@user2 = User.create(user_name: "teb", first_name: "Tom", last_name: "Beach", encrypted_password: "kjgf", password_digest: "ukft", salt: "kjgf", email: "tb12345")

Photo.delete_all
@photo1 = Photo.create(user_id: 1, source: "http://i.dailymail.co.uk/i/pix/2014/12/04/23BBF14800000578-0-image-m-46_1417705558264.jpg", wt_ht: "634 × 513", title: "green cat", caption: "A green cat from Bulgaria", loc_taken: "Bulgaria", date_taken: "1/2/34", rating: "1")

@photo2 = Photo.create(user_id: 1, source: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Dozing_Geoffroy's_Cat.jpg", wt_ht: "3008 × 2000", title: "Geoffroy's cat", caption: "A wild cat native to the southern and central regions of South America.", loc_taken: "South America", date_taken: "3/4/56", rating: "2")

@photo3 = Photo.create(user_id: 1, source: "https://upload.wikimedia.org/wikipedia/commons/8/88/Fishing_Cat_(Prionailurus_viverrinus)_3.jpg", wt_ht: "1600 × 1067", title: "Fishing cat", caption: "Fishing cats live foremost in the vicinity of wetlands, along rivers, streams, oxbow lakes and mangrove swamps. The fishing cat is the state animal of West Bengal", loc_taken: "West Bengal", date_taken: "4/5/67", rating: "3")

@photo4 = Photo.create(user_id: 1, source: "http://media1.santabanta.com/full1/Outdoors/Waterfalls/waterfalls-41a.jpg", wt_ht: "1600 × 1067", title: "Ithaca Falls", caption: "Ithaca Falls Ithaca NY", loc_taken: "Ithaca", date_taken: "4/5/67", rating: "3")

@photo5 = Photo.create(user_id: 1, source: "https://www.keralatourism.org/images/destination/thumb/athirappalli_and_vazhachal_waterfalls_thrissur20131031102422_79_1.jpg", wt_ht: "1600 × 1067", title: "Fishing cat", caption: "huge waterfall in India", loc_taken: "India", date_taken: "4/5/67", rating: "3")

@photo6 = Photo.create(user_id: 1, source: "http://i869.photobucket.com/albums/ab256/crystalfalls/waterfalls-04.jpg", wt_ht: "1600 × 1067", title: "waterfall", caption: "caption", loc_taken: "paradise", date_taken: "4/5/67", rating: "3")

@photo7 = Photo.create(user_id: 1, source: "http://www.mountainphotography.com/images/large/JackBrauer_plitvickaJezera.jpg", wt_ht: "1600 × 1067", title: "big waterfall", caption: "another waterfall", loc_taken: "tropics", date_taken: "4/5/67", rating: "3")

Genre.delete_all
@genre1 = Genre.create(name:'studio')
@genre2 = Genre.create(name:'amateur')
@genre3 = Genre.create(name:'professional')

Group.delete_all
@group1 = Group.create(name: "London")
@group2 = Group.create(name: "House")
@group3 = Group.create(name: "AlleyCatHouse")

Tag.delete_all
@tag1 = Tag.create(name: "travel")
@tag2 = Tag.create(name: "friends")
@tag3 = Tag.create(name: "nature")
@tag4 = Tag.create(name: "house")
@tag5 = Tag.create(name: "music")
@tag6 = Tag.create(name: "events")
@tag7 = Tag.create(name: "art_tech")

PhotoGenre.delete_all
@photo_genre1 = PhotoGenre.create(photo_id: @photo1.id, genre_id: @genre1.id)
@photo_genre2 = PhotoGenre.create(photo_id: @photo1.id, genre_id: @genre2.id)
@photo_genre3 = PhotoGenre.create(photo_id: @photo1.id, genre_id: @genre3.id)

PhotoGroup.delete_all
@photo_group1 = PhotoGroup.create(photo_id: @photo2.id, group_id: @group1.id)
@photo_group2 = PhotoGroup.create(photo_id: @photo2.id, group_id: @group2.id)
@photo_group3 = PhotoGroup.create(photo_id: @photo2.id, group_id: @group3.id)

PhotoTag.delete_all
@photo_tag1 = PhotoTag.create(photo_id: @photo1.id, tag_id: @tag1.id)
@photo_tag2 = PhotoTag.create(photo_id: @photo2.id, tag_id: @tag2.id)
@photo_tag3 = PhotoTag.create(photo_id: @photo3.id, tag_id: @tag3.id)
@photo_tag4 = PhotoTag.create(photo_id: @photo4.id, tag_id: @tag4.id)
@photo_tag5 = PhotoTag.create(photo_id: @photo5.id, tag_id: @tag5.id)
@photo_tag6 = PhotoTag.create(photo_id: @photo6.id, tag_id: @tag6.id)
@photo_tag7 = PhotoTag.create(photo_id: @photo7.id, tag_id: @tag7.id)
@photo_tag8 = PhotoTag.create(photo_id: @photo4.id, tag_id: @tag1.id)
@photo_tag9 = PhotoTag.create(photo_id: @photo4.id, tag_id: @tag2.id)
