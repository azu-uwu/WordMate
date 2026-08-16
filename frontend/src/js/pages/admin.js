/**
 * Admin Dashboard Page — WordMate
 * M8-T8 Roadmap & Topic CRUD.
 *
 * Responsibilities:
 * 1. Guard the page: only logged-in admin users can access.
 * 2. Render admin display name in the header.
 * 3. Switch between the 4 admin sections.
 * 4. Logout handler.
 * 5. Roadmap CRUD (DataTable + modal + upload image).
 * 6. Topic CRUD (DataTable + filter by roadmap + modal + upload image).
 */

import * as authService from '../../services/authService.js';
import api, { getMediaUrl } from '../../services/api.js';

// ============================================================
// CONSTANTS
// ============================================================

const API_BASE_URL = 'http://localhost:5000/api';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_IMAGE_EXT = ['jpg', 'jpeg', 'png'];

// ============================================================
// DOM ELEMENTS
// ============================================================

const pageTitle = document.getElementById('adminPageTitle');
const pageSubtitle = document.getElementById('adminPageSubtitle');
const userNameEl = document.getElementById('adminUserName');
const logoutBtn = document.getElementById('adminLogoutBtn');
const logoutBtnMobile = document.getElementById('adminLogoutBtnMobile');

// Roadmap form elements
const roadmapModalEl = document.getElementById('roadmapModal');
const roadmapForm = document.getElementById('roadmapForm');
const roadmapIdInput = document.getElementById('roadmapId');
const roadmapNameInput = document.getElementById('roadmapName');
const roadmapDescriptionInput = document.getElementById('roadmapDescription');
const roadmapSortOrderInput = document.getElementById('roadmapSortOrder');
const roadmapIsActiveInput = document.getElementById('roadmapIsActive');
const roadmapIsActiveLabel = document.getElementById('roadmapIsActiveLabel');
const roadmapImageInput = document.getElementById('roadmapImageInput');
const roadmapImagePreview = document.getElementById('roadmapImagePreview');
const roadmapImagePlaceholder = document.getElementById('roadmapImagePlaceholder');
const roadmapFormError = document.getElementById('roadmapFormError');
const roadmapSaveBtn = document.getElementById('roadmapSaveBtn');
const roadmapSaveSpinner = document.getElementById('roadmapSaveSpinner');
const roadmapSaveBtnText = document.getElementById('roadmapSaveBtnText');

// Topic form elements
const topicModalEl = document.getElementById('topicModal');
const topicForm = document.getElementById('topicForm');
const topicIdInput = document.getElementById('topicId');
const topicNameInput = document.getElementById('topicName');
const topicDescriptionInput = document.getElementById('topicDescription');
const topicSortOrderInput = document.getElementById('topicSortOrder');
const topicIsActiveInput = document.getElementById('topicIsActive');
const topicIsActiveLabel = document.getElementById('topicIsActiveLabel');
const topicImageInput = document.getElementById('topicImageInput');
const topicImagePreview = document.getElementById('topicImagePreview');
const topicImagePlaceholder = document.getElementById('topicImagePlaceholder');
const topicRoadmapIdInput = document.getElementById('topicRoadmapId');
const topicFormError = document.getElementById('topicFormError');
const topicSaveBtn = document.getElementById('topicSaveBtn');
const topicSaveSpinner = document.getElementById('topicSaveSpinner');
const topicSaveBtnText = document.getElementById('topicSaveBtnText');

// Delete confirm modal
const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
const confirmDeleteText = document.getElementById('confirmDeleteText');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmDeleteSpinner = document.getElementById('confirmDeleteSpinner');

// Topic filter
const topicsRoadmapFilter = document.getElementById('topicsRoadmapFilter');

// ============================================================
// STATE
// ============================================================

let roadmaps = [];                // danh sách Roadmap mới nhất từ server
let roadmapsDataTable = null;
let topicsDataTable = null;
let topicsDTData = [];             // data Topics hiện tại trong bảng
let selectedRoadmapFile = null;    // file mới chọn cho Roadmap
let selectedTopicFile = null;      // file mới chọn cho Topic
let currentRoadmapImage = null;    // image path hiện tại khi mở form sửa Roadmap
let currentTopicImage = null;      // image path hiện tại khi mở form sửa Topic
let pendingDelete = null;          // { type: 'roadmap'|'topic', id, name }

