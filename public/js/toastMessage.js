if (ToastMessage && ToastMessage !== "null" && ToastMessage.length > 0) {
	const background = ToastType === "success" ? "green" : "red";

	Toastify({
		text: ToastMessage,
		duration: 5000,
		style: { background }
	}).showToast();
}
