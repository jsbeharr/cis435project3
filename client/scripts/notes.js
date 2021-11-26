const usernameClick = (name) => {
	return function () {
		fetch(`http://localhost:3000/api/note/${name}`)
			.then(res => res.json())
			.then(data => {
				document.querySelector("#user-notes-title").innerHTML = `${name} Notes`;
				const notesList = document.querySelector("#user-notes-input");
				notesList.innerHTML = ""

				const notes = data.notes;
				notes.forEach((note, index) => {
					const input = document.createElement("input");
					input.type = "text";
					input.name = note.index;
					input.placeholder = note;
					input.disabled = true;

					const editButton = document.createElement("button")
					editButton.id = "edit";
					editButton.appendChild(document.createTextNode("Edit Note"));

					const deleteButton = document.createElement("button")
					deleteButton.id = "delete";
					deleteButton.appendChild(document.createTextNode("Delete Note"));

					notesList.appendChild(input);
					notesList.appendChild(editButton);
					notesList.appendChild(deleteButton);
				});
			})
	}
}

const getUsers = () => {
	fetch("http://localhost:3000/api/getUsers")
		.then(res => res.json())
		.then(data => {
			const userList = document.querySelector("#user-list");

			// Add users to list and button functionality
			const users = data.users;
			users.forEach(name => {
				let entry = document.createElement("li");
				entry.appendChild(document.createTextNode(name));
				entry.onclick = usernameClick(name);
				userList.appendChild(entry);
			});
		});
}

const init = () => {
	getUsers();
}


window.addEventListener("load", init);