// ============================================================
// SECTION METADATA
// ============================================================

const SECTION_META = {
    'roadmaps': {
        title: 'Roadmaps',
        subtitle: 'Quản lý lộ trình học tập trong hệ thống'
    },
    'topics': {
        title: 'Topics',
        subtitle: 'Quản lý chủ đề học tập trong hệ thống'
    },
    'vocabularies': {
        title: 'Vocabularies',
        subtitle: 'Quản lý từ vựng trong hệ thống'
    },
    'custom-questions': {
        title: 'Custom Questions',
        subtitle: 'Quản lý câu hỏi tùy chỉnh trong hệ thống'
    }
};

// ============================================================
// AUTHENTICATION GUARD
// ============================================================

function isAdmin() {
    if (!authService.isAuthenticated()) {
        return false;
    }

    const user = authService.getCurrentUser();
    return !!user && user.role === 'admin';
}

function guardAdminPage() {
    if (!isAdmin()) {
        authService.logout();
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// ============================================================
// UI HELPERS
// ============================================================

function renderAdminInfo() {
    if (!userNameEl) return;

    const user = authService.getCurrentUser();
    if (user && user.fullname) {
        userNameEl.textContent = user.fullname;
    } else if (user && user.username) {
        userNameEl.textContent = user.username;
    } else if (user && user.email) {
        userNameEl.textContent = user.email;
    } else {
        userNameEl.textContent = 'Admin';
    }
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;

    const iconMap = {
        success: 'fa-circle-check',
        error: 'fa-circle-exclamation',
        info: 'fa-circle-info'
    };
    const icon = iconMap[type] || iconMap.info;

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

/**
 * Shorten long text for table cells.
 */
function truncateText(text, maxLength = 80) {
    if (!text) return '';
    const str = String(text);
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
}

/**
 * Render a status badge for is_active.
 */
function statusBadgeHtml(value) {
    if (Number(value) === 1 || value === true) {
        return '<span class="badge admin-badge-success"><i class="fa-solid fa-circle me-1"></i>Đang hoạt động</span>';
    }
    return '<span class="badge admin-badge-muted"><i class="fa-solid fa-circle me-1"></i>Đã ẩn</span>';
}

/**
 * Escape HTML entities to prevent XSS.
 * Dùng phép cộng chuỗi để tránh bị auto-format chuyển ngược entity thành ký tự thật.
 */
function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&' + 'amp;')
        .replace(/</g, '&' + 'lt;')
        .replace(/>/g, '&' + 'gt;')
        .replace(/"/g, '&' + 'quot;')
        .replace(/'/g, '&#' + '039;');
}

function isImageValid(file) {
    if (!file) return { valid: false, error: 'Chưa chọn file.' };

    if (file.size > MAX_IMAGE_SIZE) {
        return { valid: false, error: 'File ảnh vượt quá 5MB.' };
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_IMAGE_EXT.includes(ext)) {
        return { valid: false, error: 'Chỉ chấp nhận file ảnh JPG, JPEG, PNG.' };
    }

    return { valid: true, error: null };
}

// ============================================================
// NAVIGATION — Section switching
// ============================================================

function activateSection(sectionKey) {
    if (!SECTION_META[sectionKey]) return;

    document.querySelectorAll('.admin-section').forEach((section) => {
        const active = section.getAttribute('data-section') === sectionKey;
        section.classList.toggle('active', active);
    });

    document.querySelectorAll('.admin-nav-link').forEach((link) => {
        const active = link.getAttribute('data-section') === sectionKey;
        link.classList.toggle('active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    if (pageTitle) {
        pageTitle.textContent = SECTION_META[sectionKey].title;
    }
    if (pageSubtitle) {
        pageSubtitle.textContent = SECTION_META[sectionKey].subtitle;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindNavigation() {
    document.querySelectorAll('.admin-nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            const sectionKey = link.getAttribute('data-section');
            if (!sectionKey) return;

            activateSection(sectionKey);

            const canvasEl = document.getElementById('adminSidebarCanvas');
            if (canvasEl && window.bootstrap) {
                const offcanvas = bootstrap.Offcanvas.getInstance(canvasEl);
                if (offcanvas) {
                    offcanvas.hide();
                }
            }
        });
    });
}

// ============================================================
// LOGOUT
// ============================================================

function handleLogout() {
    authService.logout();
    window.location.href = '../auth/login.html';
}

// ============================================================
// DATATABLES — language pack
// ============================================================

const DATATABLE_VI = {
    processing: 'Đang xử lý...',
    search: 'Tìm kiếm:',
    lengthMenu: 'Hiển thị _MENU_ dòng',
    info: 'Hiển thị _START_ đến _END_ trong _TOTAL_ dòng',
    infoEmpty: 'Hiển thị 0 dòng',
    infoFiltered: '(lọc từ _MAX_ dòng)',
    loadingRecords: 'Đang tải dữ liệu...',
    zeroRecords: 'Không tìm thấy dữ liệu phù hợp',
    emptyTable: 'Chưa có dữ liệu',
    paginate: {
        first: 'Đầu',
        previous: '<i class="fa-solid fa-chevron-left"></i>',
        next: '<i class="fa-solid fa-chevron-right"></i>',
        last: 'Cuối'
    },
    aria: {
        sortAscending: ': sắp xếp tăng dần',
        sortDescending: ': sắp xếp giảm dần'
    }
};

// ============================================================
// DATATABLES — setup
// ============================================================

function setupRoadmapsTable() {
    roadmapsDataTable = $('#roadmapsTable').DataTable({
        data: [],
        columns: [
            {
                data: null,
                className: 'admin-col-index',
                render: (data, type, row, meta) => {
                    if (type === 'display') {
                        return `<span class="text-muted">${meta.row + 1}</span>`;
                    }
                    return meta.row + 1;
                }
            },
            {
                data: 'image',
                orderable: false,
                render: (data, type) => {
                    if (type !== 'display') return data || '';
                    if (!data) {
                        return '<div class="admin-thumb admin-thumb-empty"><i class="fa-solid fa-map"></i></div>';
                    }
                    const url = getMediaUrl(data);
                    return `<div class="admin-thumb"><img src="${url}" alt="Ảnh Roadmap" loading="lazy"></div>`;
                }
            },
            { data: 'name', render: (data) => `<strong>${esc(data || '')}</strong>` },
            {
                data: 'description',
                render: (data) => {
                    if (!data) return '<span class="text-muted">—</span>';
                    return `<span title="${esc(data)}">${esc(truncateText(data))}</span>`;
                }
            },
            {
                data: 'sort_order',
                render: (data) => `<span class="badge bg-secondary-subtle text-light">${esc(data ?? 0)}</span>`
            },
            { data: 'is_active', render: statusBadgeHtml },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: (data) => {
                    const id = esc(data.id);
                    return `
                        <div class="admin-row-actions">
                            <button type="button" class="btn btn-sm btn-outline-secondary admin-action-btn"
                                    data-action="edit" data-id="${id}" title="Sửa">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger admin-action-btn"
                                    data-action="delete" data-id="${id}" title="Xóa">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>`;
                }
            }
        ],
        language: DATATABLE_VI,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        columnDefs: [
            { targets: '_all', className: 'align-middle' },
            { targets: [0, 1, 6], orderable: false }
        ],
        order: [[4, 'asc']],
        initComplete: function () {
            $('#roadmapsTable_filter input').addClass('form-control form-control-sm');
            $('#roadmapsTable_filter label').addClass('admin-datatable-search');
        }
    });

    $('#roadmapsTable tbody').on('click', '.admin-action-btn', (e) => {
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);
        const item = roadmaps.find((r) => Number(r.id) === id);
        if (!item) return;
        if (action === 'edit') {
            openRoadmapModal(item);
        } else if (action === 'delete') {
            openConfirmDeleteModal('roadmap', item);
        }
    });
}

function setupTopicsDatatable() {
    topicsDataTable = $('#topicsTable').DataTable({
        data: [],
        columns: [
            {
                data: null,
                className: 'admin-col-index',
                // render: (data, type, meta) => {
                //     if (type === 'display') {
                //         return `<span class="text-muted">${meta.row + 1}</span>`;
                //     }
                //     return meta.row + 1;
                // }
                render: function (data, type, row, meta) {
                    return `<span class="text-muted">${meta.row + 1}</span>`;
                }       
            },
            {
                data: 'image',
                orderable: false,
                render: (data, type) => {
                    if (type !== 'display') return data || '';
                    if (!data) {
                        return '<div class="admin-thumb admin-thumb-empty"><i class="fa-solid fa-folder-tree"></i></div>';
                    }
                    const url = getMediaUrl(data);
                    return `<div class="admin-thumb"><img src="${url}" alt="Ảnh Topic" loading="lazy"></div>`;
                }
            },
            { data: 'name', render: (data) => `<strong>${esc(data || '')}</strong>` },
            {
                data: null,
                render: (row) => {
                    const roadmap = roadmaps.find((r) => Number(r.id) === Number(row.roadmap_id));
                    return roadmap ? esc(roadmap.name) : '<span class="text-muted">—</span>';
                }
            },
            {
                data: 'description',
                render: (data) => {
                    if (!data) return '<span class="text-muted">—</span>';
                    return `<span title="${esc(data)}">${esc(truncateText(data))}</span>`;
                }
            },
            {
                data: 'sort_order',
                render: (data) => `<span class="badge bg-secondary-subtle text-light">${esc(data ?? 0)}</span>`
            },
            { data: 'is_active', render: statusBadgeHtml },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: (data) => {
                    const id = esc(data.id);
                    return `
                        <div class="admin-row-actions">
                            <button type="button" class="btn btn-sm btn-outline-secondary admin-action-btn"
                                    data-action="edit" data-id="${id}" title="Sửa">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger admin-action-btn"
                                    data-action="delete" data-id="${id}" title="Xóa">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>`;
                }
            }
        ],
        language: DATATABLE_VI,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        columnDefs: [
            { targets: '_all', className: 'align-middle' },
            { targets: [0, 1, 7], orderable: false }
        ],
        order: [[5, 'asc']],
        initComplete: function () {
            $('#topicsTable_filter input').addClass('form-control form-control-sm');
            $('#topicsTable_filter label').addClass('admin-datatable-search');
        }
    });

    $('#topicsTable tbody').on('click', '.admin-action-btn', (e) => {
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);
        const topic = topicsDTData.find((t) => Number(t.id) === id);
        if (!topic) return;
        if (action === 'edit') {
            openTopicModal(topic);
        } else if (action === 'delete') {
            openConfirmDeleteModal('topic', topic);
        }
    });
}

// ============================================================
// LOAD DATA
// ============================================================

async function loadRoadmaps() {
    const loadingEl = document.getElementById('roadmapsTableLoading');
    if (loadingEl) loadingEl.classList.remove('d-none');

    try {
        const res = await api.get('/admin/roadmaps');
        roadmaps = Array.isArray(res.data) ? res.data : [];

        roadmapsDataTable.clear();
        roadmapsDataTable.rows.add(roadmaps);
        roadmapsDataTable.draw();

        populateTopicsRoadmapFilter();
        populateTopicRoadmapModalSelect();
    } catch (error) {
        showToast(error.message || 'Không tải được danh sách Roadmap.', 'error');
    } finally {
        if (loadingEl) loadingEl.classList.add('d-none');
    }
}

async function loadTopics() {
    const loadingEl = document.getElementById('topicsTableLoading');
    if (loadingEl) loadingEl.classList.remove('d-none');

    const roadmapId = topicsRoadmapFilter.value;
    const query = roadmapId ? `?roadmap_id=${encodeURIComponent(roadmapId)}` : '';
    try {
        const res = await api.get(`/admin/topics${query}`);
        topicsDTData = Array.isArray(res.data) ? res.data : [];

        topicsDataTable.clear();
        topicsDataTable.rows.add(topicsDTData);
        topicsDataTable.draw();
    } catch (error) {
        showToast(error.message || 'Không tải được danh sách Topic.', 'error');
    } finally {
        if (loadingEl) loadingEl.classList.add('d-none');
    }
}

function populateTopicsRoadmapFilter() {
    if (!topicsRoadmapFilter) return;

    const current = topicsRoadmapFilter.value;
    topicsRoadmapFilter.innerHTML = '<option value="">Tất cả Roadmap</option>';
    roadmaps.forEach((roadmap) => {
        const option = document.createElement('option');
        option.value = roadmap.id;
        option.textContent = roadmap.name;
        topicsRoadmapFilter.appendChild(option);
    });
    topicsRoadmapFilter.value = current;

    // Nếu roadmap đã bị xóa → reset filter về tất cả
    if (current && !roadmaps.some((r) => String(r.id) === current)) {
        topicsRoadmapFilter.value = '';
        loadTopics();
    }
}

function populateTopicRoadmapModalSelect() {
    if (!topicRoadmapIdInput) return;

    const current = topicRoadmapIdInput.value;
    topicRoadmapIdInput.innerHTML = '<option value="">-- Chọn Roadmap --</option>';
    roadmaps.forEach((roadmap) => {
        const option = document.createElement('option');
        option.value = roadmap.id;
        option.textContent = roadmap.name;
        topicRoadmapIdInput.appendChild(option);
    });
    topicRoadmapIdInput.value = current;
}

// ============================================================
// ROADMAP MODAL
// ============================================================

function resetRoadmapForm() {
    roadmapForm.reset();
    roadmapIdInput.value = '';
    roadmapNameInput.classList.remove('is-invalid');
    roadmapFormError.classList.add('d-none');
    roadmapFormError.textContent = '';
    roadmapIsActiveInput.checked = true;
    updateActiveLabel(roadmapIsActiveInput, roadmapIsActiveLabel);
    roadmapSortOrderInput.value = 0;
    selectedRoadmapFile = null;
    currentRoadmapImage = null;
    roadmapImageInput.value = '';
    roadmapImagePreview.classList.add('d-none');
    roadmapImagePreview.src = '';
    roadmapImagePlaceholder.classList.remove('d-none');
    roadmapSaveBtnText.textContent = 'Thêm mới';
}

function openRoadmapModal(item = null) {
    resetRoadmapForm();

    const modalTitle = document.getElementById('roadmapModalLabel');
    if (item) {
        modalTitle.textContent = 'Sửa Roadmap';
        roadmapIdInput.value = item.id;
        roadmapNameInput.value = item.name || '';
        roadmapDescriptionInput.value = item.description || '';
        roadmapSortOrderInput.value = item.sort_order ?? 0;
        roadmapIsActiveInput.checked = Number(item.is_active) === 1;
        updateActiveLabel(roadmapIsActiveInput, roadmapIsActiveLabel);
        roadmapSaveBtnText.textContent = 'Lưu thay đổi';

        currentRoadmapImage = item.image || null;
        if (item.image) {
            roadmapImagePreview.src = getMediaUrl(item.image);
            roadmapImagePreview.classList.remove('d-none');
            roadmapImagePlaceholder.classList.add('d-none');
        }
    } else {
        modalTitle.textContent = 'Thêm Roadmap';
    }

    const modal = bootstrap.Modal.getOrCreateInstance(roadmapModalEl);
    modal.show();

    setTimeout(() => roadmapNameInput.focus(), 100);
}

function handleRoadmapImageSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
        selectedRoadmapFile = null;
        return;
    }

    const check = isImageValid(file);
    if (!check.valid) {
        showToast(check.error, 'error');
        e.target.value = '';
        selectedRoadmapFile = null;
        return;
    }

    selectedRoadmapFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
        roadmapImagePreview.src = ev.target.result;
        roadmapImagePreview.classList.remove('d-none');
        roadmapImagePlaceholder.classList.add('d-none');
    };
    reader.readAsDataURL(file);
}

