const API = "https://dummyjson.com/users"

const table = document.getElementById("userTable")
const form = document.getElementById("userForm")
const searchInput = document.getElementById("searchInput")

let users = []
let editId = null


// =======================
// GET USERS
// =======================

async function getUsers(){

try{

const res = await fetch(API)
const data = await res.json()

users = data.users

renderUsers(users)

}catch(error){

console.log(error)

}

}

getUsers()



// =======================
// RENDER USERS
// =======================

function renderUsers(userList){

table.innerHTML = ""

userList.forEach(user => {

table.innerHTML += `
<tr class="border">

<td class="p-2">${user.id}</td>
<td class="p-2">${user.firstName}</td>
<td class="p-2">${user.lastName}</td>
<td class="p-2">${user.email}</td>
<td class="p-2">${user.phone}</td>

<td class="p-2 space-x-2">

<button onclick="editUser(${user.id})" class="editBtn">Edit</button>

<button onclick="deleteUser(${user.id})" class="deleteBtn">Delete</button>

</td>

</tr>
`

})

}



// =======================
// ADD USER
// =======================

form.addEventListener("submit", async function(e){

e.preventDefault()

const firstName = document.getElementById("firstName").value
const lastName = document.getElementById("lastName").value
const email = document.getElementById("email").value
const phone = document.getElementById("phone").value


if(editId){

updateUser(editId)

return

}


try{

const res = await fetch(API + "/add",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
firstName,
lastName,
email,
phone
})

})

const data = await res.json()

users.push(data)

renderUsers(users)

form.reset()

alert("User Added!")

}catch(error){

console.log(error)

}

})



// =======================
// DELETE USER
// =======================

async function deleteUser(id){

try{

await fetch(API + "/" + id,{
method:"DELETE"
})

users = users.filter(user => user.id !== id)

renderUsers(users)

alert("User Deleted")

}catch(error){

console.log(error)

}

}



// =======================
// EDIT USER
// =======================

function editUser(id){

const user = users.find(u => u.id === id)

document.getElementById("firstName").value = user.firstName
document.getElementById("lastName").value = user.lastName
document.getElementById("email").value = user.email
document.getElementById("phone").value = user.phone

editId = id

}



// =======================
// UPDATE USER
// =======================

async function updateUser(id){

const firstName = document.getElementById("firstName").value
const lastName = document.getElementById("lastName").value
const email = document.getElementById("email").value
const phone = document.getElementById("phone").value

try{

await fetch(API + "/" + id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
firstName,
lastName,
email,
phone
})

})

const index = users.findIndex(user => user.id === id)

users[index] = { ...users[index], firstName, lastName, email, phone }

renderUsers(users)

form.reset()

editId = null

alert("User Updated!")

}catch(error){

console.log(error)

}

}



// =======================
// SEARCH USER
// =======================

searchInput.addEventListener("input", async function(){

const q = searchInput.value

if(q === ""){

renderUsers(users)

return

}

const res = await fetch(API + "/search?q=" + q)

const data = await res.json()

renderUsers(data.users)

})