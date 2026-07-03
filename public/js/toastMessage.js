if (ToastMessage && ToastMessage !== "null" && ToastMessage.length > 0) {
	switch (ToastType) {
		case "success":
			background = "green";
			break;
		case "error":
			background = "red";
			break;
		case "info":
			background = "#2196F3";
			break;
	}

	Toastify({
		text: ToastMessage,
		duration: 5000,
		style: { background },
		close: true,
		offset: {
			y: "3rem"
		}
	}).showToast();
}
