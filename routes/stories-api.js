/*
 * All routes for Stories Data are defined here
 * Since this file is loaded in server.js into /stories,
 *   these routes are mounted onto /stories
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router  = express.Router();
const storiesQueries = require('../db/queries/getAllStories');
const getUserId = require('../db/queries/getUserId');

// stories page

router.get('/', async (req, res) => {
  let userID = req.cookies.user_id;

  try {
    // If user_id doesn't exist in cookies, set it to 1
    if (!userID) {
      userID = 1;
      res.cookie('user_id', userID, { httpOnly: true }); // Set the cookie
    }

    // Get the user name using the userID
    const userNameResult = await getUserId.getUserId(userID);
    const userName = userNameResult[0].name;

    // Get all stories
    const stories = await storiesQueries.getAllStories();

    // Render the response with stories and user details
    res.render("stories_api", { stories, cookies: userID, userName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;