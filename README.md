
<p align="center">
  <img src="https://github.com/acm-projects/Nostalgio/blob/main/listening-to-music-spongebob.gif"/>
</p>

# <h1 align="center">📖 Lore 📖</h1>

<p align="center">
 Lore is an interactive and collaborative storytelling game for anyone who enjoys creating imaginative stories with friends. Players can create groups, start stories, and vote on plot points to compete against players. When stuck, players can use the AI driven suggestions to craft their next plot point. Whether you're bored at a family gathering or finding an activity to do with your close friends, Lore fosters creativity and community, making it easy for users to connect and craft memorable stories together. So gather your friends, unleash your creativity, and start crafting your own lore today!
</p>

## MVP (Minimum Viable Product)


* User account with user authentication
* Story and group creation
* Ability to start a new story and invite others to collaborate/lobby to join the game with friends or others online.
* Fun and unique prompt suggestions
* Chapter Voting System:
* Mechanism for users to propose multiple options for the next chapter.
* Voting system for collaborators to choose their preferred plot twist, character decision, or story direction.
* Story Portal & Profile
* Ongoing stories, completion status, people added to the story, and short description.
* Story Display & Visualization:
* Display the current story and previous chapters in a readable format & show popular vote of progressions

  



## Stretch Goals

* Annotation/ live chat features
* Community feed of popular stories
* Pin stories to profile
* Export and Downloading stories to be shared




## Milestones

<details closed>
  <summary>  <strong> Week 1: Setup ⚓ </strong> </summary>
  <br>

- General:
  - Assign roles for front-end and back-end development.
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



## Tech Stack
* Wireframing: Figma
* IDE: VSC
* Frontend: [React Native](https://reactnative.dev/) with [MapBox Gl](https://docs.mapbox.com/help/glossary/maps-sdk-for-react-native/)
  * React Native is a cross compatible framework that paired with expo allows you to bring your apps to life while in development phases
  * Material UI or Bootstrap / CSS Tailwind
  * MapBox is a community-maintained React Native library that provides reusable JavaScript components for integrating Mapbox maps into iOS and Android apps.
* Backend: [AWS Lambda](https://www.serverless.com/aws-lambda), [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) & [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) Or [Firebase/Firestore](https://firebase.google.com/docs/firestore), [Express & Node](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction), [Spotify API](https://developer.spotify.com/documentation/web-api), [MapBox API](https://docs.mapbox.com/api/overview/)
  * AWS Lambda is a compute service that runs your code in response to events and automatically manages the compute resources
  * DynamoDB and S3 continue with the fully AWS approach however, Firebase/Firestore work great as needed
  * By using Express and Node.js, you can effectively manage the backend of your mobile app, providing a robust API that interacts with your frontend mobile application
* User Authentication: [Auth0](https://auth0.com/docs)



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
