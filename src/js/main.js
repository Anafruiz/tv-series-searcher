"use strict";

const buttonElement = document.querySelector(".js-button");
const inputElement = document.querySelector(".js-input");
const nameElement = document.querySelector(".js-shows");

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
      setInLocalStorage();
    });
}
//Pintamos los datos, pero para conseguir los datos hay que iterar el array data para conseguir la propiedad que estamos buscando
let imagenDefault = "https://via.placeholder.com/210x295/ffffff/666666/?";
function paintElements(data) {
  let htmlCode = "";
  htmlCode += `<ul>`;

  for (const eachData of data) {
    const title = eachData.show.name;
    const img = eachData.show.image;
    const idData = eachData.show.id;
    // Metemos los datos en mi nuevo array showsList
    showsList.push({ name: title, img: img, id: idData });
    //Pintamos los datos
    htmlCode += `<li class="show" data-myid=${idData} >`;
    htmlCode += `<h2>Nombre:${title}</h2>`;
    if (img === null) {
      console.log(eachData.show.img);
      htmlCode += `<img src="${imagenDefault}"> `;
    } else {
      htmlCode += `<img src="${img.medium}"> `;
    }
  }
  htmlCode += `</ul>`;
  nameElement.innerHTML += htmlCode;
}

//Escuchamos al botón para que al clickarlo, llame a la función que coge los datos del Api
buttonElement.addEventListener("click", getFromApi);

//Creamos una función para saber que elemento estamos clickando
function listenShowsEvents(data) {
  const elements = document.querySelectorAll(".show");
  for (const element of elements) {
    element.addEventListener("click", handleShows);
  }
}
function handleShows(ev) {
  // obtengo el id de la serie clickada,para ello he tenido que añadir data-myid=${eachData.show.id}cuando he pintado el elemento, y aquí buscarlo de esa forma.

  const clickedId = parseInt(ev.currentTarget.dataset.myid);
  /*   console.log(clickedId);
   */
  //Quiero buscar solo el ID de mi showsList, para indicar q si es igual q mi elemento clickado lo vaya añadiendo al nuevo array(favouriteList)

  const favouriteIndex = showsList.find(function (item) {
    return item.id === clickedId;
  });
  const showFound = favouriteList.findIndex(function (show) {
    return show.id === clickedId;
  });
  if (showFound === -1) {
    favouriteList.push(favouriteIndex);
    console.log(favouriteList);
  } else {
    favouriteList.splice(showFound, 1);
  }
  setInLocalStorage();
  paintFavoritesShow();
}
const favoriteElements = document.querySelector(".js-favourite--shows");

//Pintar series favoritas

function paintFavoritesShow() {
  let htmlCode = "";
  htmlCode += `<ul>`;
  for (const item of favouriteList) {
    htmlCode += `<li class="favouriteShow">`;
    htmlCode += `<h2>Name:${item.name}</h2>`;
    console.log(item);
    htmlCode += `<img src="${item.img.medium}">`;
    htmlCode += `</li>`;
  }
  htmlCode += `</ul>`;
  favoriteElements.innerHTML = htmlCode;
}

//Guardar listas de favoritos en el local storage
function setInLocalStorage() {
  const stringfavourites = JSON.stringify(favouriteList);
  localStorage.setItem("favourites", stringfavourites);
}
//Conseguir la lista de favoritos guardada en el LocalStorage
function getFromLocalStorage() {
  const localStorageFavourites = localStorage.getItem("favourites");
  if (localStorageFavourites === null) {
    getFromApi();
  } else {
    const arrayfavourites = JSON.parse(localStorageFavourites);
    favouriteList = arrayfavourites;
  }
  paintFavoritesShow();
}
getFromLocalStorage();
