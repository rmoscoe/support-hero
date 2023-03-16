# Support Hero
## Table of Contents
- [Table of Contents](#table-of-contents)
- [Technology Used](#technology-used)
- [Description](#description)
- [Usage](#usage)
- [Learning Points](#learning-points)
- [Author Info](#author-info)
  - [Ryan Moscoe](#ryan-moscoe)
  - [Megan Ellman](#megan-ellman)
  - [Brandon Haskell](#brandon-haskell)
  - [Srinithi Ravichandran](#srinithi-ravichandran)
- [License](#license)

<br />

## Technology Used

| Technology Used         | Resource URL           | 
| ------------- |:-------------| 
| CSS     | [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)      |   
| JavaScript | [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)     |    
| Node.js | [https://nodejs.org/en/](https://nodejs.org/en/) |
| Path | [https://nodejs.org/docs/latest/api/path.html](https://nodejs.org/docs/latest/api/path.html) |
| Dotenv | [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) |
| Bulma | [https://bulma.io/](https://bulma.io/) |
| Google Fonts | [https://fonts.google.com/](https://fonts.google.com/) |
| Font Awesome | [https://fontawesome.com/](https://fontawesome.com/) |
| Bcrypt | [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt) |
| ReactJS | [https://reactjs.org/](https://reactjs.org/docs/getting-started.html) |
| React Router Dom | [https://reactrouter.com/](https://reactrouter.com/en/main) |
| Javascript Web Token (JWT) | [https://jwt.io/](https://jwt.io/introduction) |
| GraphQL | [https://graphql.org/](https://graphql.org/learn/) |
| Express Web Server | [https://expressjs.com/](https://expressjs.com/en/starter/installing.html) |
| MongoDB | [https://www.mongodb.com/](https://www.mongodb.com/docs/) |
| Mongoose ODM | [https://mongoosejs.com/](https://mongoosejs.com/docs/guide.html) |
| Apollo Server | [https://www.apollographql.com/](https://www.apollographql.com/docs/apollo-server/) |
| Nodemon | [https://www.npmjs.com/package/nodemon](https://www.npmjs.com/package/nodemon) |
| React Hook Form | [https://react-hook-form.com/get-started/](https://react-hook-form.com/) |
| React Toastify | [https://fkhadra.github.io/react-toastify/](https://fkhadra.github.io/react-toastify/introduction/) |
| React Table | [https://react-table-v7.tanstack.com/](https://react-table-v7.tanstack.com/) |
| Faker | [https://fakerjs.dev/guide/](https://fakerjs.dev/guide/) |

<br />

## Description 

[Visit the Deployed Site](https://dry-fjord-88699.herokuapp.com/)

Support Hero is a customer support ticketing system. Customers are able to sign up, create tickets, and correspond with agents on a given issue. Agents are able to correspond with customers as well as create notes on given comments. Since notes are only visible to agents, this allows agents to add important details related to the issue that they can refer back to later. Both agents and users are able to view the tickets they have either created or have assigned to them. Users can also toggle dark mode to change the color of the platform to a darker theme. 

![Site Langing Page](/assets/images/support-hero.gif)

<br/>

## Usage 

![Homepage](/assets/images/homepage.png)

To explore this application, you may use the following credentials:
* Agent Email: ```lillian.ferry@yahoo.com```
* Customer Email: ```rosalyn_kassulke92@gmail.com```
* Password (same for all users): ```Password1!```

Once a user signs or logs in, they are directed to the Homepage. At the top of the Homepage is a navbar with a button to log out of the application. This navbar is present throughout the application. 

Below the navbar is a table with the user's tickets. The table contains columns for ticket ID, title, created on date, and status. When a user clicks on a ticket, they are taken to the Detailed Ticket view for the given ticket. 

![Create Ticket Form](/assets/images/detailed-ticket.png)

If a user is a customer, they will also have a "Create Ticket" button on their homepage. When this button is clicked, a ticket form modal appears where the customer can input information about their issue. 

![Detailed Ticket View](/assets/images/detailed-ticket.png)

On the detailed ticket view page, the title of the ticket, status, priority, description, and comment history are all displayed. At the bottom of the page is a form to add a new comment. When the user clicks the submit button, the comment is added to the comment history. If a user is an agent, they are able to add a note to a comment. The agent can then update or delete that note.

On the detailed ticket view, the navbar has a Home button to take them back to the Homepage. 

![Toggle Dark Mode](/assets/images/dark-mode.gif)

While a user is logged in, a toggle is accessible at the top of the page. When a user clicks the toggle, the page will change to 'dark mode'. This will change the background and the colors to darker, more muted colors. When the toggle is clicked again, the page will change back to 'light mode'. If the user logs out and back into the platform, the mode settings will be saved.

<br />

## Learning Points 

* React Context to render dark mode throughout the platform.
* React Hook Form to create forms with validation with minimal code.
* React Toastify to create pop-up 'toast' notifications.
* React Table to create tables with filtering capabilities.

<br />

## Author Info

### Ryan Moscoe 

* [Portfolio](https://rmoscoe.github.io/portfolio/)
* [LinkedIn](https://www.linkedin.com/in/ryan-moscoe-8652973/)
* [Github](https://github.com/rmoscoe)

<br />

### Megan Ellman
* [LinkedIn](https://www.linkedin.com/in/megan-ellman/)
* [GitHub](https://github.com/megellman)
* [Portfolio](https://megellman.github.io/portfolio/)

<br />

### Brandon Haskell
* [LinkedIn](https://www.linkedin.com/in/brandon-haskell/)
* [GitHub](https://github.com/bhaskell7901)
* [Portfolio](https://bhaskell7901.github.io/react-portfolio/)

<br />

### Srinithi Ravichandran
* [LinkedIn](https://www.linkedin.com/in/srinithi-ravichandran-18891243/)
* [GitHub](https://github.com/srinithi19)
* [Portfolio](https://srinithi19.github.io/react-portfolio/)


<br />

## License

[MIT License](https://choosealicense.com/licenses/mit/)