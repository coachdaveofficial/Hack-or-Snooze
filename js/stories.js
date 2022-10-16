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

  const loggedIn = Boolean(currentUser)

  let starHTMLClass = 'far';

  if (loggedIn) {
    if (currentUser.favorites.some(s => s.storyId === story.storyId)) {
      starHTMLClass = 'fas';
      }; 
    }

  const starHTML = `<span class="star"><i class="fa-star ${starHTMLClass}"></i></span>`;


  return $(`
      <li id="${story.storyId}">
        ${loggedIn ? starHTML : ""}
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

  

  $allStoriesList.show();
}
// pull text from submit form and use it to call addStory function, hide form and update stories view when finished
async function createNewStory(evt) {
  evt.preventDefault();

  const author = $('#author-name').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();
 

  try {
    let newStory = await storyList.addStory(currentUser, {title, url, author});
    currentUser.ownStories.push(newStory);

    $('#author-name').val(''); 
    $('#story-title').val('');
    $('#story-url').val('');

  } catch (error) {
    console.log(error);
    alert("invalid URL")
  }

  $submitForm.hide("slow")
  await getAndShowStoriesOnStart();
}

$submitForm.on('submit', createNewStory);

// on click, toggle a story as favorite
async function toggleFavorite(evt) {
  
  let storyId = evt.target.closest('li').id;
  let method;

  if (evt.target.className === 'fa-star far') {
    evt.target.className = 'fa-star fas';
    method = 'POST';
  } 
  else if (evt.target.className === 'fa-star fas') {
    evt.target.className = 'fa-star far';
    method = 'DELETE';
  }
  const response = await currentUser.toggleFavoriteStory(storyId, method);
  currentUser.favorites = response.data.user.favorites.map(s => new Story(s));
  
}

$storiesLists.on("click", ".star", toggleFavorite);



async function deleteOwnStory(evt) {
  console.log(evt.target)
  let storyId = evt.target.closest('li').id;

  await currentUser.deleteStory(storyId);
  $(`#${storyId}`).remove();
  // remove story from global story list
  for (let storyIndex in storyList.stories) {
    if (storyList.stories[storyIndex].storyId == storyId) { 
        storyList.stories.splice(storyIndex, 1);
        console.log('deleted!', storyIndex)
    }
  }
  // remove story from current user story list
  for (let storyIndex in currentUser.ownStories) {
    if (currentUser.ownStories[storyIndex].storyId == storyId) { 
        currentUser.ownStories.splice(storyIndex, 1);
    }
  }


  $myStoriesList.show();

  
  }

  $storiesLists.on('click', '.trash-can', deleteOwnStory)







