if (ToastMessage && ToastMessage !== "null" && ToastMessage.length > 0) {
	switch (ToastType) {
		case "success":
			background = "#198754";
			break;
		case "error":
			background = "#DC3545";
			break;
		case "info":
			background = "#0AAECF";
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
