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
  - Assign roles for front-end and back-end development
  - Discuss overall project scope, tech stack/options (React Native for frontend, AWS for backend)
  - Schedule meetings for weekly meetings
  - Start Low fidelity with everyone to get a vision of the app
- Frontend:
  - Start working on figma and be ready to show progress dev night
  - Learn React Native/Flutter and decide which you wanna work with
- Backend:
  - Research AWS and begin setting up your environment (AWS EC2, S3).
  - Start exploring database frameworks (e.g., MongoDB, DynamoDB).
  - Explore Spotify API

</details>

<details closed>
  <summary>  <strong> Week 9/10: Final Touches & Presentation Prep 💪📢 </strong> </summary>
  <br>

- General:
  - Bug Fixes & Polish: Address any bugs, finalize UI/UX, and ensure the app is stable and ready for presentation.
  - Final Testing: Conduct thorough testing of all features, focusing on user journeys and the core algorithm.
  - Presentation: Prepare slides, script, and rehearse the demo. Ensure everyone is confident with their part of the presentation.

</details>



## Tech Stack & Resources 💻
#### Firebase, OpenAI, Stable Diffusion, Socket.io, Node.js / Express.js, Vue.js, 

## Software to Install
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [React Native](https://reactnative.dev/docs/environment-setup)
  - [DynamoDB](https://aws.amazon.com/dynamodb/) / [Firebase](https://firebase.google.com/docs/web/setup)
  - [CSS Tailwind](https://tailwindcss.com/docs/guides/nextjs)
  - [Node](https://nodejs.org/en/)
  - [Express](https://expressjs.com/)
  - [Git](https://git-scm.com/downloads)

## Tutorials and Resources  
  **General**
  - [Success in ACM Projects](https://docs.google.com/document/d/18Zi3DrKG5e6g5Bojr8iqxIu6VIGl86YBSFlsnJnlM88/edit#heading=h.ky82xv3vtbpi)
  - [API Crash Course w/ timestamps](https://www.youtube.com/watch?v=GZvSYJDk-us)
  - [GitHub Cheat Sheet #1](https://education.github.com/git-cheat-sheet-education.pdf)
  - [GitHub Cheat Sheet #2](https://drive.google.com/file/d/1OddwoSvNJ3dQuEBw3RERieMXmOicif9_/view)
  
  **Front-end**
  - [Introduction to Wireframing in Figma](https://www.youtube.com/watch?v=6t_dYhXyYjI)
  - [React Native Crash Course](https://www.youtube.com/watch?v=w7ejDZ8SWv8)
  - [27 Best UI/UX Practices](https://729solutions.com/ux-ui-best-practices/)
  - [MapBox Tutorial](https://www.youtube.com/watch?v=JJatzkPcmoI)
  - [Building Maps in React Native](https://medium.com/@mshuecodev/building-maps-in-react-native-with-mapbox-a-step-by-step-tutorial-6491f2190db9)
  
  **Back-end**
  - [Node.js Crash Course](https://www.youtube.com/watch?v=zb3Qk8SG5Ms&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU)
  - [Express & Node Intro](https://youtu.be/jivyItmsu18?si=YbLWhSxKg1C44Qht)
  - [DynamoDB & React Native](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/build-a-serverless-react-native-mobile-app-by-using-aws-amplify.html)
  - [AWS Lambda & React Native](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/build-a-serverless-react-native-mobile-app-by-using-aws-amplify.html)
  - [AWS S3 & React Native](https://jaka-tertinek.medium.com/upload-files-from-react-native-app-to-aws-s3-3d3cb85e9d4)
  - [Firebase / React Native Authentication Tutorial](https://www.youtube.com/watch?v=ONAVmsGW6-M)

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
