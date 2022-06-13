document.addEventListener("DOMContentLoaded", function() {
  fetchAllBooks().then(books => books.forEach((book => renderTitle(book))))
});

const newUser = {"id":1, "username":"pouros"};

function fetchAllBooks() {
  return fetch("http://localhost:3000/books")
  .then(res => res.json())
}

function fetchSingleBook(id) {
  return fetch(`http://localhost:3000/books/${id}`)
  .then(res => res.json())
}

function renderTitle(book) {
  const ul = document.querySelector('#list')
  const li = document.createElement('li')
  li.id = book.id
  li.textContent = book.title
  li.addEventListener('click', e => renderInfo(e.target.id))
  ul.append(li)
  
}

function renderInfo(id) {
  fetchSingleBook(id).then(info => {
    const div = document.querySelector('#show-panel')
    div.innerHTML = ''
    const thumbNail = document.createElement('img')
    const descripton = document.createElement('p')
    thumbNail.src = info.img_url
    descripton.textContent = info.description
    div.append(thumbNail, descripton)
    for (let user of info.users) {
      const list = document.createElement('li')
      list.textContent = user.username
      div.append(list)
    }

    const bttn = document.createElement('button')
    bttn.textContent = 'LIKE'
    bttn.dataset.id = info.id
    div.append(bttn)

    bttn.addEventListener('click', e => { 
      info.users.push(newUser);
      fetch(`http://localhost:3000/books/${e.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          users: info.users
        })
      })
      .then(res => res.json())
      .then(data => renderInfo(data.id))
      
    })
  })

}



