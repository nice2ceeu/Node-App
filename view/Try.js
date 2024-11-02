let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");
let userAge = document.getElementById("userAge");
let userId = document.getElementById("userId");
let userCard = document.getElementById("userCard");
userCard.style.display = "none";

document.body.addEventListener("click", () => {
	userCard.style.display = "";
	userName.textContent = "profile.name";
	userEmail.textContent = "profile.email";
	userAge.textContent = "profile.age";
	userId.textContent = "profile._id";

	alert("click detected Added info");
});
