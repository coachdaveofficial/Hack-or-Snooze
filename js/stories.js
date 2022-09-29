"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <span class="star">
        <i class="fa-star far"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
    
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  // check if user has a favorites list, if so, mark the star as checked
  checkUserFavorites(currentUser);

  $allStoriesList.show();
}
// pull text from submit form and use it to call addStory function, hide form and update stories view when finished
async function createNewStory(evt) {
  evt.preventDefault();

  const author = $('#author-name').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();
 

  try {
    await storyList.addStory(currentUser, {title, url, author});
  } catch (error) {
    console.log(error);
    alert("invalid URL")
  }

  $submitForm.hide("slow")
  await getAndShowStoriesOnStart();
}

$submitForm.on('submit', createNewStory);


async function toggleFavorite(evt) {
  
  let storyId = evt.target.closest('li').id;

  if (evt.target.className === 'fa-star far') {
    evt.target.className = 'fa-star fas';
    await currentUser.toggleFavoriteStory(storyId, "POST")
  } 
  else if (evt.target.className === 'fa-star fas') {
    evt.target.className = 'fa-star far';
    await currentUser.toggleFavoriteStory(storyId, "DELETE")
  }
  
}

$storiesLists.on("click", ".star", toggleFavorite);

// check user.favorites and grab storyIds, use storyIds to then update star icons on DOM to be checked or not
function checkUserFavorites() {
  
  let favorites = currentUser.favorites;
  try {
    for (let story of favorites) {
      let starElement = $(`#${story.storyId} .fa-star`)[0];
      starElement.className = 'fa-star fas';
      console.log(starElement);
    } 
  } catch(err) {
    console.log('there are no favorites on the page, see full error below. \n', err)
  }
}

async function deleteOwnStory(evt) {
  let storyId = evt.target.closest('li').id;

  await currentUser.deleteStory(storyId);
  $myStoriesList.empty();
  storyList = await StoryList.getStories();

  $myStoriesList.show();

  
  }

  $storiesLists.on('click', '.trash-can', deleteOwnStory)







