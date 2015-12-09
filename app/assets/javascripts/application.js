// manifest file includes all the files listed below.
//
//= require jquery
//= require jquery_ujs
//= require jquery.serializejson
//= require_tree .

$(document).ready(function() {
    console.log('initObjects');


    // ======= ======= ======= Display ======= ======= =======
    // ======= ======= ======= Display ======= ======= =======
    // ======= ======= ======= Display ======= ======= =======


    function Display(whichDisplay) {
        console.log('Display');
        // == genres groups tags
        this.selectionTitlesArray = null;
        this.selectionTagsArray = null;
        this.thumbnailArray = null;
        this.currentPhoto = null;
        this.tooltipsLinks = [$("#photos"), $("#genre"), $("#group"), $("#tag"), $("#select")]
        this.tooltipsText = {
            photos: "view, add or delete photos",
            genre: "find photos by genre",
            group: "find photos by group",
            tag: "find photos by tag",
            select: "get photos matching selected genres, groups, or tags",
            thumbnail: "edit photo details"
        };
        this.genre = { element: null, selections: "", genreData: null, class: "sidebar" };
        this.group = { element: null, selections: "", groupData: null, class: "sidebar" };
        this.tag = { element: null, selections: "", tagData: null, class: "sidebar" };
    }

    // ======= ======= ======= initDisplayDivs ======= ======= =======
    Display.prototype.initDisplayDivs = function() {
        console.log("initDisplayDivs");
        this.selectionTitlesArray = $(".selection-title");
        this.selectionTagsArray = [];
        this.tooltips.element = $("#notice");
        this.genre.element = $("#genre-selections");
        this.group.element = $("#group-selections");
        this.tag.element = $("#tag-selections");
    }

    // ======= ======= ======= tooltips ======= ======= =======
    Display.prototype.tooltips = function(whichItem, onOff) {
        console.log("tooltips");
        // string or element
        var nextTooltip;
        if (typeof(whichItem) == "string") {
            nextTooltip = this.tooltipsText[whichItem];
        } else {
            nextTooltip = this.tooltipsText[whichItem.id];
        }
        if (onOff == "on") {
            $(this.tooltips.element).text(nextTooltip);
        } else {
            $(this.tooltips.element).text("");
        }
    }

    // ======= ======= ======= initTooltips ======= ======= =======
    Display.prototype.initTooltips = function(whichLink) {
        console.log("initTooltips");
        console.log("  $('.thumbnail.class') " + $(".thumbnail").attr('class'));

        self = this;
        for (var i = 0; i < this.tooltipsLinks.length; i++) {
            nextLink = this.tooltipsLinks[i];
            console.log("  nextLink.id: " + $(nextLink).attr('id'));
            this.activateTooltip(nextLink);
        }
    }

    // ======= ======= ======= updateSelectionTags ======= ======= =======
    Display.prototype.updateSelectionTags = function(whichCategory, jsonData) {
        console.log("updateSelectionTags");

        genresArray = jsonData[0];
        genresInfo = jsonData[1];

        displayString = "<div class='form-column login'>";
        displayString += "<h1>" + whichCategory + "s </h1>";
        displayString += "<div class='tag-edits photo-form'><div class='formData'><table>";

        for (var i = 0; i < genresArray.length; i++) {
            nextSelection = genresArray[i];
            nextName = nextSelection.name;
            nextId = nextSelection.id;
            nextCount = genresInfo[i].count;
            displayString += "<tr><td class='category-label '>" + nextName + "</td>";
            displayString += "<td class='cat-select'>" + parseInt(nextCount) + "</td>";
            displayString += "<td><input id='edit-" + whichCategory + "' type='button' value='edit'></td>";
            displayString += "<td><input id='delete-" + whichCategory + "' type='button' value='delete'></td></tr>";
        }
        displayString += "<tr>";
        displayString += "<td class='cat-select'>&nbsp;</td>";
        displayString += "<td><input id='add-" + whichCategory + "' type='button' value='add " + whichCategory + "'></td>";
        displayString += "<td>&nbsp;</td><td>&nbsp;</td>";
        displayString += "</tr></table></div></div>";

        $("#dynamic-content").empty();
        $("#dynamic-content").append(displayString);
    }

    // ======= ======= ======= displayUserPhotos ======= ======= =======
    Display.prototype.displayUserPhotos = function(jsonData) {
        console.log("displayUserPhotos");

        var displayString, nextPhotoSource, nextPhotoDataObject, nextPhoto, nextWH;
        var gridW = $("#infoRow").width();
        var gridItemWidth = 200;
        var colCount = 0;
        var userID = menuObject.userId;
        var maxColumns = Math.floor(gridW/gridItemWidth + 30);
        var thumbnailArray = [];

        $("#dynamic-content").empty();

        // == create thumbnail grid
        if (jsonData.length > 0) {
            displayString = "<div id='photo-grid'>";
            displayString += "<div class='row'>";
            for (var i = 0; i < jsonData.length; i++) {
                colCount++;
                nextPhotoDataObject = jsonData[i];
                nextPhoto = nextPhotoDataObject.photo;
                thumbnailArray.push(nextPhoto.id);
                nextWH = nextPhotoDataObject.photoWH;
                if (nextWH) {
                    newWH = this.calcPhotoRatio(nextWH, gridItemWidth);
                    nextW = newWH[0];
                    nextH = newWH[1];
                } else {
                    nextW = 160;    // 200
                    nextH = 90;
                }
                nextPhotoSource = encodeURI(nextPhoto.source);
                if (colCount > maxColumns) {
                    displayString += "</div>";
                    displayString += "<div class='row'>";
                    colCount = 0;
                }
                displayString += "<div class='column column-" + parseInt(12/maxColumns) + " grid-item'>";
                displayString += "<p class='photo-title'>" + nextPhoto.title + "</p>";
                displayString += "<a href='javascript:void(0)' id='photo_" + i + "' width='" + nextW + "' height='" + nextH + "'>";
                displayString += "<img id='" + nextPhoto.id + "' class='thumbnail' src=\"" + nextPhotoSource + "\" width='" + nextW + "' height='" + nextH + "'  alt ='" + nextPhoto.title + "'></a></div>";
            }
            displayString += "</div></div>";

        // == no photos meet category message
        } else {
            displayString = "<div class='form-column login'>";
            displayString += "<div class='tag-edits photo-form'>";
            displayString += "<div class='formData'><p>No photos match those categories</p>";
            displayString += "</div></div></div>"
        }
        $("#dynamic-content").append(displayString);
        this.thumbnailArray = thumbnailArray;

        // ======= get selected thumbnail photo =======
        $("#photo-grid").on("click", null, function(){
            console.log("-- tootips");
            menuObject.getThumbnailPhoto(event.target.id);
        });

        // ======= tooltips =======
        for (var i = 0; i < this.thumbnailArray.length; i++) {
            nextId = this.thumbnailArray[i];
            $("#" + nextId).on("mouseenter", function(event){
                console.log("-- mouseenter");
                whichLink = event.target;
                displayObject.tooltips("thumbnail", "on");
            });
            $("#" + nextId).on("mouseout", function(){
                console.log("-- mouseout");
                whichLink = event.target;
                displayObject.tooltips("thumbnail", "off");
            });
        }
    }

    // ======= ======= ======= calcPhotoRatio ======= ======= =======
    Display.prototype.calcPhotoRatio = function(whichWH, gridItemWidth) {
        // console.log("calcPhotoRatio");

        var widthRatio = 200/whichWH[0];
        var gridItemHeight = whichWH[1] * widthRatio;
        return [gridItemWidth, gridItemHeight];
    }

    // ======= ======= ======= showSelectedPhoto ======= ======= =======
    Display.prototype.showSelectedPhoto = function(jsonData, mode) {
        console.log("showSelectedPhoto");

        var userID = menuObject.userId;
        if (jsonData) {
            var photo = jsonData[0];
            var genres = jsonData[1];
            var groups = jsonData[2];
            var tags = jsonData[3];
            this.currentPhoto = photo;
            this.genre.genreData = genres;
            this.group.groupData = groups;
            this.tag.tagData = tags;
        } else if (this.currentPhoto) {
            photo = this.currentPhoto;
            genres = this.genre.genreData;
            groups = this.group.groupData;
            tags = this.tag.tagData;
        } else {
            photo = null;
            genres = menuObject.genre.genresArray;
            groups = menuObject.group.groupsArray;
            tags = menuObject.tag.tagsArray;
            console.log("  genres: " + genres);
        }

        // ======= build photo display =======
        $("#dynamic-content").empty();
        $("#photo-grid").off("click", ".cat-select", false);

        var displayString = "<div id='photo-grid'>";

        // ======= ======= ======= photo column ======= ======= =======
        displayString += "<div class='column column-6 photo-column'>";
        if (photo) {
            displayString += "<img src=\"" + photo.source + "\" class='current-photo' alt='" + photo.title + "'>";
        }

        // ======= ======= ======= categories ======= ======= =======
        this.selectionTagsArray = [];
        var categoryIndex = 0;
        var genreDisplay = this.makeCategoryDisplay("genre", genres, mode, categoryIndex);
        var categoryIndex = genres.length;
        var groupDisplay = this.makeCategoryDisplay("group", groups, mode, categoryIndex);
        categoryIndex += groups.length;
        var tagDisplay = this.makeCategoryDisplay("tag", tags, mode, categoryIndex);
        displayString += genreDisplay;
        displayString += groupDisplay;
        displayString += tagDisplay;
        displayString += "</div>";
        console.dir(this.selectionTagsArray);

        // ======= ======= ======= data column ======= ======= =======
        displayString += "<div class='column column-6 data-column'>&nbsp;";

        if (mode == "editPhoto") {
            formDisplay = this.displayEditForm();
            displayString += formDisplay;
        } else if (mode == "addNewPhoto") {
            // formDisplay = this.displayNewForm();
            // displayString += formDisplay;
        } else {
            displayString += "<div class='caption'>" + photo.caption + "</div>";
        }

        displayString += "</div>";

        $("#dynamic-content").append(displayString);

        // ======= activate selection options if edit or new mode =======
        menuObject.activateCategoryLinks(mode);
    }

    // ======= ======= ======= makeCategoryDisplay ======= ======= =======
    Display.prototype.makeCategoryDisplay = function(category, whichCategoryArray, mode, categoryIndex) {
        console.log("makeCategoryDisplay");

        var displayString = "";
        var tagObject;
        displayString += "<div class='tag-edits " + category + "'>";
        displayString += "<p class='tag-title'>" + category + "</p>";

        if (whichCategoryArray.length > 0) {
            displayString += "<nav id='tag-nav' class='bordered'>";
            displayString += "<ul class='tag-list'>";
            for (var i = 0; i < whichCategoryArray.length; i++) {
                tagObject = { name: "", checked: "off", category: category }
                nextCategoryObject = whichCategoryArray[i];
                if (typeof(nextCategoryObject) == "string") {
                    nextName = nextCategoryObject;
                    nextIndex = categoryIndex + i;
                    displayString += "<li class='cat-select'><a id='" + nextIndex + "' href='javascript:void(0)'  class='" + category + "'>" + nextName + "</a></li>";
                } else {
                    // nextid = nextCategoryObject.id;
                    nextName = nextCategoryObject.name;
                    nextIndex = categoryIndex + i;
                    nextChecked = nextCategoryObject.checked;
                    if (nextChecked == "on") {
                        displayString += "<li class='cat-select'><a id='" + nextIndex + "' href='javascript:void(0)' class='" + category + " checked'>" + nextName + "</a></li>";
                    } else {
                        displayString += "<li class='cat-select'><a id='" + nextIndex + "' href='javascript:void(0)'  class='" + category + "'>" + nextName + "</a></li>";
                    }
                }
                tagObject.name = nextName;
                tagObject.checked = "off";
                tagObject.category = category;
                this.selectionTagsArray.push(tagObject);
            }
            displayString += "</ul></nav>";
        } else {
            displayString += "<p>no categories created yet</p>";
        }
        displayString += "</div>";
        return displayString;
    }

    // ======= ======= ======= displayEditForm ======= ======= =======
    Display.prototype.displayEditForm = function() {
        console.log("displayEditForm");
        console.log("  this.currentPhoto.id: " + this.currentPhoto.id);

        // ======= ======= ======= tags ======= ======= =======
        var formString = "<form id='photoDataForm'>";
        formString += "<div class='tag-edits photo-form'>"
        formString += "<div class='formData'><p class='formLabel'>source</p><input type='text' name='source' value=\"" + this.currentPhoto.source + "\" size='30'></div>";
        formString += "<div class='formData'><p class='formLabel'>title</p><input type='text' name='title' value='" + this.currentPhoto.title + "'  size='25'></div>";
        formString += "<div class='formData'><p class='formLabel'>location</p><input type='text' name='loc_taken' value='" + this.currentPhoto.loc_taken + "'  size='20'></div>";
        formString += "<div class='formData'><p class='formLabel'>date</p><input type='text' name='date_taken' value='" + this.currentPhoto.date_taken + "'  size='15'></div>";
        formString += "<div class='formData'><p class='formLabel'>wt/ht</p><input type='text' name='wt_ht' value='" + this.currentPhoto.wt_ht + "'  size='10'></div>";
        formString += "<div class='formData'><p class='formLabel'>rating</p><input type='text' name='rating' value='" + this.currentPhoto.rating + "'  size='2'></div>";
        formString += "<div class='formData'><p class='formLabel'>caption</p><input type='textarea' name='caption' value='" + this.currentPhoto.caption + "' cols='30' rows='7'></div>";
        formString += "<div class='formData'><p class='formLabel'>&nbsp;</p><input type='hidden' value='" + this.currentPhoto.id + "'></div>";
        formString += "</div>";
        formString += "</form>";

        return formString;
    }

    // ======= ======= ======= toggleSidebarInfo ======= ======= =======
    Display.prototype.toggleSidebarInfo = function(showHide, photoInfo, mode) {
        console.log("toggleSidebarInfo");
        if (showHide == "hide") {
            $(".info-label").html("");
            $(".info-text").html("");
            $("#photo-title").html("");
            $("#photo-info").html("");
        } else {
            console.log("  photoInfo[0].title: " + photoInfo[0].title);
            var displayString = "";
            displayString += "<div>";
            displayString += "<p class='info-label'>location</p>";
            displayString += "<p class='info-text'>" + photoInfo[0].loc_taken + "</p>";
            displayString += "<p class='info-label'>date taken</p>";
            displayString += "<p class='info-text'>" + photoInfo[0].date_taken + "</p>";
            displayString += "<p class='info-label'>width/height</p>";
            displayString += "<p class='info-text'>" + photoInfo[0].wt_ht + "</p>";
            displayString += "<p class='info-label'>rating</p>";
            displayString += "<p class='info-text'>" + photoInfo[0].rating + "</p>";
            displayString += "</div>";
            $("#photo-title").html("");
            $("#photo-info").html("");
            $("#photo-title").html(photoInfo[0].title);
            $("#photo-info").html(displayString);
        }
    }

    // ======= ======= ======= toggleSidebarEdit ======= ======= =======
    Display.prototype.toggleSidebarEdit = function(showHide, photoInfo, mode) {
        console.log("toggleSidebarEdit");

        var self = this;

        if (showHide == "hide") {
            $("#photo-edit").html("");
            $("#photo-edit").removeClass("bordered");
        } else {
            var navString = "";
            navString += "<ul class='navbar'>";

            // == photos link
            navString += "<li><a href='javascript:void(0)' class='edit-link' id='userPhotos'>photos</a></li>";

            // == show/edit link
            if (mode == "showPhoto") {
                navString += "<li><a href='javascript:void(0)' class='edit-link' id='updatePhoto'>edit</a></li>";
            } else {
                navString += "<li><a href='javascript:void(0)' class='edit-link' id='savePhoto'>save</a></li>";
            }

            // == delete link
            navString += "<li><a href='javascript:void(0)' class='edit-link' id='deletePhoto'>delete</a></li>";
            navString += "</ul>";
            $("#photo-edit").html("");
            $("#photo-edit").html(navString);
            $("#photo-edit").addClass("bordered");

            // ======= get all user photos =======
            // $("#photo-edit").off("click", null, false);
            $("#photo-edit").off("click").on("click", null, function(){
                displayObject.toggleSidebarEdit("show", null, "editPhoto");
                if (event.target.textContent == "edit") {
                    console.log("-- editSavePhoto");
                    displayObject.editCurrentPhoto();
                } else if (event.target.textContent == "save"){
                    console.log("-- editSavePhoto");
                    displayObject.updateCurrentPhoto();
                } else {
                    console.log("-- getUserPhotos");
                    event.preventDefault();
                    menuObject.getUserPhotos();
                }
            });
        }
    }


    // ======= ======= ======= toggleSelectionLabels ======= ======= =======
    Display.prototype.toggleSelectionLabels = function(showHide) {
        console.log("toggleSelectionLabels");
        console.log("  showHide: " + showHide);
        if (showHide == "show") {
            $(this.selectionTitlesArray[0]).html("genres");
            $(this.selectionTitlesArray[1]).html("groups");
            $(this.selectionTitlesArray[2]).html("tags");
        } else {
            $(this.selectionTitlesArray[0]).html("");
            $(this.selectionTitlesArray[1]).html("");
            $(this.selectionTitlesArray[2]).html("");
        }
    }

    // ======= ======= ======= clearCatSelections ======= ======= =======
    Display.prototype.clearCatSelections = function() {
        console.log("clearCatSelections");
        var initElement = $(".nav-link#select");
        $(initElement).css("color", "gray");
        $(initElement).addClass("toggled");
        initElement.off("click");
        this.genre.selections = "";
        this.group.selections = "";
        this.tag.selections = "";
        $(this.genre.element).html("")
        $(this.group.element).html("")
        $(this.tag.element).html("")
        menuObject.select.status = "off";
    }

    // ======= ======= ======= addNewPhoto ======= ======= =======
    Display.prototype.addNewPhoto = function() {
        console.log("addNewPhoto");
        console.dir(this);
        this.mode = "addNewPhoto";
        this.showSelectedPhoto(null, "addNewPhoto");
    }

    // ======= ======= ======= editCurrentPhoto ======= ======= =======
    Display.prototype.editCurrentPhoto = function() {
        console.log("editCurrentPhoto");
        console.dir(this);
        this.showSelectedPhoto(null, "editPhoto");
    }

    // ======= ======= ======= updateCurrentPhoto ======= ======= =======
    Display.prototype.updateCurrentPhoto = function() {
        console.log("updateCurrentPhoto");

        var self = this;

        var photoDataArray = this.selectionTagsArray;
        var photoDataObject = {};
        for (var i = 0; i < photoDataArray.length; i++) {
            nextObject = photoDataArray[i];
            nextName = photoDataArray[i].name;
            photoDataObject[nextName] = nextObject;
        }
        var formDataJson = $('#photoDataForm').serializeJSON();
        photoDataObject["photoData"] = formDataJson;
        console.log("  formDataJson: " + formDataJson);

        console.dir(photoDataObject);

        var url = currentServerUrl + "/updatePhoto/" + this.currentPhoto.id;

        $.ajax({
            url: url,
            data: photoDataObject,
            method: "PATCH"
            // dataType: "json"
        }).done(function(jsonData){
            console.log("*** ajax success T ***");
            console.dir(jsonData);
            // self.displayUserPhotos(jsonData);
        }).fail(function(){
            console.log("*** ajax fail T ***");
        });
    }

    // ======= ======= ======= activateTooltip ======= ======= =======
    Display.prototype.activateTooltip = function(whichLink) {
        console.log("activateTooltip");

        // ======= tooltips =======
        $(whichLink).on("mouseenter", function(event){
            console.log("-- mouseenter");
            whichLink = event.target;
            displayObject.tooltips(whichLink, "on");
        });
        $(whichLink).on("mouseout", function(){
            console.log("-- mouseout");
            whichLink = event.target;
            displayObject.tooltips(whichLink, "off");
        });
    }




    // ======= ======= ======= Menu ======= ======= =======
    // ======= ======= ======= Menu ======= ======= =======
    // ======= ======= ======= Menu ======= ======= =======



    function Menu(whichMenu) {
        console.log('Menu');
        // == logout users photos genres groups tags select
        this.name = whichMenu;
        this.userId = null;
        this.mode = gon.mode;
        this.loginOut = { element: null, selection: null, class: "nav-link" };
        this.photos = { element: null, selection: null, photosArray: [], class: "nav-link" };
        this.genre = { element: null, selection: null, genresArray: null, class: "nav-link" };
        this.group = { element: null, selection: null, groupsArray: null, class: "nav-link" };
        this.tag = { element: null, selection: null, tagsArray: null, class: "nav-link" };
        this.select = { element: null, status: "off" };
        this.search = { element: null, status: "off" };
    }

    // ======= ======= ======= initMenuDivs ======= ======= =======
    Menu.prototype.initMenuDivs = function() {
        console.log("initMenuDivs");
        var menuLinkArray = [];
        var menuLength = $(".nav-link").length;
        for (i = 0; i < menuLength; i++) {
            menuLinkArray.push($(".nav-link").eq(i));
        }
        this.loginOut.element = $("#loginOut");     // toggle login or logout
        this.photos.element = $("#photos");         // display user photos
        this.genre.element = $("#genre");           // get photos by genre
        this.group.element = $("#group");           // get photos by group
        this.tag.element = $("#tag");               // get photos by tag
        this.select.element = $("#select");         // activate selections
        this.search.element = $("#search");         // search titles

        console.log("$('#genre').children('li').length: " + $("#genre").children("li").length);
        console.log("$('#group').children('li').length: " + $("#group").children("li").length);
        console.log("$('#tag').children('li').length: " + $("#tag").children("li").length);

    }

    // ======= ======= ======= updateMenu ======= ======= =======
    Menu.prototype.updateMenu = function(whichMode) {
        console.log("updateMenu");
        console.log("  whichMode: " + whichMode);

        switch(whichMode) {
            case "profile":
                displayObject.toggleSelectionLabels("hide");
                break;
            case "signup":
                displayObject.toggleSelectionLabels("hide");
                break;
            case "login":
                displayObject.toggleSelectionLabels("hide");
                break;
            case "users":
                displayObject.toggleSelectionLabels("hide");
                break;
            case "editUser":
                displayObject.toggleSelectionLabels("hide");
                break;
            default:
                this.initMenuDivs();
                this.activatePhotosLink();
                this.updateSelectionMenuLinks("genre");
                this.updateSelectionMenuLinks("group");
                this.updateSelectionMenuLinks("tag");
                this.activateMenuTagEdits();
                displayObject.initDisplayDivs();
                displayObject.initTooltips();
                displayObject.toggleSelectionLabels("show");
                break;
        }
    }



    // ======= ======= ======= select functions ======= ======= =======
    // ======= ======= ======= select functions ======= ======= =======
    // ======= ======= ======= select functions ======= ======= =======



    // ======= ======= ======= updateSelectionMenuLinks ======= ======= =======
    Menu.prototype.updateSelectionMenuLinks = function(whichMenuCategory) {
        console.log("updateSelectionMenuLinks");
        switch(whichMenuCategory) {
            case "genre":
                menuEl = this.genre.element;
                menuEl.html(whichMenuCategory);
                menuEl.css("color", "black")
                break;
            case "group":
                menuEl = this.group.element;
                menuEl.html(whichMenuCategory);
                menuEl.css("color", "black")
                break;
            case "tag":
                menuEl = this.tag.element;
                menuEl.html(whichMenuCategory);
                menuEl.css("color", "black")
                break;
        }
        var whichMenuLinks = $(".sub-link-" + whichMenuCategory);

        // ======= assign event listener to new dropdown items =======
        for (var i = 0; i < whichMenuLinks.length; i++) {
            nextSubLink = whichMenuLinks[i];
            this.activateMenuTagEventListener(nextSubLink, whichMenuCategory);
        }
    }

    // ======= ======= ======= activateMenuTagEdits ======= ======= =======
    Menu.prototype.activateMenuTagEdits = function() {
        console.log("activateMenuTagEdits");
        var self = this;

        $("#edit-genre").on("click", function() {
            console.log("-- editGenres");
            event.preventDefault();
            self.editSelectionTags("genre");
        });
        $("#edit-group").on("click", function() {
            console.log("-- editGroups");
            event.preventDefault();
            self.editSelectionTags("group");
        });
        $("#edit-tag").on("click", function() {
            console.log("-- editTags");
            event.preventDefault();
            self.editSelectionTags("tag");
        });
    }

    // ======= ======= ======= activateMenuTagEventListener ======= ======= =======
    Menu.prototype.activateMenuTagEventListener = function(whichLink, whichMenuCategory) {
        console.log("activateMenuTagEventListener");

        var self = this;

        // ======= enter category selections =======
        $(whichLink).on("click", function(){
            console.log("-- " + whichLink.id);
            event.preventDefault();

            // == display selected category
            switch(whichMenuCategory) {
                case "genre":
                    var currentSelections = displayObject.genre.selections;
                    if (currentSelections.indexOf(whichLink.text) == -1) {
                        if (currentSelections == "") {
                            currentSelections = currentSelections + whichLink.text;
                        } else {
                            if (currentSelections.indexOf(",") == -1) {
                                currentSelections = currentSelections + ", " + whichLink.text;
                            } else {
                                $("#notice").text("limit of 2 categories");
                            }
                        }
                    }
                    $(displayObject.genre.element).html(currentSelections);
                    displayObject.genre.selections = currentSelections;
                    self.genre.selection = whichLink.text;
                    break;
                case "group":
                    var currentSelections = displayObject.group.selections;
                    if (currentSelections.indexOf(whichLink.text) == -1) {
                        if (currentSelections == "") {
                            currentSelections = currentSelections + whichLink.text;
                        } else {
                            if (currentSelections.indexOf(",") == -1) {
                                currentSelections = currentSelections + ", " + whichLink.text;
                            } else {
                                $("#notice").html("<p>limit of 2 categories</p>");
                            }
                        }
                    }
                    $(displayObject.group.element).html(currentSelections);
                    displayObject.group.selections = currentSelections;
                    self.group.selection = whichLink.text;
                    break;
                case "tag":
                    var currentSelections = displayObject.tag.selections;
                    if (currentSelections.indexOf(whichLink.text) == -1) {
                        if (currentSelections == "") {
                            currentSelections = currentSelections + whichLink.text;
                        } else {
                            if (currentSelections.indexOf(",") == -1) {
                                currentSelections = currentSelections + ", " + whichLink.text;
                            } else {
                                $("#notice").text("limit of 2 categories");
                            }
                        }
                    }
                    $(displayObject.tag.element).html(currentSelections);
                    displayObject.tag.selections = currentSelections;
                    self.tag.selection = whichLink.text;
                    break;
            }
            if (self.select.status == "off") {
                self.activateSelectLink();
            }
        });
    }

    // ======= ======= ======= activateSelectLink ======= ======= =======
    Menu.prototype.activateSelectLink = function() {
        console.log("activateSelectLink");
        var self = this;
        var initElement = $(".nav-link#select");
        this.select.status = "on";
        if ((this.genre.selection) || (this.group.selection) || (this.tag.selection)) {
            $(initElement).css("color", "black");
            $(initElement).css("background-color", "tomato");
            $(initElement).removeClass("toggled");

            // ======= select photo from category selections =======
            initElement.on("click", function(){
                console.log("-- select");
                event.preventDefault();
                $("#notice").html("");
                $(".nav-link#select").addClass("toggled");
                $(".nav-link#select").removeClass("selections");
                $(".nav-link#select").css("color", "#eee");
                $(".nav-link#select").css("background-color", "white");
                self.getSelectedPhotos();
                displayObject.clearCatSelections();
            });
        }
    }

    // ======= ======= ======= activateCategoryLinks ======= ======= =======
    Menu.prototype.activateCategoryLinks = function(mode) {
        console.log("activateCategoryLinks");
        console.log("  $('#photo-grid'): " + $("#photo-grid"));
        console.log("  $('.cat-select'): " + $(".cat-select"));

        // ======= activate selection options if edit or new mode =======
        if ((mode == "editPhoto") || (mode == "addNewPhoto")) {
            console.log("  mode: " + mode);
            $("#photo-grid").on("click", ".cat-select", function(){
                console.log("-- selectCat");

                var selectionIndex = parseInt(event.target.id);
                var selectionObject = displayObject.selectionTagsArray[selectionIndex];
                var selectionName = selectionObject.name;
                var selectionChecked = selectionObject.checked;
                var selectionCategory = selectionObject.category;

                if (selectionChecked == "on") {
                    displayObject.selectionTagsArray[selectionIndex].checked = "off";
                    menuObject.toggleCategoryTag(event.target, "off");
                } else {
                    displayObject.selectionTagsArray[selectionIndex].checked = "on";
                    menuObject.toggleCategoryTag(event.target, "on");
                }
                var selectionChecked = displayObject.selectionTagsArray[selectionIndex].checked;
                console.dir(selectionObject);
            });

        } else {
            $("#photo-grid").off("click", ".cat-select", false);
        }
    }

    // ======= ======= ======= activatePhotosLink ======= ======= =======
    Menu.prototype.activatePhotosLink = function() {
        console.log("activatePhotosLink");
        var self = this;

        // ======= get all user photos =======
        $("#main-nav").on("click", "#photos", function(){
            console.log("-- getUserPhotos");
            event.preventDefault();
            self.getUserPhotos();
        });

        $("#main-nav").on("click", "#add-photo", function(){
            console.log("-- addPhoto");
            displayObject.toggleSidebarEdit("hide", null, "addNewPhoto");
            displayObject.addNewPhoto();
        });
    }



    // ======= ======= ======= photo functions ======= ======= =======
    // ======= ======= ======= photo functions ======= ======= =======
    // ======= ======= ======= photo functions ======= ======= =======



    // ======= ======= ======= editSelectionTags ======= ======= =======
    Menu.prototype.editSelectionTags = function(whichCategory) {
        console.log("editSelectionTags");

        var self = this;
        var url = currentServerUrl + whichCategory + "s";

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).done(function(jsonData){
            console.log("*** ajax success T ***");
            console.dir(jsonData);
            displayObject.updateSelectionTags(whichCategory, jsonData);
        }).fail(function(){
            console.log("*** ajax fail T ***");
        });
    }

    // ======= ======= ======= getUserPhotos ======= ======= =======
    Menu.prototype.getUserPhotos = function() {
        console.log("getUserPhotos");

        var self = this;
        var url = currentServerUrl + "/getUserPhotos";
        console.log("  url: " + url);

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).done(function(jsonData){
            console.log("*** ajax success T ***");
            console.dir(jsonData);
            displayObject.displayUserPhotos(jsonData);  // activates thumbnail
            displayObject.toggleSidebarInfo("hide", null, "showPhoto");
            displayObject.toggleSidebarEdit("hide", null, null);
            displayObject.clearCatSelections();
        }).fail(function(){
            console.log("*** ajax fail T ***");
        });
    }

    // ======= ======= ======= getSelectedPhotos ======= ======= =======
    Menu.prototype.getSelectedPhotos = function() {
        console.log("getSelectedPhotos");

        // == displays photos by selection categories
        var self = this;
        var whichGenre = displayObject.genre.selections;
        var whichGroup = displayObject.group.selections;
        var whichTag = displayObject.tag.selections;

        var url = currentServerUrl + "/getSelectedPhotos";
        console.log("  url: " + url);

        $.ajax({
            url: url,
            data: { genre: whichGenre, group: whichGroup, tag: whichTag },
            method: "GET",
            dataType: "json"
        }).done(function(jsonData){
            console.log("*** ajax success T ***");
            console.dir(jsonData);
            displayObject.displayUserPhotos(jsonData);  // activates thumbnail
            displayObject.toggleSidebarInfo("hide", null, "showPhoto");
            displayObject.toggleSidebarEdit("hide", null, null);
            displayObject.clearCatSelections();
        }).fail(function(){
            console.log("*** ajax fail T ***");
        });
    }

    // ======= ======= ======= getThumbnailPhoto ======= ======= =======
    Menu.prototype.getThumbnailPhoto = function(whichThumbnail) {
        console.log("getThumbnailPhoto");

        $(displayObject.tooltips.element).text("");
        displayObject.selectionTagsArray = null;

        var url = currentServerUrl + "/getPhoto/" + whichThumbnail;

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).done(function(jsonData){
            console.log("*** ajax success T ***");
            console.dir(jsonData);
            displayObject.currentPhoto = jsonData[0];
            displayObject.showSelectedPhoto(jsonData, "showPhoto");
            displayObject.toggleSidebarInfo("show", jsonData, "showPhoto");
            displayObject.toggleSidebarEdit("show", jsonData, "showPhoto");
        }).fail(function(){
            console.log("*** ajax fail T ***");
        });
    }

    // ======= ======= ======= toggleCategoryTag ======= ======= =======
    Menu.prototype.toggleCategoryTag = function(whichElement, checkUncheck) {
        console.log("toggleCategoryTag");
        console.log("  whichElement: " + whichElement);
        console.log("  whichElement.id: " + whichElement.id);

        if (checkUncheck == "on") {
            $("#" + whichElement.id).addClass("checked")
        } else {
            $("#" + whichElement.id).removeClass("checked")
        }
    }



    // ======= ======= ======= init client-side objects ======= ======= =======
    // ======= ======= ======= init client-side objects ======= ======= =======
    // ======= ======= ======= init client-side objects ======= ======= =======


    menuObject = new Menu("menu1");
    displayObject = new Display("display1");
    var currentServerUrl = gon.currentServerUrl;

    console.log("** gon.mode: " + gon.mode);
    console.log("** gon.userId: " + gon.userId);
    console.log("** currentServerUrl: " + currentServerUrl);

    displayObject.initDisplayDivs();
    menuObject.updateMenu(gon.mode);
    if (menuObject.userId == null) {
        menuObject.userId = gon.userId;
    }
    menuObject.genre.genresArray = gon.genres;
    menuObject.group.groupsArray = gon.groups;
    menuObject.tag.tagsArray = gon.tags;
    console.log("** gon.genres: " + gon.genres);
    console.log("** gon.groups: " + gon.groups);
    console.log("** gon.tags: " + gon.tags);
});




/* ======= ======= ======= ARCHIVE ======= ======= ======= */
