const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const router = express.Router();

const fs = require("fs");
const path = require("path");

app.use(bodyParser.json())

/*
Get A List of All Users with notes
*/
router.get("/getUsers", (req, res) => {
	try {
		const users = fs.readdirSync("./server/notes/").map(file => path.parse(file).name);
		res.status(200).json({ "users": users });
	} catch (error) {
		res.status(400).json({ "errorMessage": "Could not pull user notes" })
	}
});

/*
Get a user's note an return a json array
*/
router.get("/note/:name", (req, res) => {
	try {
		const content = fs.readFileSync(`./server/notes/${req.params.name}.txt`);
		const notes = content.toString().trim().replace(/\r/g, "").split("\n");
		res.status(200).json({ "notes": notes });
	} catch (error) {
		res.status(400).json({ "errorMessage": `No note for user: ${req.params.name}` });
	}
});

/*
Create a new note
*/
router.post("/newNote/:name", (req, res) => {
	try {
		fs.appendFileSync(`./server/notes/${req.params.name}.txt`, req.body.note + "\n");
		res.status(200).json({ "message": `Created new note for ${req.params.name}` });
	} catch (error) {
		res.status(400).json({ "errorMessage": "Could not add new note" });
	}
});

/*
Update a note
*/
router.put("/updateNote/:name/:id", (req, res) => {
	try {
		const old_note = fs.readFileSync(`./server/notes/${req.params.name}.txt`);
		let note_array = old_note.toString().trim().replace(/\r/g, "").split("\n");

		if (note_array.length - 1 < req.params.id) {
			throw "No note at this index";
		}

		note_array[req.params.id] = req.body.note;

		const new_note = note_array.join("\n") + "\n";
		console.log(new_note);
		fs.writeFileSync(`./server/notes/${req.params.name}.txt`, new_note)
		res.status(200).json({ "message": `Updated note for ${req.params.name}` });
	} catch (error) {
		res.status(400).json({ "errorMessage": "Coud not update note" });
	}
});

app.use("/api", router);
app.listen(3000, () => {
	console.log("Server on port 3000");
});