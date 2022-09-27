"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favoriteStoriesList.empty();



}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt) {
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);


function navFavoritesClick() {
  hidePageComponents();
  $allStoriesList.empty();
  $favoriteStoriesList.empty();

  // loop through all of our favorites and generate HTML for them
  for (let story of currentUser.favorites) {
    const $favorite = generateStoryMarkup(story);
    $favoriteStoriesList.append($favorite);
  }

  // check if user has a favorites list, if so, mark the star as checked
  checkUserFavorites(currentUser);
  
  $allStoriesList.hide();
  $favoriteStoriesList.show();
}

$navFavorites.on('click', navFavoritesClick);
