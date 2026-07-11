const qTags = document.querySelectorAll(".q-tag");
qTags.forEach((qTag) => {
	qTag.addEventListener("change", (e) => {
		e.currentTarget.classList.toggle("btn-primary");
		e.currentTarget.classList.toggle("btn-light");
	});
});
