"use strict";

const buttonElement = document.querySelector(".js-button");
const inputElement = document.querySelector(".js-input");
const nameElement = document.querySelector(".js-shows");
/* const formElement = document.querySelector(".js-form");
 */

//Cogemos los datos del Api, para ello tenemos que crear una constante con el valor del input para coger los datos del api dependiendo del titulo de la serie q introduzca la usuaria
let showsList = [];
let favouriteList = [];

function getFromApi() {
  const titleName = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${titleName}`)
    .then((response) => response.json())
    .then((data) => {
      paintElements(data);
      listenShowsEvents();
    });
}
//Pintamos los datos, pero para conseguir los datos hay que iterar el array data para conseguir la propiedad que estamos buscando
function paintElements(data) {
  for (const eachData of data) {
    const title = eachData.show.name;
    const img = eachData.show.image || "url(../images/photo-preview1.jpg))";
    showsList.push(title, img, eachData.show.id);
    /*     console.log(eachData);
     */ nameElement.innerHTML += `<p class="show" data-myid=${eachData.show.id} >
    Nombre:${title}
    <img class ="show" src="${img.medium}"> 
    </p>`;
  }
}
//Escuchamos al botón para que al clickarlo, llame a la función que coge los datos del Api
buttonElement.addEventListener("click", getFromApi);

//Creamos una función para saber que elemento estamos clickando
function listenShowsEvents() {
  const elements = document.querySelectorAll(".show");
  for (const element of elements) {
    element.addEventListener("click", handleShows);
  }
}
function handleShows(ev) {
  // obtengo el id de la serie clickada,para ello he tenido que añadir data-myid=${eachData.show.id}cuando he pintado el elemento, y aquí buscarlo de esa forma.
  const clickedId = ev.currentTarget.dataset.myid;
  console.log(clickedId);

  //Quiero buscar solo el ID de mi showsList, para indicar q si es igual q mi elemento clickado lo vaya añadiendo al nuevo array(favouriteList)

  /* let foundShow;
  for (const list of showsList) {
    console.log(showsList);
  }
  favouriteList.push({
    id: foundShow.id,
    name: foundShow.name,
    image: foundShow.image,
  });  */
}
