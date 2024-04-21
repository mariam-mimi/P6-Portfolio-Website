// Imports express framework and data from JSON file while working through file paths 
const express = require("express");
const data = require("./data.json");
const path = require("path");

//Initialize Express application
const app = express();

// Sets view engine to Pug and brings static files from 'public' directory
app.set("view engine", "pug");
app.use('/static', express.static('public'));

// Sets route to homepage
app.get("/", (req, res) => {
    res.locals.data = data.projects;
    res.render("index", {projects: data.projects });
});

//Sets route to about page
app.get("/about", (req, res) => {
    res.render("about", data);
});

// Sets route for individual project pages and handles when project is not found
app.get('/project/:id', (req, res) => {
    const projectId = req.params.id;
    const project = data.projects.find(project => project.id === parseInt(projectId));
    if (project) {
        res.locals.data = data.projects;
        res.render('project', { project });
    } else {
        const err = new Error('Project not found');
        err.status = 404;
    }
});

// Handles 404 errors for unknown routes
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    console.log(`${err.status}: ${err.message}`);
    next(err);
})

// Handles middleware errors to render error page for other found errors
app.use((err, req, res, next) => {
    if(!err.status) err.status = 500;
    if (!err.message) err.message = "Internal Server Error";
    console.log(`${err.status}: ${err.message}`);
    res.status(err.status);
    res.render("error", {error: err});
});

// Starts listening on port 3000
app.listen(3000, () => {
    console.log("App listening on port localhost:3000");
});

