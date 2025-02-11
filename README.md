<p align="center">
<img src='https://media4.giphy.com/media/l1Et9S6qY578FIJ3y/giphy.gif?cid=6c09b9521wzu6ur5dmne16p3xjuwkj7k7ooaccohkyue8nue&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g' width='700'>
</p>

# <h1 align="center">📖 Lore 📖</h1>

<p align="center">
 Lore is an interactive and collaborative storytelling game for anyone who enjoys creating imaginative stories with friends. Players can create groups, start stories, and vote on plot points to compete against players. When stuck, players can use the AI driven suggestions to craft their next plot point. Whether you're bored at a family gathering or finding an activity to do with your close friends, Lore fosters creativity and community, making it easy for users to connect and craft memorable stories together. So gather your friends, unleash your creativity, and start crafting your own lore today!
</p>

## MVP ✔️


* User account with user authentication
* Story and group creation
  * Ability to start a new story and invite others to collaborate/lobby to join the game with friends or others online.
* Prompt suggestions
* Chapter Voting System
  * Mechanism for users to propose multiple options for the next chapter.
  * Voting system for collaborators to choose their preferred plot twist, character decision, or story direction.
* Story Portal & Profile
  * Ongoing stories, completion status, people added to the story, and short description.
* Story Display & Visualization:
  * Display the current story and previous chapters in a readable format & show progression
  * Visualization of Story line

  



## Stretch Goals 💡

* Annotation / live chat features during the game
* Community feed of popular stories
* Pin stories to profile
* Export and Downloading stories to be shared




## Milestones ⏲️

<details closed>
  <summary>  <strong> Week 1: Setup ⚓ </strong> </summary>
  <br>
- General:
  - Assign roles and get to know each other!
  - Discuss overall project scope, tech stack/options (if interested in AWS or using React Native instead)
  - Schedule meetings for weekly meetings
  - Start Low fidelity with everyone to get a vision of the app
- Frontend:
  - Start working on Figma and be ready to show progress dev night
  - Explore tech stack and set up
- Backend:
  - Explore tech stack and set up
</details>

<details closed>
  <summary>  <strong> Week 1: </strong> </summary>
  <br>
- General:
  - Assign roles and get to know each other!
  - Discuss overall project scope, tech stack/options (if interested in AWS or using React Native instead)
  - Schedule meetings for weekly meetings
  - Start Low fidelity with everyone to get a vision of the app
- Frontend:
  - Start working on Figma
  - Explore tech stack and set up
- Backend:
  - Explore tech stack and set up
</details>

<details closed>
  <summary>  <strong> Week 2:</strong> </summary>
  <br>
- General:
  - Get started on basic tasks
  - Continue getting familiar with tech stack
  - Finalize features & DB schema
- Frontend:
  - Wrap up Figma
- Backend:
  - Wrap up schema
  - Set up DB access
</details>

<details closed>
  <summary>  <strong> Week 3:</strong> </summary>
  <br>
- Frontend:
  - Start implementing auth pages and Socket.io set up on client side
  - Set up routes between basic pages
- Backend:
  - Set up Express server and integrate auth
  - Set up Socket.io in backend
</details>

<details closed>
  <summary>  <strong> Week 4:</strong> </summary>
  <br>
- Frontend:
  - Continue making progress on pages: profile + story creation
  - One person should focus on testing multiplayer capabilities 
- Backend:
  - CRUD operations for users + stories
  - One person should focus on testing multiplayer capabilities
</details>

<details closed>
  <summary>  <strong> Week 5:</strong> </summary>
  <br>
 - General:
  - Integrate multiplayer feature to see if it is doable
- Frontend:
  - Continue making progress on pages profile + story creation
  - Develop UI for displaying and creative stories with multiple users
- Backend:
  - Implement API endpoints for creating and fetching real time story updates.
  - Start on AI suggestions for story line
</details>

<details closed>
  <summary>  <strong> Week 6-8: During and After Spring Break 🍀</strong> </summary>
  <br>
- Frontend:
  - Develop UI to display AI-generated story suggestions, voting on story options,  and display results
  - AI Visuals for story
- Backend:
  - Continue implementing endpoints to fetch story suggestions from OpenAI and Hugging Face APIs 
  - Implement API endpoints for voting on story directions and calculating scores.
  - AI Visuals for story

</details>



<details closed>
  <summary>  <strong> Week 9/10: </strong> </summary>
  <br>

