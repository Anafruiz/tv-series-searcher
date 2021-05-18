"use strict";

const buttonElement = document.querySelector(".js-button");
const inputElement = document.querySelector(".js-input");
const nameElement = document.querySelector(".js-shows");
const formElement = document.querySelector(".js-form");

//Cogemos los datos del Api, para ello tenemos que crear una constante con el valor del input para coger los datos del api dependiendo del titulo de la serie q introduzca la usuaria//
let showsList = [];
let favouriteList = [];

function getFromApi() {
  const titleName = inputElement.value;
  fetch(`//api.tvmaze.com/search/shows?q=${titleName}`)
    .then((response) => response.json())
    .then((data) => {
      showsList = [];
      for (const eachData of data) {
        const title = eachData.show.name;
        const img = eachData.show.image;
        const idData = eachData.show.id;
        // Metemos los datos en mi nuevo array showsList
        showsList.push({ name: title, img: img, id: idData });
      }
      paintElements();
      setInLocalStorage();
    });
}
function handleForm(ev) {
  ev.preventDefault();
}

formElement.addEventListener("submit", handleForm);
//Pintamos los datos, pero para conseguir los datos hay que iterar el array data para conseguir la propiedad que estamos buscando
let imagenDefault = "https://via.placeholder.com/210x295/ffffff/666666/?";
function paintElements() {
  let htmlCode = "";
  htmlCode += `<ul>`;
  for (const eachData of showsList) {
    const title = eachData.name;
    const img = eachData.img;
    const idData = eachData.id;
    // Metemos los datos en mi nuevo array showsList
    //Pintamos los datos
    //Primero, llamamos a la función para ver si la peli está en favorito. Si está en favoritos añadimos la clase del borde y si no está, no se la ponemos.

    let favouriteClass;
    if (isShowsFavourites(eachData)) {
      favouriteClass = "backstyle";
    } else {
      favouriteClass = "";
    }
    htmlCode += `<li class="show " data-myid=${idData} >`;
    htmlCode += `<h2 class="title2">Nombre:${title}</h2>`;
    if (img === null) {
      htmlCode += `<img class="imgList  ${favouriteClass}" src="${imagenDefault}"> `;
    } else {
      htmlCode += `<img class="imgList  ${favouriteClass}" src="${img.medium}"> `;
    }

    htmlCode += `</li>`;
  }
  htmlCode += `</ul>`;
  nameElement.innerHTML = htmlCode;
  listenShowsEvents();
  listenFav();
}

//Con esta función comprobamos si la serie está en favoritos y hacemos el favouriteClass de añadir o quitar la clase
function isShowsFavourites(dataElements) {
  const favoriteFound = favouriteList.find((favorite) => {
    return favorite.id === dataElements.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
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

  //Quiero buscar solo el ID de mi showsList, para indicar q si es igual q mi elemento clickado lo vaya añadiendo al nuevo array(favouriteList)
  const favouriteIndex = showsList.find(function (item) {
    return item.id === clickedId;
  });
  const showFound = favouriteList.findIndex(function (show) {
    return show.id === clickedId;
  });
  if (showFound === -1) {
    favouriteList.push(favouriteIndex);
  } else {
    favouriteList.splice(showFound, 1);
  }

  setInLocalStorage();
  paintFavoritesShow();
  paintElements();
}

const favoriteElements = document.querySelector(".js-favourite--shows");

//Pintar series favoritas

function paintFavoritesShow() {
  let htmlCode = "";
  htmlCode += `<button class="js-reset">Reset <i class="fa fa-trash" aria-hidden="true"></i></button>`;

  htmlCode += `<ul>`;
  for (const item of favouriteList) {
    htmlCode += `<li class="favouriteShow" data-myid=${item.id} >`;
    htmlCode += `<h2>Name:${item.name}`;
    htmlCode += ` <button class="removeButton js-removeButton">Remove</button>`;
    htmlCode += `</h2>`;
    if (item.img === null) {
      htmlCode += `<img src="${imagenDefault}">`;
    } else {
      htmlCode += `<img class="backstyle"src="${item.img.medium}">`;
      /*       htmlCode += `<input type ="reset" class="js-reset" value="borrar">`;
       */ htmlCode += `</li>`;
    }
  }
  htmlCode += `</ul>`;
  favoriteElements.innerHTML = htmlCode;
  const resetButton = document.querySelector(".js-reset");
  resetButton.addEventListener("click", resetFavButton);
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
listenFav();

//Boton de Reset para borrar la lista de favoritos.

function resetFavButton() {
  favouriteList = [];
  paintFavoritesShow();
  paintElements();
}

function listenFav() {
  const removeButtons = document.querySelectorAll(".js-removeButton");

  for (const removeButton of removeButtons) {
    removeButton.addEventListener("click", handleFav);
  }
}
function handleFav(ev) {
  const clickedId = parseInt(ev.currentTarget.dataset.myid);
  console.log(clickedId);

  const showFound = favouriteList.findIndex(function (show) {
    return show.id === clickedId;
  });
  if (showFound === -1) {
    favouriteList.splice(showFound);
  } /*  else {
    favouriteList.splice(showFound, 1);
  } */

  setInLocalStorage();
  paintFavoritesShow();
  paintElements();
}
