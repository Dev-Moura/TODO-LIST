const button = document.querySelector(".button-task");
const input = document.querySelector(".input-task");
const completeList = document.querySelector(".list-task");
const prioritySelect = document.querySelector(".priority-task");

let myListItens = [];

function addNewTask() {
  if (input.value.trim() === "") return;
  myListItens.push({
    task: input.value,
    complete: false,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    priority: prioritySelect.value,
  });

  input.value = "";
  prioritySelect.value = "baixa";
  showTask();
}

function showTask() {
  let newLi = "";
  myListItens.forEach((item, index) => {
    newLi += `
      <li class="tasks ${item.complete && "done"}">
        <img src="${
          item.complete ? "./img/checkV1.svg" : "./img/boxV1.svg"
        }" alt="check" onclick="taskComplete(${index})">
        <div class="task-content">
          <p>${item.task}</p>
          <p class="prioridade priority ${item.priority}">Prioridade: ${
      item.priority
    }</p>
          <p class="task-timeDate">${item.time} - ${item.date}</p>
        </div>
        <img src="img/trashV1.svg" alt="trash" onclick = "deleteItem(${index})">
      </li>
      `;
  });

  completeList.innerHTML = newLi;

  localStorage.setItem("list", JSON.stringify(myListItens));
}

function reloadsTask() {
  const localStoragetasks = localStorage.getItem("list");
  if (localStoragetasks) {
    myListItens = JSON.parse(localStoragetasks);
  }
  console.log(localStoragetasks);

  showTask();
}

function taskComplete(index) {
  myListItens[index].complete = !myListItens[index].complete;

  showTask();
}

function deleteItem(index) {
  myListItens.splice(index, 1);

  showTask();
}

reloadsTask();
button.addEventListener("click", addNewTask);