- General:
  - Bug Fixes & Polish: Address any bugs, finalize UI/UX, and ensure the app is stable and ready for presentation.
  - Final Testing: Conduct thorough testing of all features, focusing on user journeys and the core algorithm.
  - Presentation: Prepare slides, script, and rehearse the demo. Ensure everyone is confident with their part of the presentation. Have funnnnn :D

</details>



## Tech Stack & Resources 💻
#### Firebase, OpenAI, Stable Diffusion, Socket.io, Node.js, Express.js, Vue.js


<details>
**<summary>Tutorials ⏯️</summary>**

- [Vue.js Tutorial](https://youtu.be/1GNsWa_EZdw?si=NU2GSCARyILMMz5V)
- [Intro to Express & Node](https://youtu.be/jivyItmsu18?si=YbLWhSxKg1C44Qht)
- [Getting Started with OpenAI API](https://www.youtube.com/watch?v=Zb5Nylziu6E)
- [Firebase](https://www.youtube.com/watch?v=fgdpvwEWJ9M)
- [Firebase Auth & Vue.js](https://www.youtube.com/watch?v=XtbYBoKb2zY)
- [Express Chat App + Socket IO Tutorial](https://www.youtube.com/watch?v=ypqs_u9GbpQ)
- [Hugging Face Stable Diffusion](https://www.youtube.com/watch?v=kOBxiZpzYe0)

</details>

<details>
**<summary>Environment Setup ⚙️</summary>**
 
 - Frontend Set Up
   - [Vue](https://vuejs.org/guide/quick-start)
   - [Socket.IO](https://socket.io/docs/v4/client-installation/)
   - [Firebase Auth in Vue](https://www.freecodecamp.org/news/how-to-add-authentication-to-a-vue-app-using-firebase/)
   - [Git](https://git-scm.com/downloads)
   - [NPM](https://www.geeksforgeeks.org/how-to-download-and-install-node-js-and-npm/)
   - [VS Code](https://code.visualstudio.com/docs/introvideos/versioncontrol)
  
  
 - Backend Set Up
   - [Node + Express](https://daily.dev/blog/setup-nodejs-express-project-a-beginners-guide)
   - [Socket.IO](https://socket.io/docs/v4/server-installation/)
   - [Firebase](https://firebase.google.com/docs/web/setup)
   - [OpenAI](https://platform.openai.com/docs/quickstart)
   - [Git](https://git-scm.com/downloads)
   - [NPM](https://www.geeksforgeeks.org/how-to-download-and-install-node-js-and-npm/)
   - [VS Code](https://code.visualstudio.com/docs/introvideos/versioncontrol)

</details>

<details>
**<summary>General Resources 🕵️ </summary>**
 
 - [Success in ACM Projects](https://docs.google.com/document/d/18Zi3DrKG5e6g5Bojr8iqxIu6VIGl86YBSFlsnJnlM88/edit#heading=h.ky82xv3vtbpi)
  - [API Crash Course w/ timestamps](https://www.youtube.com/watch?v=GZvSYJDk-us)
  - [GitHub Cheat Sheet #1](https://education.github.com/git-cheat-sheet-education.pdf)
  - [GitHub Cheat Sheet #2](https://drive.google.com/file/d/1OddwoSvNJ3dQuEBw3RERieMXmOicif9_/view)

</details>
 
 

## Git Commands

| Command | Description |
| ------ | ------ |
| **cd <director>** | Change directories over to our repository |
| **git branch** | Lists branches for you |
| **git branch "branch name"** | Makes new branch |
| **git checkout "branch name"** | Switch to branch |
| **git checkout -b "branch name"** | Same as 2 previous commands together |
| **git add .**| Finds all changed files |
| **git commit -m "Testing123"** | Commit with message |
| **git push origin "branch"** | Push to branch |
| **git pull origin "branch"** | Pull updates from a specific branch |
| get commit hash (find on github or in terminal run **git log --oneline** ) then **git revert 2f5451f --no-edit**| Undo a commit that has been pushed |
| **git reset --soft HEAD~** | Undo commit (not pushed) but *keep* the changes |
| get commit hash then **git reset --hard 2f5451f** | Undo commit (not pushed) and *remove*  changes |


## Possible Roadblocks 🧠
- AI Integration and Usage
    - Extra time for implementation and get started with research early on.
- Real-Time Voting System & Multiplayer
    - Get started early on or have multiple teams so the game can be played on a singular device.


  
## Meet the Team

Developers ⭐: 
* Julian Mananquil
* Sharad Rangaraju
* Tommy Nguyen
* William Arato
      
Project Manager 🌠: Shraddha Subash

Industry Mentor 🌠: Sean Hassan
