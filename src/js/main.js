"use strict";

const buttonElement = document.querySelector(".js-button");
const inputElement = document.querySelector(".js-input");
const nameElement = document.querySelector(".js-shows");
/* const formElement = document.querySelector(".js-form");
 */

//Cogemos los datos del Api, para ello tenemos que crear una constante con el valor del input para coger los datos del api dependiendo del titulo de la serie q introduzca la usuaria

function getFromApi() {
  const titleName = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${titleName}`)
    .then((response) => response.json())
    .then((data) => {
      paintElements(data);
      handleClick();
    });
}
//Pintamos los datos, pero para conseguir los datos hay que iterar el array data para conseguir la propiedad que estamos buscando
function paintElements(data) {
  for (const eachData of data) {
    const title = eachData.show.name;
    const img = eachData.show.image || "url(../images/photo-preview1.jpg))";
    nameElement.innerHTML += `<p class="show">
    Nombre:${title}
    <img class ="show" src="${img.medium}"> 
    </p>`;
  }
  handleClick();
}
//Escuchamos al botón para que al clickarlo, llame a la función que coge los datos del Api
buttonElement.addEventListener("click", getFromApi);

function handleClick() {
  const elements = document.querySelector(".show");
  console.log("Me han clickado");
  elements.addEventListener("click", handleClick);
}
