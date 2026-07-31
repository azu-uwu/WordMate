const avatarButton = document.getElementById("avatar-button");
const dropdownMenu = document.getElementById("avatar-dropdown-menu");

avatarButton.addEventListener("click", (e) => {
    e.stopPropagation();

    avatarButton.classList.toggle("active");
    dropdownMenu.classList.toggle("show");
});

// Click ra ngoài thì đóng
document.addEventListener("click", () => {
    avatarButton.classList.remove("active");
    dropdownMenu.classList.remove("show");
});