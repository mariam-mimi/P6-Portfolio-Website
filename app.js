const express = require("express");
const data = require("./data.json");
const path = require("path");

const app = express();

app.set("view engine", "pug");
app.use('/static', express.static('public'));


app.get("/", (req, res) => {
    res.locals.data = data.projects;
    res.render("index", {projects: data.projects });
});

app.get("/about", (req, res) => {
    res.render("about", data);
});

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

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    console.log(`${err.status}: ${err.message}`);
    next(err);
})

app.use((err, req, res, next) => {
    if(!err.status) err.status = 500;
    if (!err.message) err.message = "Internal Server Error";
    console.log(`${err.status}: ${err.message}`);
    res.status(err.status);
    res.render("error", {error: err});
});

app.listen(3000, () => {
    console.log("App listening on port localhost:3000");
});

