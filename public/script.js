function itemTemplate(item) {
	return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.todo}</span>
          <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>`;
}

// Initial page load render to insert in <ul> in todo.ejs
let ourHTML = items
	.map(item => {
		return itemTemplate(item);
	})
	.join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// Input field
let createField = document.getElementById("create-field");

// Create feature without reload page
document.getElementById("create-form").addEventListener("submit", e => {
	e.preventDefault();

	axios
		.post("/create-item", {
			todo: createField.value
		})
		.then(response => {
			// Create HTML for a new item
			document
				.getElementById("item-list")
				.insertAdjacentHTML("beforeend", ourHTML);

			createField.value = "";
			createField.focus();
		})
		.catch(() => {
			console.log("Something went wrong. Try again later");
		});
});

// Edit todo
document.addEventListener("click", e => {
	// Delete feature
	if (e.target.classList.contains("delete-me")) {
		if (confirm("Do you really want to delete this item?")) {
			axios
				.post("/delete-item", {
					id: e.target.getAttribute("data-id")
				})
				.then(() => {
					e.target.parentElement.parentElement.remove();
				})
				.catch(() => {
					console.log("Try again later");
				});
		}
	}

	// Edit feature
	if (e.target.classList.contains("edit-me")) {
		let userInput = prompt(
			"Enter a new Todo:",
			e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
		);
		// 2 params: 1. url for post request. 2. Data (object) that is send along to url.
		if (userInput) {
			axios
				.post("/update-item", {
					todo: userInput,
					id: e.target.getAttribute("data-id")
				})
				.then(() => {
					e.target.parentElement.parentElement.querySelector(
						".item-text"
					).innerHTML = userInput;
				})
				.catch(() => {
					console.log("Try again later");
				});
		}
	}
});
