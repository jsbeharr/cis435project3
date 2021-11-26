const editClick = (index) => {
	return function () {
		// enable text box
		document.querySelector(`input[name="${index}"]`).disabled = false
		// enable confirm and cancel button
		document.querySelector(`#confirm${index}`).className = "edit";
		document.querySelector(`#cancel${index}`).className = "delete";
		// disable edit button
		document.querySelector(`#edit${index}`).className = "unavailable";
	}
}

const confirmClick = (name, index) => {
	return function () {
		const input = document.querySelector(`input[name="${index}"]`);

		const requestOptions = {
			method: "PUT",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ "note": input.value })
		};

		fetch(`http://localhost:3000/api/updateNote/${name}/${index}`, requestOptions)
			.then(() => {
				document.querySelector(`input[name="${index}"]`).disabled = true;
				document.querySelector(`input[name="${index}"]`).value = input.value;
				// disable confirm and cancel button
				document.querySelector(`#confirm${index}`).className = "unavailable";
				document.querySelector(`#cancel${index}`).className = "unavailable";
				document.querySelector(`#cancel${index}`).onclick = cancelClick(input.value, index);
				// re enable edit button
				document.querySelector(`#edit${index}`).className = "edit";
			});
	}
}

const cancelClick = (note, index) => {
	return function () {
		// disable  text box and set original note
		document.querySelector(`input[name="${index}"]`).disabled = true;
		document.querySelector(`input[name="${index}"]`).value = note;
		// disable confirm and cancel button
		document.querySelector(`#confirm${index}`).className = "unavailable";
		document.querySelector(`#cancel${index}`).className = "unavailable";
		// re enable edit button
		document.querySelector(`#edit${index}`).className = "edit";
	}
}

const deleteClick = (name, index) => {
	return function () {
		fetch(`http://localhost:3000/api/deleteNote/${name}/${index}`, { method: "DELETE" })
			.then(() => {
				const resetNotes = usernameClick(name);
				resetNotes();
			})
	}
}

const usernameClick = (name) => {
	return function () {
		fetch(`http://localhost:3000/api/note/${name}`)
			.then(res => res.json())
			.then(data => {
				// Get and Initialize User Notes section
				document.querySelector("#user-notes-title").innerHTML = `${name} Notes`;
				const notesList = document.querySelector("#user-notes-input");
				notesList.innerHTML = ""

				// For every note setup an input box, buttons, and setup click listeners
				const notes = data.notes;
				notes.forEach((note, index) => {
					const input = document.createElement("input");
					input.type = "text";
					input.name = index;
					input.value = note;
					input.disabled = true;

					const editButton = document.createElement("button")
					editButton.id = `edit${index}`;
					editButton.className = "edit";
					editButton.onclick = editClick(index);
					editButton.appendChild(document.createTextNode("Edit Note"));

					const confirmButton = document.createElement("button")
					confirmButton.id = `confirm${index}`;
					confirmButton.className = "unavailable";
					confirmButton.onclick = confirmClick(name, index);
					confirmButton.appendChild(document.createTextNode("Confirm Change"));

					const cancelButton = document.createElement("button")
					cancelButton.id = `cancel${index}`;
					cancelButton.className = "unavailable";
					cancelButton.onclick = cancelClick(note, index);
					cancelButton.appendChild(document.createTextNode("Cancel"));

					const deleteButton = document.createElement("button")
					deleteButton.className = "delete";
					deleteButton.onclick = deleteClick(name, index);
					deleteButton.appendChild(document.createTextNode("Delete Note"));

					notesList.appendChild(input);
					notesList.appendChild(editButton);
					notesList.appendChild(confirmButton);
					notesList.appendChild(cancelButton)
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