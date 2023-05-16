const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

const toyCollection = document.querySelector("#toy-collection")
fetch("http://localhost:3000/toys")
.then(resp => resp.json())
.then(toys => {
  // Take my toys array and make HTML with them in order to add them to the DOM
  let toysHTML = toys.map(function(toy){
    return `
    <div class="card">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p> ${toy.likes} Likes </p>
      <button data-id:"${toy.id}" class="like-btn" id="[toy_id]">Like ❤️</button>
      <button data-id="${toy.id}" class="delete-btn" id="[toy_id]">Back in the Toy Chest</button>
    </div>
    `
  })
  // Add to the toy collection <div>
  toyCollection.innerHTML = toysHTML.join('')
})

toyFormContainer.addEventListener("submit", function(e){
  e.preventDefault();
  console.log(e.target.name)
  // Grab the inputs from the form
  const toyName = e.target.name.value
  const toyImage = e.target.image.value
  
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: toyName,
      image: toyImage,
      likes: 99
    })
  })
  .then(resp => resp.json())
  .then(newToy => {
    // fetch updated the Database
    // NOW UPDATE THE DOM!
    //Convert the newToy from JSON to HTML in order to add to the DOM
    let newToyHTML = `
      <div class="card">
        <h2>${newToy.name}</h2>
        <img src=${newToy.image} class="toy-avatar" />
        <p> ${newToy.likes} Likes </p>
        <button data-id="${newToy.id}" class="like-btn" id="[toy_id]">Like ❤️</button>
      </div>
      `
    toyCollection.innerHTML += newToyHTML
    })

  })

//Increase the Toy Likes
toyCollection.addEventListener("click", (e) => {
    if (e.target.className === "like-btn"){
      let currentLikes = parseInt(e.target.previousElementSibling.innerText)
      let newLikes = currentLikes + 1
      e.target.previousElementSibling.innerText = newLikes + " Likes"
      

      fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      //DO NOT NEED A .then() HERE B/C THE DOM WAS ALREADY MANIPULATED ABOVE, THIS PATCH IS UPDATING THE SERVER
      })
  }

  if (e.target.className === "delete-btn"){
    fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
      method: "DELETE",

     })
     .then(resp => {
      e.target.parentElement.remove()
     })
    }
  })




  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
})
