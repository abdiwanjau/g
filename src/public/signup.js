
const form = document.querySelector("form");
const regBtn = document.querySelector("button");

const origin = window.location.origin;

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const body = {
    name:form.elements.name.value,
    password:form.elements.password.value,
    email:form.elements.email.value
  }
  
  fetch(`${origin}/signup`, {
    method:"POST",
    body
  }).then(res => {
    console.log(res)
  }).catch(e => {
    console.log("skfmkdf")
  })
})