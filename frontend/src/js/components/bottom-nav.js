/**
 * Bottom Navigation Component
 *
 * Chịu trách nhiệm:
 * - Xác định trang hiện tại.
 * - Tự động thêm class "active" cho menu tương ứng.
 *
 * @module BottomNav
 */

/**
 * Khởi tạo Bottom Navigation
 */
export function initBottomNav() {

    // Tên file hiện tại
    const currentPage = window.location.pathname.split("/").pop();

    // Lấy tất cả menu
    const navItems = document.querySelectorAll(".bottom-nav-item");

    navItems.forEach(item => {

        // Xóa active cũ
        item.classList.remove("active");

        const href = item.getAttribute("href");

        if (!href) return;

        // So sánh với trang hiện tại
        if (href.endsWith(currentPage)) {
            item.classList.add("active");
        }

    });

}