function getRoadmapPayload() {
    return {
        name: roadmapNameInput.value.trim(),
        description: roadmapDescriptionInput.value.trim() || null,
        image: selectedRoadmapFile ? null : (currentRoadmapImage || null),
        sort_order: Number(roadmapSortOrderInput.value) || 0,
        is_active: roadmapIsActiveInput.checked
    };
}

function validateRoadmapForm() {
    let valid = true;
    if (!roadmapNameInput.value.trim()) {
        roadmapNameInput.classList.add('is-invalid');
        valid = false;
    } else {
        roadmapNameInput.classList.remove('is-invalid');
    }
    return valid;
}

async function handleSaveRoadmap() {
    if (!validateRoadmapForm()) return;

    setSaveLoading(roadmapSaveBtn, roadmapSaveSpinner, roadmapSaveBtnText, true);
    hideFormError(roadmapFormError);

    try {
        const id = roadmapIdInput.value ? Number(roadmapIdInput.value) : null;
        const payload = getRoadmapPayload();

        let savedId = id;
        if (id) {
            await api.put(`/admin/roadmaps/${id}`, payload);
        } else {
            const res = await api.post('/admin/roadmaps', payload);
            savedId = res.data.id;
        }

        // Upload ảnh mới sau khi save (nếu người dùng chọn file)
        if (selectedRoadmapFile) {
            await uploadImageFile(`/admin/roadmaps/${savedId}/image`, selectedRoadmapFile);
        }

        const modal = bootstrap.Modal.getInstance(roadmapModalEl);
        if (modal) modal.hide();

        showToast(id ? 'Cập nhật Roadmap thành công.' : 'Tạo Roadmap thành công.', 'success');
        await loadRoadmaps();
        await loadTopics();
    } catch (error) {
        showFormError(roadmapFormError, error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        setSaveLoading(roadmapSaveBtn, roadmapSaveSpinner, roadmapSaveBtnText, false);
    }
}

// ============================================================
// TOPIC MODAL
// ============================================================

function resetTopicForm() {
    topicForm.reset();
    topicIdInput.value = '';
    topicNameInput.classList.remove('is-invalid');
    topicRoadmapIdInput.classList.remove('is-invalid');
    topicFormError.classList.add('d-none');
    topicFormError.textContent = '';
    topicIsActiveInput.checked = true;
    updateActiveLabel(topicIsActiveInput, topicIsActiveLabel);
    topicSortOrderInput.value = 0;
    selectedTopicFile = null;
    currentTopicImage = null;
    topicImageInput.value = '';
    topicImagePreview.classList.add('d-none');
    topicImagePreview.src = '';
    topicImagePlaceholder.classList.remove('d-none');
    topicSaveBtnText.textContent = 'Thêm mới';
}

function openTopicModal(item = null) {
    resetTopicForm();
    populateTopicRoadmapModalSelect();

    const modalTitle = document.getElementById('topicModalLabel');
    if (item) {
        modalTitle.textContent = 'Sửa Topic';
        topicIdInput.value = item.id;
        topicNameInput.value = item.name || '';
        topicDescriptionInput.value = item.description || '';
        topicSortOrderInput.value = item.sort_order ?? 0;
        topicIsActiveInput.checked = Number(item.is_active) === 1;
        updateActiveLabel(topicIsActiveInput, topicIsActiveLabel);
        topicRoadmapIdInput.value = item.roadmap_id || '';
        topicSaveBtnText.textContent = 'Lưu thay đổi';

        currentTopicImage = item.image || null;
        if (item.image) {
            topicImagePreview.src = getMediaUrl(item.image);
            topicImagePreview.classList.remove('d-none');
            topicImagePlaceholder.classList.add('d-none');
        }
    } else {
        modalTitle.textContent = 'Thêm Topic';
        // Preselect roadmap theo filter đang chọn (nếu có)
        if (topicsRoadmapFilter.value) {
            topicRoadmapIdInput.value = topicsRoadmapFilter.value;
        }
    }

    const modal = bootstrap.Modal.getOrCreateInstance(topicModalEl);
    modal.show();

    setTimeout(() => topicNameInput.focus(), 100);
}

function handleTopicImageSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
        selectedTopicFile = null;
        return;
    }

    const check = isImageValid(file);
    if (!check.valid) {
        showToast(check.error, 'error');
        e.target.value = '';
        selectedTopicFile = null;
        return;
    }

    selectedTopicFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
        topicImagePreview.src = ev.target.result;
        topicImagePreview.classList.remove('d-none');
        topicImagePlaceholder.classList.add('d-none');
    };
    reader.readAsDataURL(file);
}

