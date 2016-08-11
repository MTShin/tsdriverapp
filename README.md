##ts-instrument
Search through available drivers/planned enablement instruments by:

- Instrument
- Instrument Type
- Manufacturer
- Instructions/Description
- Status
- tOrg
- End User
- TS Contact
- Engineer
- MSRP
- Communication Protocol
- Driver name
- Driver ID

##Notes
- Must be logged in to access the Driver Database
- No field is required when creating new drivers for flexibility
- Status color schemes set to mirror JIRA ticket status colors
- Forgot Password is not functional

##Future Features (From highest to lowest priority)
1. Count: Number of drivers for each status, especially total (demo/deployed) listed on homepage
  - Progress has been made but incomplete
  - Commented out pertaining code found in drivers.server.routes.js and drivers.server.controller.js
2. File Upload: E.g. user manual upload capability in the individual driver modals
3. updatedAt field and by who?

##To run locally
1. Clone or download zip
2. cd to root of the project
3. Enter `$npm install` in console
4. Run by entering `$node server` or `$grunt` to refresh page after local code changes
5. See it in action by going to localhost:3000 in a browser

##Resources
- Built using the MEAN Stack ([MongoDB](https://www.mongodb.com/), [Express.js](https://expressjs.com/), [Angular.js](https://github.com/angular/angular.js), and [Node.js](https://nodejs.org/en/))
- Based on [Yeoman scaffolding tool](http://yeoman.io/)
- Visuals such as glyphicons, navbar/homepage design modified and inspired from [Bootstrap framework](http://getbootstrap.com/)
- Database hosted on [mongoLab](https://mlab.com/home), sandbox database (consider upgrading to more production suitable database before deployment)
  * username: tetrascience
  * password: tetrascience123
  * database: tsdriverapp

##Structure
Notable directories/files are described here

######root
- package.json - dependencies defined here

######root/app
- controllers - methods used for server side
- models - schemas are defined here
- routes - mapping of controllers
- tests - autogenerated tests
- views - server side UI

######root/config (mostly auto generated)
- env - databse connection info in development.ks
- strategies - scrapped autogenerated social login stuff

######root/public
- lib - angular, bootsrap, jquery source code
- modules - the meat of the code
  ###### /modules/core
    - config - autogenerated route for homepage redirecting
    - controllers - scopes for client view of homepage and navbar
    - css - used by htmls in root/public/modules/core/views
    - img - favicon taken from tetrascience_cloud
    - services - methods for menu navigation, autogenerated 
    - tests - autogenerated tests
    - views - navbar and homepage visuals
  
  ###### /modules/drivers
    - config - autogenerated modules
    - controllers - controllers and directives for driver modules, modals and additional scopes are defined here
    - css - used by htmls in root/public/modules/drivers/views
    - services - autogenerated service to communicate with REST endpoints
    - tests - autogenerated tests
    - views - driver modal and Driver Database list view visuals
  
  ###### /modules/users
    - config - autogenerated routes
    - controllers - autogenerated controllers for basic user authentication
    - css - used by htmls in root/public/modules/users/views
    - img - scrapped images included from yeoman generator
    - services - autogenerated client services
    - tests - autogenerated tests
    - views - visuals for signin, signup, forgot password, reset password, change password, and edit profile pages (social account pictures were autogenerated and not used)
