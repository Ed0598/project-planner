import { states } from "./config.js";

const main = document.querySelector("main");
const todo = document.querySelector(".todo-div");
const doing = document.querySelector(".doing-div");
const done = document.querySelector(".done-div");
const buttonAdd = document.querySelector(".add");
const aside = document.querySelector(".add-task-form");
const filterDelay = document.querySelector(".delay-filter");
const filterName = document.querySelector(".name-filter");
const filterToDo = document.querySelector(".todo-filter");
const divList = document.querySelectorAll(".dropzone");

let dragItemId = null;
let taskListFull = JSON.parse(sessionStorage.getItem("task-list"));

export function update() {
    let taskList = JSON.parse(sessionStorage.getItem("task-list"));

    aside.style.display = "none";
    buttonAdd.style.display = "block";

    todo.innerHTML = null;
    doing.innerHTML = null;
    done.innerHTML = null;

    if (taskList !== null) {
        for (let i = 0; i < taskList.length; i++) {
            let task = taskList[i];
            let article = createArticle(task, i);
            addArticleToSection(task, article);
        }
    }

    if (filterToDo.checked) {

        let filteredTaskList = taskList.filter(function (elem) {
            return elem.status === states.todo
        })
        sessionStorage.setItem("task-list", JSON.stringify(filteredTaskList));
        console.log(true);

    }
    else {

        console.log(false);
        sessionStorage.setItem("task-list", JSON.stringify(taskListFull));
    }

}

function addArticleToSection(task, article) {
    switch (task.status) {
        case states.todo:
            todo.appendChild(article);
            break;

        case states.doing:
            doing.appendChild(article);
            break;

        case states.done:
            done.appendChild(article);
            break;
    }
}

function createArticle(task, i) {
    let creationDate = new Date(task.creationTime);
    let deadLine = new Date(task.deadLine);

    let article = document.createElement("article");
    article.classList.toggle(task.status + "-" + i);
    article.classList.toggle(task.status);
    article.setAttribute("draggable", "true");

    let title = document.createElement("h2");
    title.innerText = task.name;
    article.appendChild(title);

    let descriptionContent = document.createElement("p");
    descriptionContent.innerText = task.description;
    article.appendChild(descriptionContent);

    let startDate = document.createElement("h3");
    startDate.innerText = creationDate.toLocaleDateString("fr-FR");
    article.appendChild(startDate);

    let endDate = document.createElement("h3");
    endDate.innerText = "Deadline: " + deadLine.toLocaleDateString("fr-FR");
    article.appendChild(endDate);

    let delay = document.createElement("h4");

    let deadline = new Date(task.deadLine) - new Date();

    if (deadline >= (1000 * 60 * 60 * 24)) {
        delay.innerText = Math.ceil(deadline / (1000 * 60 * 60 * 24)) + " jours restants";
    } else {
        delay.innerText = new Date(deadline).toLocaleTimeString("fr-FR") + " heures restantes";
    }
    article.appendChild(delay);
    article.addEventListener('dragstart', dragStart);
    article.addEventListener('dragend', dragEnd);
    return article;
}


function dragStart() {
    dragItemId = this.classList[0];
}

function dragEnd() {
}

function onDragOver(event) {

    event.preventDefault();
}

function onDrop(e) {
    let taskList = taskListFull;

    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (e.target.tagName !== "DIV") {
            return;
        }

        if (task.status !== e.target.classList[1]
            && e.target.classList[1] !== task.status
            && dragItemId === task.status + "-" + i) {
            task.status = e.target.classList[1];
            sessionStorage.setItem("task-list", JSON.stringify(taskList));
        }
    }
}

function filterByName() {
    let taskList = taskListFull;
    if (taskList !== null) {
        taskList.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }
    sessionStorage.setItem('task-list', JSON.stringify(taskList))
}

function filterByDelay() {
    let taskList = taskListFull;
    if (taskList !== null) {
        taskList.sort((a, b) => (a.delay > b.delay) ? 1 : -1);
    }
    sessionStorage.setItem('task-list', JSON.stringify(taskList))

}

function fixedHeader() {
    let header = document.querySelector("header");
    let sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

divList.forEach(div => {
    div.addEventListener('dragover', onDragOver);
    div.addEventListener('drop', onDrop);
});


buttonAdd.addEventListener("click", () => {
    main.style.display = "none";
    aside.style.display = "flex";
    buttonAdd.style.display = "none";
    filterDelay.style.display = "none";
    filterName.style.display = "none";
    clearInterval(interval);
});

filterDelay.addEventListener("click", () => {
    filterByDelay()
});

filterName.addEventListener("click", () => {
    filterByName()
});

let interval = setInterval(update, 500);
window.onscroll = function () { fixedHeader() };