function validateTopicForm() {
    let valid = true;

    if (!topicNameInput.value.trim()) {
        topicNameInput.classList.add('is-invalid');
        valid = false;
    } else {
        topicNameInput.classList.remove('is-invalid');
    }

    if (!topicRoadmapIdInput.value) {
        topicRoadmapIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        topicRoadmapIdInput.classList.remove('is-invalid');
    }

    return valid;
}

async function handleSaveTopic() {
    if (!validateTopicForm()) return;

    setSaveLoading(topicSaveBtn, topicSaveSpinner, topicSaveBtnText, true);
    hideFormError(topicFormError);

    try {
        const id = topicIdInput.value ? Number(topicIdInput.value) : null;
        const payload = {
            roadmap_id: Number(topicRoadmapIdInput.value),
            name: topicNameInput.value.trim(),
            description: topicDescriptionInput.value.trim() || null,
            image: selectedTopicFile ? null : (currentTopicImage || null),
            sort_order: Number(topicSortOrderInput.value) || 0,
            is_active: topicIsActiveInput.checked
        };

        let resultId = id;
        if (!id) {
            const res = await api.post('/admin/topics', payload);
            resultId = res.data.id;
        } else {
            await api.put(`/admin/topics/${id}`, payload);
            resultId = id;
        }

        // Upload ảnh mới sau khi lưu (nếu có chọn file)
        if (selectedTopicFile) {
            await uploadImageFile(`/admin/topics/${resultId}/image`, selectedTopicFile);
        }

        const modal = bootstrap.Modal.getInstance(topicModalEl);
        if (modal) modal.hide();

        showToast(id ? 'Cập nhật Topic thành công.' : 'Tạo Topic thành công.', 'success');
        await loadTopics();
    } catch (error) {
        showFormError(topicFormError, error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        setSaveLoading(topicSaveBtn, topicSaveSpinner, topicSaveBtnText, false);
    }
}

// ============================================================
// UPLOAD FILE HELPERS
// ============================================================

/**
 * Upload a single image file to backend endpoint.
 * Dùng raw fetch + FormData (multipart) vì api.post set Content-Type JSON.
 * @param {string} endpoint - vd. '/admin/roadmaps/1/image'
 * @param {File} file
 */
async function uploadImageFile(endpoint, file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error((data && data.message) || 'Upload ảnh thất bại');
        error.status = response.status;
        throw error;
    }

    return data;
}

// ============================================================
// DELETE CONFIRM MODAL
// ============================================================

function openConfirmDeleteModal(type, item) {
    pendingDelete = { type, id: Number(item.id), name: item.name || `#${item.id}` };

    if (type === 'roadmap') {
        confirmDeleteText.textContent =
            `Bạn có chắc chắn muốn xóa Roadmap "${item.name || ''}"? Roadmap có chứa Topic/Vocabulary liên quan thì sẽ không thể xóa.`;
    } else {
        confirmDeleteText.textContent =
            `Bạn có chắc chắn muốn xóa Topic "${item.name || ''}"?`;
    }

    const modal = bootstrap.Modal.getOrCreateInstance(confirmDeleteModalEl);
    modal.show();
}

async function handleConfirmDelete() {
    if (!pendingDelete) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteSpinner.classList.remove('d-none');

    try {
        const { type, id } = pendingDelete;
        if (type === 'roadmap') {
            await api.del(`/admin/roadmaps/${id}`);
            showToast('Xóa Roadmap thành công.', 'success');
            // Refresh cả Topics vì Topic có thể trỏ tới Roadmap đã bị xóa
            await Promise.all([loadRoadmaps(), loadTopics()]);
        } else {
            await api.del(`/admin/topics/${id}`);
            showToast('Xóa Topic thành công.', 'success');
            await loadTopics();
        }

        const modal = bootstrap.Modal.getInstance(confirmDeleteModalEl);
        if (modal) modal.hide();
        pendingDelete = null;
    } catch (error) {
        showToast(error.message || 'Xóa thất bại. Vui lòng thử lại.', 'error');
    } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteSpinner.classList.add('d-none');
    }
}

// ============================================================
// FORM UI HELPERS
// ============================================================

function setSaveLoading(btn, spinner, btnText, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    if (spinner) spinner.classList.toggle('d-none', !isLoading);
    if (btnText) {
        btnText.textContent = isLoading ? 'Đang xử lý...' : (btnText.dataset.default || btnText.textContent);
    }
}

function showFormError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('d-none');
}

function hideFormError(errorEl) {
    if (!errorEl) return;
    errorEl.classList.add('d-none');
    errorEl.textContent = '';
}

function updateActiveLabel(checkboxEl, labelEl) {
    if (!checkboxEl || !labelEl) return;
    labelEl.textContent = checkboxEl.checked ? 'Đang hoạt động' : 'Đã ẩn';
}

// ============================================================
// INITIALIZATION
// ============================================================

function bindEvents() {
    const btnAddRoadmap = document.getElementById('btnAddRoadmap');
    if (btnAddRoadmap) btnAddRoadmap.addEventListener('click', () => openRoadmapModal(null));

    const btnAddTopic = document.getElementById('btnAddTopic');
    if (btnAddTopic) btnAddTopic.addEventListener('click', () => openTopicModal(null));

    if (roadmapSaveBtn) roadmapSaveBtn.addEventListener('click', handleSaveRoadmap);
    if (topicSaveBtn) topicSaveBtn.addEventListener('click', handleSaveTopic);

    if (roadmapImageInput) roadmapImageInput.addEventListener('change', handleRoadmapImageSelect);
    if (topicImageInput) topicImageInput.addEventListener('change', handleTopicImageSelect);

    // Switch chỉ thay đổi label — KHÔNG gọi API ngay
    if (roadmapIsActiveInput) {
        roadmapIsActiveInput.addEventListener('change', () => updateActiveLabel(roadmapIsActiveInput, roadmapIsActiveLabel));
    }
    if (topicIsActiveInput) {
        topicIsActiveInput.addEventListener('change', () => updateActiveLabel(topicIsActiveInput, topicIsActiveLabel));
    }

    // Filter theo Roadmap (Topic)
    if (topicsRoadmapFilter) {
        topicsRoadmapFilter.addEventListener('change', () => loadTopics());
    }

    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

    // Xóa trạng thái invalid khi đang nhập
    if (roadmapNameInput) {
        roadmapNameInput.addEventListener('input', () => roadmapNameInput.classList.remove('is-invalid'));
    }
    if (topicNameInput) {
        topicNameInput.addEventListener('input', () => topicNameInput.classList.remove('is-invalid'));
    }
    if (topicRoadmapIdInput) {
        topicRoadmapIdInput.addEventListener('change', () => topicRoadmapIdInput.classList.remove('is-invalid'));
    }
}

async function initAdmin() {
    if (!guardAdminPage()) {
        return;
    }

    renderAdminInfo();

    bindNavigation();

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', handleLogout);

    // Khởi tạo DataTable
    setupRoadmapsTable();
    setupTopicsDatatable();

    bindEvents();

    try {
        await loadRoadmaps();
        await loadTopics();
    } catch (err) {
        showToast('Không thể tải dữ liệu trang quản trị.', 'error');
    }

    activateSection('roadmaps');
}

// ============================================================
// START
// ============================================================

if (!authService.isAuthenticated()) {
    window.location.replace('../auth/login.html');
} else {
    document.addEventListener('DOMContentLoaded', initAdmin);
}