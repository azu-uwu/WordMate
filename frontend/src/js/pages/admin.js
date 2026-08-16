/**
 * Admin Dashboard Page — WordMate
 * M8-T8 Roadmap & Topic CRUD + M8-T9 Custom Question Management.
 *
 * Responsibilities:
 * 1. Guard the page: only logged-in admin users can access.
 * 2. Render admin display name in the header.
 * 3. Switch between the 4 admin sections.
 * 4. Logout handler.
 * 5. Roadmap CRUD (DataTable + modal + upload image).
 * 6. Topic CRUD (DataTable + filter by roadmap + modal + upload image).
 * 7. Vocabulary CRUD (DataTable + filter by topic + modal + upload image/audio + CSV import).
 * 8. Custom Question CRUD (DataTable + cascade filters Roadmap → Topic → Vocabulary + modal with cascade selects).
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
const MAX_AUDIO_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_AUDIO_TYPES = ['audio/mpeg'];
const ALLOWED_AUDIO_EXT = ['mp3'];
const PART_OF_SPEECH = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'phrasal_verb', 'idiom', 'other'];

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

// Vocabulary form elements
const vocabularyModalEl = document.getElementById('vocabularyModal');
const vocabularyForm = document.getElementById('vocabularyForm');
const vocabularyIdInput = document.getElementById('vocabularyId');
const vocabRoadmapIdInput = document.getElementById('vocabRoadmapId');
const vocabTopicIdInput = document.getElementById('vocabTopicId');
const vocabWordInput = document.getElementById('vocabWord');
const vocabPronunciationInput = document.getElementById('vocabPronunciation');
const vocabPartOfSpeechInput = document.getElementById('vocabPartOfSpeech');
const vocabMeaningInput = document.getElementById('vocabMeaning');
const vocabExampleInput = document.getElementById('vocabExample');
const vocabExampleMeaningInput = document.getElementById('vocabExampleMeaning');
const vocabImageInput = document.getElementById('vocabImageInput');
const vocabImagePreview = document.getElementById('vocabImagePreview');
const vocabImagePlaceholder = document.getElementById('vocabImagePlaceholder');
const vocabAudioInput = document.getElementById('vocabAudioInput');
const vocabAudioName = document.getElementById('vocabAudioName');
const vocabularyFormError = document.getElementById('vocabularyFormError');
const vocabularySaveBtn = document.getElementById('vocabularySaveBtn');
const vocabularySaveSpinner = document.getElementById('vocabularySaveSpinner');
const vocabularySaveBtnText = document.getElementById('vocabularySaveBtnText');

// Vocabulary filter
const vocabTopicFilter = document.getElementById('vocabTopicFilter');

// Import Vocabulary form elements
const importVocabularyModalEl = document.getElementById('importVocabularyModal');
const importVocabularyForm = document.getElementById('importVocabularyForm');
const importRoadmapIdInput = document.getElementById('importRoadmapId');
const importTopicIdInput = document.getElementById('importTopicId');
const importCsvFileInput = document.getElementById('importCsvFile');
const importFormError = document.getElementById('importFormError');
const importFormSuccess = document.getElementById('importFormSuccess');
const importErrorsWrap = document.getElementById('importErrorsWrap');
const importErrorsBody = document.getElementById('importErrorsBody');
const importVocabularyBtn = document.getElementById('importVocabularyBtn');
const importVocabularySpinner = document.getElementById('importVocabularySpinner');

// Custom Question form elements
const customQuestionModalEl = document.getElementById('customQuestionModal');
const customQuestionForm = document.getElementById('customQuestionForm');
const customQuestionIdInput = document.getElementById('customQuestionId');
const cqRoadmapIdInput = document.getElementById('cqRoadmapId');
const cqTopicIdInput = document.getElementById('cqTopicId');
const cqVocabularyIdInput = document.getElementById('cqVocabularyId');
const cqQuestionInput = document.getElementById('cqQuestion');
const cqOptionAInput = document.getElementById('cqOptionA');
const cqOptionBInput = document.getElementById('cqOptionB');
const cqOptionCInput = document.getElementById('cqOptionC');
const cqOptionDInput = document.getElementById('cqOptionD');
const cqCorrectOptionInput = document.getElementById('cqCorrectOption');
const cqIsActiveInput = document.getElementById('cqIsActive');
const cqIsActiveLabel = document.getElementById('cqIsActiveLabel');
const customQuestionFormError = document.getElementById('customQuestionFormError');
const customQuestionSaveBtn = document.getElementById('customQuestionSaveBtn');
const customQuestionSaveSpinner = document.getElementById('customQuestionSaveSpinner');
const customQuestionSaveBtnText = document.getElementById('customQuestionSaveBtnText');

// Custom Question filters (cascade: Roadmap → Topic → Vocabulary)
const customQuestionsRoadmapFilter = document.getElementById('customQuestionsRoadmapFilter');
const customQuestionsTopicFilter = document.getElementById('customQuestionsTopicFilter');
const customQuestionsVocabularyFilter = document.getElementById('customQuestionsVocabularyFilter');

// ============================================================
// STATE
// ============================================================

let roadmaps = [];                // danh sách Roadmap mới nhất từ server
let roadmapsDataTable = null;
let topicsDataTable = null;
let topicsDTData = [];             // data Topics hiện tại trong bảng
let vocabulariesDataTable = null;  // DataTable Vocabulary
let vocabulariesDTData = [];       // data Vocabularies hiện tại trong bảng
let topicsCache = [];              // cache tất cả Topics (để lọc theo roadmap)
let selectedRoadmapFile = null;    // file mới chọn cho Roadmap
let selectedTopicFile = null;      // file mới chọn cho Topic
let currentRoadmapImage = null;    // image path hiện tại khi mở form sửa Roadmap
let currentTopicImage = null;      // image path hiện tại khi mở form sửa Topic
let selectedVocabImageFile = null; // file ảnh mới chọn cho Vocabulary
let selectedVocabAudioFile = null; // file audio mới chọn cho Vocabulary
let currentVocabImage = null;      // image path hiện tại khi mở form sửa Vocabulary
let currentVocabAudio = null;      // audio path hiện tại khi mở form sửa Vocabulary
let customQuestionsDataTable = null; // DataTable Custom Question
let customQuestionsDTData = [];     // data Custom Questions hiện tại trong bảng
let vocabulariesCache = [];         // cache tất cả Vocabularies (để hiển thị word + populate select)
let pendingDelete = null;           // { type: 'roadmap'|'topic'|'vocabulary'|'custom_question', id, name }

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

function isAudioValid(file) {
    if (!file) return { valid: false, error: 'Chưa chọn file.' };

    if (file.size > MAX_AUDIO_SIZE) {
        return { valid: false, error: 'File audio vượt quá 2MB.' };
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !ALLOWED_AUDIO_EXT.includes(ext)) {
        return { valid: false, error: 'Chỉ chấp nhận file audio MP3.' };
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
                // STT được đánh lại trong sự kiện 'draw' bên dưới, không dùng meta.row.
                render: () => ''
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

    // Đánh lại STT từ 1 theo đúng thứ tự dòng đang hiển thị trên từng trang.
    // 'draw' kích hoạt sau mỗi lần load dữ liệu, sort, filter, chuyển trang, redraw.
    roadmapsDataTable.on('draw', () => {
        const pageInfo = roadmapsDataTable.page.info();
        $('#roadmapsTable tbody tr').each(function (index) {
            $(this).find('td.admin-col-index').html(`<span class="text-muted">${pageInfo.start + index + 1}</span>`);
        });
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
                // STT được đánh lại trong sự kiện 'draw' bên dưới, không dùng meta.row.
                render: () => ''
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

    // Đánh lại STT từ 1 theo đúng thứ tự dòng đang hiển thị trên từng trang.
    // 'draw' kích hoạt sau mỗi lần load dữ liệu, sort, filter, chuyển trang, redraw.
    topicsDataTable.on('draw', () => {
        const pageInfo = topicsDataTable.page.info();
        $('#topicsTable tbody tr').each(function (index) {
            $(this).find('td.admin-col-index').html(`<span class="text-muted">${pageInfo.start + index + 1}</span>`);
        });
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

function setupVocabulariesTable() {
    vocabulariesDataTable = $('#vocabulariesTable').DataTable({
        data: [],
        columns: [
            {
                data: null,
                className: 'admin-col-index',
                // STT được đánh lại trong sự kiện 'draw' bên dưới, không dùng meta.row.
                render: () => ''
            },
            { data: 'word', render: (data) => `<strong>${esc(data || '')}</strong>` },
            {
                data: 'pronunciation',
                render: (data) => {
                    if (!data) return '<span class="text-muted">—</span>';
                    return `<span class="text-muted">${esc(data)}</span>`;
                }
            },
            {
                data: 'part_of_speech',
                render: (data) => {
                    const label = data || 'other';
                    return `<span class="badge bg-secondary-subtle text-light">${esc(label)}</span>`;
                }
            },
            {
                data: 'meaning',
                render: (data) => {
                    if (!data) return '<span class="text-muted">—</span>';
                    return `<span title="${esc(data)}">${esc(truncateText(data))}</span>`;
                }
            },
            {
                data: null,
                render: (row) => {
                    const topic = topicsCache.find((t) => Number(t.id) === Number(row.topic_id));
                    return topic ? esc(topic.name) : '<span class="text-muted">—</span>';
                }
            },
            {
                data: 'image',
                orderable: false,
                render: (data, type) => {
                    if (type !== 'display') return data || '';
                    if (!data) {
                        return '<div class="admin-thumb admin-thumb-empty"><i class="fa-solid fa-image"></i></div>';
                    }
                    const url = getMediaUrl(data);
                    return `<div class="admin-thumb"><img src="${url}" alt="Ảnh từ vựng" loading="lazy"></div>`;
                }
            },
            {
                data: 'audio',
                orderable: false,
                render: (data, type) => {
                    if (type !== 'display') return data || '';
                    if (!data) {
                        return '<span class="text-muted">—</span>';
                    }
                    const url = getMediaUrl(data);
                    return `<button type="button" class="btn btn-sm btn-outline-secondary admin-audio-play"
                                    data-src="${url}" title="Phát audio">
                                <i class="fa-solid fa-play"></i>
                            </button>`;
                }
            },
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
            { targets: [0, 6, 7, 8], orderable: false }
        ],
        order: [[1, 'asc']],
        initComplete: function () {
            $('#vocabulariesTable_filter input').addClass('form-control form-control-sm');
            $('#vocabulariesTable_filter label').addClass('admin-datatable-search');
        }
    });

    // Đánh lại STT từ 1 theo đúng thứ tự dòng đang hiển thị trên từng trang.
    // 'draw' kích hoạt sau mỗi lần load dữ liệu, sort, filter, chuyển trang, redraw.
    vocabulariesDataTable.on('draw', () => {
        const pageInfo = vocabulariesDataTable.page.info();
        $('#vocabulariesTable tbody tr').each(function (index) {
            $(this).find('td.admin-col-index').html(`<span class="text-muted">${pageInfo.start + index + 1}</span>`);
        });
    });

    $('#vocabulariesTable tbody').on('click', '.admin-action-btn', (e) => {
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);
        const item = vocabulariesDTData.find((v) => Number(v.id) === id);
        if (!item) return;
        if (action === 'edit') {
            openVocabularyModal(item);
        } else if (action === 'delete') {
            openConfirmDeleteModal('vocabulary', item);
        }
    });

    // Phát audio trong bảng
    $('#vocabulariesTable tbody').on('click', '.admin-audio-play', (e) => {
        const btn = e.currentTarget;
        const src = btn.dataset.src;
        if (!src) return;
        const audio = new Audio(src);
        audio.play().catch(() => showToast('Không thể phát audio.', 'error'));
    });
}

function setupCustomQuestionsTable() {
    customQuestionsDataTable = $('#customQuestionsTable').DataTable({
        data: [],
        columns: [
            {
                data: null,
                className: 'admin-col-index',
                // STT được đánh lại trong sự kiện 'draw' bên dưới, không dùng meta.row.
                render: () => ''
            },
            {
                data: 'question',
                render: (data) => {
                    if (!data) return '<span class="text-muted">—</span>';
                    return `<span title="${esc(data)}">${esc(truncateText(data))}</span>`;
                }
            },
            {
                data: null,
                render: (row) => {
                    const vocab = vocabulariesCache.find((v) => Number(v.id) === Number(row.vocabulary_id));
                    return vocab ? `<strong>${esc(vocab.word)}</strong>` : '<span class="text-muted">—</span>';
                }
            },
            {
                data: 'correct_option',
                render: (data) => {
                    const opt = String(data || '').toUpperCase();
                    return `<span class="badge bg-primary-subtle text-light">${esc(opt)}</span>`;
                }
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
            { targets: [0, 5], orderable: false }
        ],
        order: [[1, 'asc']],
        initComplete: function () {
            $('#customQuestionsTable_filter input').addClass('form-control form-control-sm');
            $('#customQuestionsTable_filter label').addClass('admin-datatable-search');
        }
    });

    // Đánh lại STT từ 1 theo đúng thứ tự dòng đang hiển thị trên từng trang.
    // 'draw' được gọi sau khi load dữ liệu, sort, filter, chuyển trang, redraw.
    customQuestionsDataTable.on('draw', () => {
        const pageInfo = customQuestionsDataTable.page.info();
        $('#customQuestionsTable tbody tr').each(function (index) {
            $(this).find('td.admin-col-index').html(`<span class="text-muted">${pageInfo.start + index + 1}</span>`);
        });
    });

    $('#customQuestionsTable tbody').on('click', '.admin-action-btn', (e) => {
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);
        const item = customQuestionsDTData.find((q) => Number(q.id) === id);
        if (!item) return;
        if (action === 'edit') {
            openCustomQuestionModal(item);
        } else if (action === 'delete') {
            openConfirmDeleteModal('custom_question', item);
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
        populateVocabRoadmapSelect();
        populateImportRoadmapSelect();
        populateCustomQuestionsRoadmapFilter();
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
// VOCABULARY — load + filters
// ============================================================

async function loadAllTopicsForCache() {
    try {
        const res = await api.get('/admin/topics');
        topicsCache = Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        topicsCache = [];
    }
}

async function loadVocabularies() {
    const loadingEl = document.getElementById('vocabulariesTableLoading');
    if (loadingEl) loadingEl.classList.remove('d-none');

    const topicId = vocabTopicFilter.value;
    const query = topicId ? `?topic_id=${encodeURIComponent(topicId)}` : '';
    try {
        const res = await api.get(`/admin/vocabularies${query}`);
        vocabulariesDTData = Array.isArray(res.data) ? res.data : [];

        vocabulariesDataTable.clear();
        vocabulariesDataTable.rows.add(vocabulariesDTData);
        vocabulariesDataTable.draw();
    } catch (error) {
        showToast(error.message || 'Không tải được danh sách Từ vựng.', 'error');
    } finally {
        if (loadingEl) loadingEl.classList.add('d-none');
    }
}

function populateVocabTopicFilter() {
    if (!vocabTopicFilter) return;

    const current = vocabTopicFilter.value;
    vocabTopicFilter.innerHTML = '<option value="">Tất cả Topic</option>';
    topicsCache.forEach((topic) => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.name;
        vocabTopicFilter.appendChild(option);
    });
    vocabTopicFilter.value = current;

    // Nếu topic đã bị xóa → reset filter về tất cả
    if (current && !topicsCache.some((t) => String(t.id) === current)) {
        vocabTopicFilter.value = '';
        loadVocabularies();
    }
}

function populateVocabRoadmapSelect() {
    if (!vocabRoadmapIdInput) return;

    const current = vocabRoadmapIdInput.value;
    vocabRoadmapIdInput.innerHTML = '<option value="">-- Chọn Roadmap --</option>';
    roadmaps.forEach((roadmap) => {
        const option = document.createElement('option');
        option.value = roadmap.id;
        option.textContent = roadmap.name;
        vocabRoadmapIdInput.appendChild(option);
    });
    vocabRoadmapIdInput.value = current;
}

function populateVocabTopicSelect() {
    if (!vocabTopicIdInput) return;

    const roadmapId = vocabRoadmapIdInput.value;
    const current = vocabTopicIdInput.value;
    vocabTopicIdInput.innerHTML = '<option value="">-- Chọn Topic --</option>';

    const filtered = roadmapId
        ? topicsCache.filter((t) => String(t.roadmap_id) === String(roadmapId))
        : topicsCache;

    filtered.forEach((topic) => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.name;
        vocabTopicIdInput.appendChild(option);
    });
    vocabTopicIdInput.value = current;
}

function populateImportRoadmapSelect() {
    if (!importRoadmapIdInput) return;

    const current = importRoadmapIdInput.value;
    importRoadmapIdInput.innerHTML = '<option value="">-- Chọn Roadmap --</option>';
    roadmaps.forEach((roadmap) => {
        const option = document.createElement('option');
        option.value = roadmap.id;
        option.textContent = roadmap.name;
        importRoadmapIdInput.appendChild(option);
    });
    importRoadmapIdInput.value = current;
}

function populateImportTopicSelect() {
    if (!importTopicIdInput) return;

    const roadmapId = importRoadmapIdInput.value;
    const current = importTopicIdInput.value;
    importTopicIdInput.innerHTML = '<option value="">-- Chọn Topic --</option>';

    const filtered = roadmapId
        ? topicsCache.filter((t) => String(t.roadmap_id) === String(roadmapId))
        : topicsCache;

    filtered.forEach((topic) => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.name;
        importTopicIdInput.appendChild(option);
    });
    importTopicIdInput.value = current;
}

// ============================================================
// CUSTOM QUESTION — load + filters
// ============================================================

async function loadAllVocabulariesForCache() {
    try {
        const res = await api.get('/admin/vocabularies');
        vocabulariesCache = Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        vocabulariesCache = [];
    }
}

async function loadCustomQuestions() {
    const loadingEl = document.getElementById('customQuestionsTableLoading');
    if (loadingEl) loadingEl.classList.remove('d-none');

    try {
        // Lấy toàn bộ Custom Questions rồi lọc client-side theo cascade Roadmap → Topic → Vocabulary
        const res = await api.get('/admin/custom-questions');
        const allQuestions = Array.isArray(res.data) ? res.data : [];
        customQuestionsDTData = filterCustomQuestions(allQuestions);

        customQuestionsDataTable.clear();
        customQuestionsDataTable.rows.add(customQuestionsDTData);
        customQuestionsDataTable.draw();
    } catch (error) {
        showToast(error.message || 'Không tải được danh sách Câu hỏi tùy chỉnh.', 'error');
    } finally {
        if (loadingEl) loadingEl.classList.add('d-none');
    }
}

/**
 * Lọc Custom Questions theo bộ lọc cascade Roadmap → Topic → Vocabulary.
 * Không chọn filter nào → hiển thị tất cả.
 */
function filterCustomQuestions(questions) {
    const roadmapId = customQuestionsRoadmapFilter.value;
    const topicId = customQuestionsTopicFilter.value;
    const vocabularyId = customQuestionsVocabularyFilter.value;

    return questions.filter((q) => {
        const vocab = vocabulariesCache.find((v) => Number(v.id) === Number(q.vocabulary_id));
        if (!vocab) return false;

        const topic = topicsCache.find((t) => Number(t.id) === Number(vocab.topic_id));

        const roadmapMatch = !roadmapId || (topic && String(topic.roadmap_id) === String(roadmapId));
        const topicMatch = !topicId || String(vocab.topic_id) === String(topicId);
        const vocabMatch = !vocabularyId || String(q.vocabulary_id) === String(vocabularyId);

        return roadmapMatch && topicMatch && vocabMatch;
    });
}

function populateCustomQuestionsRoadmapFilter() {
    if (!customQuestionsRoadmapFilter) return;

    const current = customQuestionsRoadmapFilter.value;
    customQuestionsRoadmapFilter.innerHTML = '<option value="">Tất cả Roadmaps</option>';
    roadmaps.forEach((roadmap) => {
        const option = document.createElement('option');
        option.value = roadmap.id;
        option.textContent = roadmap.name;
        customQuestionsRoadmapFilter.appendChild(option);
    });
    customQuestionsRoadmapFilter.value = current;

    // Nếu roadmap đã bị xóa → reset filter về tất cả
    if (current && !roadmaps.some((r) => String(r.id) === current)) {
        customQuestionsRoadmapFilter.value = '';
        populateCustomQuestionsTopicFilter();
        populateCustomQuestionsVocabularyFilter();
        loadCustomQuestions();
    }
}

function populateCustomQuestionsTopicFilter() {
    if (!customQuestionsTopicFilter) return;

    const roadmapId = customQuestionsRoadmapFilter.value;
    const current = customQuestionsTopicFilter.value;
    customQuestionsTopicFilter.innerHTML = '<option value="">Tất cả Topics</option>';

    const filtered = roadmapId
        ? topicsCache.filter((t) => String(t.roadmap_id) === String(roadmapId))
        : topicsCache;

    filtered.forEach((topic) => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.name;
        customQuestionsTopicFilter.appendChild(option);
    });
    customQuestionsTopicFilter.value = current;

    // Nếu topic đã bị xóa → reset filter về tất cả
    if (current && !filtered.some((t) => String(t.id) === current)) {
        customQuestionsTopicFilter.value = '';
        populateCustomQuestionsVocabularyFilter();
        loadCustomQuestions();
    }
}

function populateCustomQuestionsVocabularyFilter() {
    if (!customQuestionsVocabularyFilter) return;

    const roadmapId = customQuestionsRoadmapFilter.value;
    const topicId = customQuestionsTopicFilter.value;
    const current = customQuestionsVocabularyFilter.value;
    customQuestionsVocabularyFilter.innerHTML = '<option value="">Tất cả từ vựng</option>';

    const filtered = vocabulariesCache.filter((v) => {
        const topic = topicsCache.find((t) => Number(t.id) === Number(v.topic_id));
        const roadmapMatch = !roadmapId || (topic && String(topic.roadmap_id) === String(roadmapId));
        const topicMatch = !topicId || String(v.topic_id) === String(topicId);
        return roadmapMatch && topicMatch;
    });

    filtered.forEach((vocab) => {
        const option = document.createElement('option');
        option.value = vocab.id;
        option.textContent = vocab.word;
        customQuestionsVocabularyFilter.appendChild(option);
    });
    customQuestionsVocabularyFilter.value = current;

    // Nếu vocabulary đã bị xóa → reset filter về tất cả
    if (current && !filtered.some((v) => String(v.id) === current)) {
        customQuestionsVocabularyFilter.value = '';
        loadCustomQuestions();
    }
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

/**
 * Upload một file (image hoặc audio) qua multipart form-data.
 * @param {string} endpoint - vd. '/admin/vocabularies/1/image'
 * @param {string} field - Tên field: 'image' hoặc 'audio'
 * @param {File} file
 */
async function uploadFilePart(endpoint, field, file) {
    const formData = new FormData();
    formData.append(field, file);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error((data && data.message) || 'Upload file thất bại');
        error.status = response.status;
        throw error;
    }

    return data;
}

// ============================================================
// VOCABULARY MODAL
// ============================================================

function resetVocabularyModal() {
    vocabularyForm.reset();
    vocabularyIdInput.value = '';
    vocabRoadmapIdInput.classList.remove('is-invalid');
    vocabTopicIdInput.classList.remove('is-invalid');
    vocabWordInput.classList.remove('is-invalid');
    vocabMeaningInput.classList.remove('is-invalid');
    vocabularyFormError.classList.add('d-none');
    vocabularyFormError.textContent = '';
    selectedVocabImageFile = null;
    selectedVocabAudioFile = null;
    currentVocabImage = null;
    currentVocabAudio = null;
    vocabImageInput.value = '';
    vocabAudioInput.value = '';
    vocabImagePreview.classList.add('d-none');
    vocabImagePreview.src = '';
    vocabImagePlaceholder.classList.remove('d-none');
    vocabAudioName.textContent = 'Chưa có audio';
    vocabAudioName.classList.add('text-muted');
    vocabAudioName.classList.remove('admin-audio-has');
    vocabularySaveBtnText.textContent = 'Thêm mới';
}

function openVocabularyModal(item = null) {
    resetVocabularyModal();
    populateVocabRoadmapSelect();
    populateVocabTopicSelect();

    const modalTitle = document.getElementById('vocabularyModalLabel');
    if (item) {
        modalTitle.textContent = 'Sửa từ vựng';
        vocabularyIdInput.value = item.id;
        vocabWordInput.value = item.word || '';
        vocabPronunciationInput.value = item.pronunciation || '';
        vocabPartOfSpeechInput.value = item.part_of_speech || 'other';
        vocabMeaningInput.value = item.meaning || '';
        vocabExampleInput.value = item.example || '';
        vocabExampleMeaningInput.value = item.example_meaning || '';
        vocabularySaveBtnText.textContent = 'Lưu thay đổi';

        // Preselect roadmap/topic
        const topic = topicsCache.find((t) => Number(t.id) === Number(item.topic_id));
        if (topic) {
            vocabRoadmapIdInput.value = topic.roadmap_id || '';
            populateVocabTopicSelect();
            vocabTopicIdInput.value = item.topic_id || '';
        } else {
            vocabTopicIdInput.value = item.topic_id || '';
        }

        currentVocabImage = item.image || null;
        if (item.image) {
            vocabImagePreview.src = getMediaUrl(item.image);
            vocabImagePreview.classList.remove('d-none');
            vocabImagePlaceholder.classList.add('d-none');
        }

        currentVocabAudio = item.audio || null;
        if (item.audio) {
            const audioUrl = getMediaUrl(item.audio);
            vocabAudioName.textContent = audioUrl.split('/').pop() || 'Đã có audio';
            vocabAudioName.classList.remove('text-muted');
            vocabAudioName.classList.add('admin-audio-has');
        }
    } else {
        modalTitle.textContent = 'Thêm từ vựng';
        vocabPartOfSpeechInput.value = 'noun';

        // Preselect roadmap/topic theo filter đang chọn (nếu có)
        if (vocabTopicFilter.value) {
            const topic = topicsCache.find((t) => String(t.id) === vocabTopicFilter.value);
            if (topic) {
                vocabRoadmapIdInput.value = topic.roadmap_id || '';
                populateVocabTopicSelect();
                vocabTopicIdInput.value = topic.id || '';
            }
        }
    }

    const modal = bootstrap.Modal.getOrCreateInstance(vocabularyModalEl);
    modal.show();

    setTimeout(() => vocabWordInput.focus(), 100);
}

function handleVocabImageSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
        selectedVocabImageFile = null;
        return;
    }

    const check = isImageValid(file);
    if (!check.valid) {
        showToast(check.error, 'error');
        e.target.value = '';
        selectedVocabImageFile = null;
        return;
    }

    selectedVocabImageFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
        vocabImagePreview.src = ev.target.result;
        vocabImagePreview.classList.remove('d-none');
        vocabImagePlaceholder.classList.add('d-none');
    };
    reader.readAsDataURL(file);
}

function handleVocabAudioSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
        selectedVocabAudioFile = null;
        return;
    }

    const check = isAudioValid(file);
    if (!check.valid) {
        showToast(check.error, 'error');
        e.target.value = '';
        selectedVocabAudioFile = null;
        return;
    }

    selectedVocabAudioFile = file;
    vocabAudioName.textContent = file.name;
    vocabAudioName.classList.remove('text-muted');
    vocabAudioName.classList.add('admin-audio-has');
}

function getVocabularyPayload() {
    return {
        topic_id: Number(vocabTopicIdInput.value),
        word: vocabWordInput.value.trim(),
        pronunciation: vocabPronunciationInput.value.trim() || null,
        part_of_speech: vocabPartOfSpeechInput.value || 'other',
        meaning: vocabMeaningInput.value.trim(),
        example: vocabExampleInput.value.trim() || null,
        example_meaning: vocabExampleMeaningInput.value.trim() || null,
        audio: selectedVocabAudioFile ? null : (currentVocabAudio || null),
        image: selectedVocabImageFile ? null : (currentVocabImage || null)
    };
}

function validateVocabularyForm() {
    let valid = true;

    if (!vocabWordInput.value.trim()) {
        vocabWordInput.classList.add('is-invalid');
        valid = false;
    } else {
        vocabWordInput.classList.remove('is-invalid');
    }

    if (!vocabMeaningInput.value.trim()) {
        vocabMeaningInput.classList.add('is-invalid');
        valid = false;
    } else {
        vocabMeaningInput.classList.remove('is-invalid');
    }

    if (!vocabTopicIdInput.value) {
        vocabTopicIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        vocabTopicIdInput.classList.remove('is-invalid');
    }

    return valid;
}

async function handleSaveVocabulary() {
    if (!validateVocabularyForm()) return;

    setSaveLoading(vocabularySaveBtn, vocabularySaveSpinner, vocabularySaveBtnText, true);
    hideFormError(vocabularyFormError);

    try {
        const id = vocabularyIdInput.value ? Number(vocabularyIdInput.value) : null;
        const payload = getVocabularyPayload();

        let resultId = id;
        if (!id) {
            const res = await api.post('/admin/vocabularies', payload);
            resultId = res.data.id;
        } else {
            await api.put(`/admin/vocabularies/${id}`, payload);
            resultId = id;
        }

        // Upload ảnh/audio riêng sau khi lưu (nếu có chọn file mới)
        if (selectedVocabImageFile) {
            await uploadFilePart(`/admin/vocabularies/${resultId}/image`, 'image', selectedVocabImageFile);
        }
        if (selectedVocabAudioFile) {
            await uploadFilePart(`/admin/vocabularies/${resultId}/audio`, 'audio', selectedVocabAudioFile);
        }

        const modal = bootstrap.Modal.getInstance(vocabularyModalEl);
        if (modal) modal.hide();

        showToast(id ? 'Cập nhật Từ vựng thành công.' : 'Tạo Từ vựng thành công.', 'success');
        await loadVocabularies();
    } catch (error) {
        showFormError(vocabularyFormError, error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        setSaveLoading(vocabularySaveBtn, vocabularySaveSpinner, vocabularySaveBtnText, false);
    }
}

// ============================================================
// IMPORT VOCABULARY MODAL
// ============================================================

function resetImportModal() {
    importVocabularyForm.reset();
    importRoadmapIdInput.classList.remove('is-invalid');
    importTopicIdInput.classList.remove('is-invalid');
    importCsvFileInput.classList.remove('is-invalid');
    importFormError.classList.add('d-none');
    importFormError.textContent = '';
    importFormSuccess.classList.add('d-none');
    importFormSuccess.textContent = '';
    importErrorsWrap.classList.add('d-none');
    importErrorsBody.innerHTML = '';
}

function openImportVocabularyModal() {
    resetImportModal();
    populateImportRoadmapSelect();
    populateImportTopicSelect();

    const modal = bootstrap.Modal.getOrCreateInstance(importVocabularyModalEl);
    modal.show();
}

function validateImportForm() {
    let valid = true;

    if (!importRoadmapIdInput.value) {
        importRoadmapIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        importRoadmapIdInput.classList.remove('is-invalid');
    }

    if (!importTopicIdInput.value) {
        importTopicIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        importTopicIdInput.classList.remove('is-invalid');
    }

    if (!importCsvFileInput.files || !importCsvFileInput.files[0]) {
        importCsvFileInput.classList.add('is-invalid');
        valid = false;
    } else {
        importCsvFileInput.classList.remove('is-invalid');
    }

    return valid;
}

function renderImportErrors(errors) {
    importErrorsBody.innerHTML = '';
    if (!Array.isArray(errors) || errors.length === 0) {
        importErrorsWrap.classList.add('d-none');
        return;
    }

    errors.forEach((err) => {
        const row = document.createElement('tr');
        const lineTd = document.createElement('td');
        const msgTd = document.createElement('td');

        lineTd.textContent = err.line ?? '?';
        msgTd.textContent = Array.isArray(err.errors) ? err.errors.join(', ') : String(err.errors || '');

        row.appendChild(lineTd);
        row.appendChild(msgTd);
        importErrorsBody.appendChild(row);
    });

    importErrorsWrap.classList.remove('d-none');
}

async function handleImportVocabulary() {
    if (!validateImportForm()) return;

    importVocabularyBtn.disabled = true;
    importVocabularySpinner.classList.remove('d-none');
    importFormError.classList.add('d-none');
    importFormError.textContent = '';
    importFormSuccess.classList.add('d-none');
    importFormSuccess.textContent = '';
    importErrorsWrap.classList.add('d-none');
    importErrorsBody.innerHTML = '';

    try {
        const formData = new FormData();
        formData.append('topic_id', importTopicIdInput.value);
        formData.append('file', importCsvFileInput.files[0]);

        const response = await fetch(`${API_BASE_URL}/admin/vocabularies/import`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const error = new Error((data && data.message) || 'Import thất bại');
            error.status = response.status;
            throw error;
        }

        const importedCount = data && data.data ? (data.data.imported ?? 0) : 0;
        const errors = data && data.data ? (data.data.errors || []) : [];

        importFormSuccess.textContent = `Import thành công ${importedCount} từ vựng.`;
        importFormSuccess.classList.remove('d-none');

        if (errors.length > 0) {
            renderImportErrors(errors);
        } else {
            importErrorsWrap.classList.add('d-none');
        }

        showToast(`Import hoàn tất: ${importedCount} từ.`, 'success');
        await loadVocabularies();
    } catch (error) {
        showFormError(importFormError, error.message || 'Import thất bại. Vui lòng thử lại.');
    } finally {
        importVocabularyBtn.disabled = false;
        importVocabularySpinner.classList.add('d-none');
    }
}

// ============================================================
// CUSTOM QUESTION MODAL
// ============================================================

function resetCustomQuestionForm() {
    customQuestionForm.reset();
    customQuestionIdInput.value = '';
    cqRoadmapIdInput.classList.remove('is-invalid');
    cqTopicIdInput.classList.remove('is-invalid');
    cqVocabularyIdInput.classList.remove('is-invalid');
    cqVocabularyIdInput.disabled = true;
    cqQuestionInput.classList.remove('is-invalid');
    cqOptionAInput.classList.remove('is-invalid');
    cqOptionBInput.classList.remove('is-invalid');
    cqOptionCInput.classList.remove('is-invalid');
    cqOptionDInput.classList.remove('is-invalid');
    cqCorrectOptionInput.classList.remove('is-invalid');
    customQuestionFormError.classList.add('d-none');
    customQuestionFormError.textContent = '';
    cqIsActiveInput.checked = true;
    updateActiveLabel(cqIsActiveInput, cqIsActiveLabel);
    customQuestionSaveBtnText.textContent = 'Thêm mới';
    customQuestionSaveBtnText.dataset.default = 'Thêm mới';
}

function filterCqVocabularyOptions() {
    if (!cqVocabularyIdInput) return;

    const selected = cqVocabularyIdInput.value;
    cqVocabularyIdInput.innerHTML = '<option value="">-- Chọn Từ Vựng --</option>';

    // Chưa chọn Topic → disabled, chỉ hiển thị option mặc định
    if (!cqTopicIdInput.value) {
        cqVocabularyIdInput.disabled = true;
        cqVocabularyIdInput.value = '';
        return;
    }

    // Đã chọn Topic → enabled, chỉ hiển thị Vocabulary thuộc Topic đó
    cqVocabularyIdInput.disabled = false;

    const filtered = vocabulariesCache.filter((v) => {
        const topic = topicsCache.find((t) => Number(t.id) === Number(v.topic_id));
        const roadmapMatch = !cqRoadmapIdInput.value || (topic && String(topic.roadmap_id) === String(cqRoadmapIdInput.value));
        const topicMatch = !cqTopicIdInput.value || (topic && String(topic.id) === String(cqTopicIdInput.value));
        return roadmapMatch && topicMatch;
    });

    filtered.forEach((vocab) => {
        const option = document.createElement('option');
        option.value = vocab.id;
        option.textContent = vocab.word;
        cqVocabularyIdInput.appendChild(option);
    });

    // Giữ lựa chọn trước đó nếu vẫn còn trong danh sách
    if (selected && filtered.some((v) => String(v.id) === String(selected))) {
        cqVocabularyIdInput.value = selected;
    }
}

function populateCqRoadmapSelect() {
    if (!cqRoadmapIdInput) return;

    const current = cqRoadmapIdInput.value;
    cqRoadmapIdInput.innerHTML = '<option value="">-- Chọn Roadmap --</option>';
    roadmaps.forEach((roadmap) => {
        const option = document.createElement('option');
        option.value = roadmap.id;
        option.textContent = roadmap.name;
        cqRoadmapIdInput.appendChild(option);
    });
    cqRoadmapIdInput.value = current;
}

function populateCqTopicSelect() {
    if (!cqTopicIdInput) return;

    const roadmapId = cqRoadmapIdInput.value;
    const current = cqTopicIdInput.value;
    cqTopicIdInput.innerHTML = '<option value="">-- Chọn Topic --</option>';

    const filtered = roadmapId
        ? topicsCache.filter((t) => String(t.roadmap_id) === String(roadmapId))
        : topicsCache;

    filtered.forEach((topic) => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.name;
        cqTopicIdInput.appendChild(option);
    });
    cqTopicIdInput.value = current;
}

function openCustomQuestionModal(item = null) {
    resetCustomQuestionForm();
    populateCqRoadmapSelect();
    populateCqTopicSelect();
    filterCqVocabularyOptions();

    const modalTitle = document.getElementById('customQuestionModalLabel');
    if (item) {
        modalTitle.textContent = 'Sửa câu hỏi tùy chỉnh';
        customQuestionIdInput.value = item.id;
        cqQuestionInput.value = item.question || '';
        cqOptionAInput.value = item.option_a || '';
        cqOptionBInput.value = item.option_b || '';
        cqOptionCInput.value = item.option_c || '';
        cqOptionDInput.value = item.option_d || '';
        cqCorrectOptionInput.value = String(item.correct_option || '').toUpperCase();
        cqIsActiveInput.checked = Number(item.is_active) === 1;
        updateActiveLabel(cqIsActiveInput, cqIsActiveLabel);
        customQuestionSaveBtnText.textContent = 'Lưu thay đổi';
        customQuestionSaveBtnText.dataset.default = 'Lưu thay đổi';

        // Preselect roadmap/topic/vocabulary
        const vocab = vocabulariesCache.find((v) => Number(v.id) === Number(item.vocabulary_id));
        if (vocab) {
            const topic = topicsCache.find((t) => Number(t.id) === Number(vocab.topic_id));
            if (topic) {
                cqRoadmapIdInput.value = topic.roadmap_id || '';
                populateCqTopicSelect();
                cqTopicIdInput.value = topic.id || '';
            }
            filterCqVocabularyOptions();
            cqVocabularyIdInput.value = item.vocabulary_id || '';
        } else {
            cqVocabularyIdInput.value = item.vocabulary_id || '';
        }
    } else {
        modalTitle.textContent = 'Thêm câu hỏi tùy chỉnh';

        // Preselect roadmap/topic/vocabulary theo các filter đang chọn (nếu có)
        if (customQuestionsVocabularyFilter.value) {
            const vocab = vocabulariesCache.find((v) => String(v.id) === customQuestionsVocabularyFilter.value);
            if (vocab) {
                const topic = topicsCache.find((t) => Number(t.id) === Number(vocab.topic_id));
                if (topic) {
                    cqRoadmapIdInput.value = topic.roadmap_id || '';
                    populateCqTopicSelect();
                    cqTopicIdInput.value = topic.id || '';
                }
                filterCqVocabularyOptions();
                cqVocabularyIdInput.value = vocab.id || '';
            }
        } else if (customQuestionsTopicFilter.value) {
            const topic = topicsCache.find((t) => String(t.id) === customQuestionsTopicFilter.value);
            if (topic) {
                cqRoadmapIdInput.value = topic.roadmap_id || '';
                populateCqTopicSelect();
                cqTopicIdInput.value = topic.id || '';
            }
            filterCqVocabularyOptions();
        } else if (customQuestionsRoadmapFilter.value) {
            cqRoadmapIdInput.value = customQuestionsRoadmapFilter.value;
            populateCqTopicSelect();
            filterCqVocabularyOptions();
        }
    }

    const modal = bootstrap.Modal.getOrCreateInstance(customQuestionModalEl);
    modal.show();

    setTimeout(() => cqQuestionInput.focus(), 100);
}

function getCustomQuestionPayload() {
    return {
        vocabulary_id: Number(cqVocabularyIdInput.value),
        question: cqQuestionInput.value.trim(),
        option_a: cqOptionAInput.value.trim(),
        option_b: cqOptionBInput.value.trim(),
        option_c: cqOptionCInput.value.trim(),
        option_d: cqOptionDInput.value.trim(),
        correct_option: String(cqCorrectOptionInput.value).toUpperCase(),
        is_active: cqIsActiveInput.checked
    };
}

function validateCustomQuestionForm() {
    let valid = true;

    if (!cqRoadmapIdInput.value) {
        cqRoadmapIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqRoadmapIdInput.classList.remove('is-invalid');
    }

    if (!cqTopicIdInput.value) {
        cqTopicIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqTopicIdInput.classList.remove('is-invalid');
    }

    if (!cqVocabularyIdInput.value) {
        cqVocabularyIdInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqVocabularyIdInput.classList.remove('is-invalid');
    }

    if (!cqQuestionInput.value.trim()) {
        cqQuestionInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqQuestionInput.classList.remove('is-invalid');
    }

    if (!cqOptionAInput.value.trim()) {
        cqOptionAInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqOptionAInput.classList.remove('is-invalid');
    }

    if (!cqOptionBInput.value.trim()) {
        cqOptionBInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqOptionBInput.classList.remove('is-invalid');
    }

    if (!cqOptionCInput.value.trim()) {
        cqOptionCInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqOptionCInput.classList.remove('is-invalid');
    }

    if (!cqOptionDInput.value.trim()) {
        cqOptionDInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqOptionDInput.classList.remove('is-invalid');
    }

    if (!cqCorrectOptionInput.value) {
        cqCorrectOptionInput.classList.add('is-invalid');
        valid = false;
    } else {
        cqCorrectOptionInput.classList.remove('is-invalid');
    }

    return valid;
}

async function handleSaveCustomQuestion() {
    if (!validateCustomQuestionForm()) return;

    setSaveLoading(customQuestionSaveBtn, customQuestionSaveSpinner, customQuestionSaveBtnText, true);
    hideFormError(customQuestionFormError);

    try {
        const id = customQuestionIdInput.value ? Number(customQuestionIdInput.value) : null;
        const payload = getCustomQuestionPayload();

        if (id) {
            await api.put(`/admin/custom-questions/${id}`, payload);
        } else {
            await api.post('/admin/custom-questions', payload);
        }

        const modal = bootstrap.Modal.getInstance(customQuestionModalEl);
        if (modal) modal.hide();

        showToast(id ? 'Cập nhật Câu hỏi thành công.' : 'Tạo Câu hỏi thành công.', 'success');
        await loadCustomQuestions();
    } catch (error) {
        showFormError(customQuestionFormError, error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        setSaveLoading(customQuestionSaveBtn, customQuestionSaveSpinner, customQuestionSaveBtnText, false);
    }
}

// ============================================================
// DELETE CONFIRM MODAL
// ============================================================

function openConfirmDeleteModal(type, item) {
    pendingDelete = { type, id: Number(item.id), name: item.name || `#${item.id}`, question: item.question || null };

    if (type === 'roadmap') {
        confirmDeleteText.textContent =
            `Bạn có chắc chắn muốn xóa Roadmap "${item.name || ''}"? Roadmap có chứa Topic/Vocabulary liên quan thì sẽ không thể xóa.`;
    } else if (type === 'topic') {
        confirmDeleteText.textContent =
            `Bạn có chắc chắn muốn xóa Topic "${item.name || ''}"?`;
    } else if (type === 'custom_question') {
        const q = item.question ? `"${truncateText(item.question, 60)}"` : `#${item.id}`;
        confirmDeleteText.textContent =
            `Bạn có chắc chắn muốn xóa câu hỏi ${q}? Hành động không thể hoàn tác.`;
    } else {
        confirmDeleteText.textContent =
            `Bạn có chắc chắn muốn xóa từ vựng "${item.word || item.name || ''}"?`;
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
        } else if (type === 'topic') {
            await api.del(`/admin/topics/${id}`);
            showToast('Xóa Topic thành công.', 'success');
            await loadTopics();
        } else if (type === 'custom_question') {
            await api.del(`/admin/custom-questions/${id}`);
            showToast('Xóa Câu hỏi thành công.', 'success');
            await loadCustomQuestions();
        } else {
            await api.del(`/admin/vocabularies/${id}`);
            showToast('Xóa Từ vựng thành công.', 'success');
            await loadVocabularies();
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

    // Vocabulary: Add dropdown / Import
    const btnAddVocabularyManual = document.getElementById('btnAddVocabularyManual');
    if (btnAddVocabularyManual) btnAddVocabularyManual.addEventListener('click', () => openVocabularyModal(null));

    const btnImportVocabularyOption = document.getElementById('btnImportVocabulary');
    if (btnImportVocabularyOption) btnImportVocabularyOption.addEventListener('click', () => openImportVocabularyModal());

    // Vocabulary form
    if (vocabularySaveBtn) vocabularySaveBtn.addEventListener('click', handleSaveVocabulary);
    if (vocabImageInput) vocabImageInput.addEventListener('change', handleVocabImageSelect);
    if (vocabAudioInput) vocabAudioInput.addEventListener('change', handleVocabAudioSelect);
    if (vocabRoadmapIdInput) {
        vocabRoadmapIdInput.addEventListener('change', () => {
            vocabTopicIdInput.value = '';
            populateVocabTopicSelect();
            vocabTopicIdInput.classList.remove('is-invalid');
        });
    }

    // Filter theo Topic (Vocabulary)
    if (vocabTopicFilter) {
        vocabTopicFilter.addEventListener('change', () => loadVocabularies());
    }

    // Import form
    if (importVocabularyBtn) importVocabularyBtn.addEventListener('click', handleImportVocabulary);
    if (importRoadmapIdInput) {
        importRoadmapIdInput.addEventListener('change', () => {
            importTopicIdInput.value = '';
            populateImportTopicSelect();
            importTopicIdInput.classList.remove('is-invalid');
        });
    }

    // Custom Question: Add
    const btnAddCustomQuestion = document.getElementById('btnAddCustomQuestion');
    if (btnAddCustomQuestion) btnAddCustomQuestion.addEventListener('click', () => openCustomQuestionModal(null));

    // Custom Question form
    if (customQuestionSaveBtn) customQuestionSaveBtn.addEventListener('click', handleSaveCustomQuestion);
    if (cqRoadmapIdInput) {
        cqRoadmapIdInput.addEventListener('change', () => {
            cqTopicIdInput.value = '';
            cqVocabularyIdInput.value = '';
            populateCqTopicSelect();
            filterCqVocabularyOptions();
            cqRoadmapIdInput.classList.remove('is-invalid');
        });
    }
    if (cqTopicIdInput) {
        cqTopicIdInput.addEventListener('change', () => {
            cqVocabularyIdInput.value = '';
            filterCqVocabularyOptions();
            cqTopicIdInput.classList.remove('is-invalid');
        });
    }
    if (cqVocabularyIdInput) {
        cqVocabularyIdInput.addEventListener('change', () => cqVocabularyIdInput.classList.remove('is-invalid'));
    }

    // Switch chỉ thay đổi label — KHÔNG gọi API ngay
    if (cqIsActiveInput) {
        cqIsActiveInput.addEventListener('change', () => updateActiveLabel(cqIsActiveInput, cqIsActiveLabel));
    }

    // Filter cascade (Custom Question): Roadmap → Topic → Vocabulary
    if (customQuestionsRoadmapFilter) {
        customQuestionsRoadmapFilter.addEventListener('change', () => {
            customQuestionsTopicFilter.value = '';
            customQuestionsVocabularyFilter.value = '';
            populateCustomQuestionsTopicFilter();
            populateCustomQuestionsVocabularyFilter();
            loadCustomQuestions();
        });
    }
    if (customQuestionsTopicFilter) {
        customQuestionsTopicFilter.addEventListener('change', () => {
            customQuestionsVocabularyFilter.value = '';
            populateCustomQuestionsVocabularyFilter();
            loadCustomQuestions();
        });
    }
    if (customQuestionsVocabularyFilter) {
        customQuestionsVocabularyFilter.addEventListener('change', () => loadCustomQuestions());
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
    if (vocabWordInput) {
        vocabWordInput.addEventListener('input', () => vocabWordInput.classList.remove('is-invalid'));
    }
    if (vocabMeaningInput) {
        vocabMeaningInput.addEventListener('input', () => vocabMeaningInput.classList.remove('is-invalid'));
    }
    if (importCsvFileInput) {
        importCsvFileInput.addEventListener('change', () => importCsvFileInput.classList.remove('is-invalid'));
    }

    // Xóa trạng thái invalid khi nhập thông tin Custom Question
    if (cqQuestionInput) {
        cqQuestionInput.addEventListener('input', () => cqQuestionInput.classList.remove('is-invalid'));
    }
    if (cqOptionAInput) {
        cqOptionAInput.addEventListener('input', () => cqOptionAInput.classList.remove('is-invalid'));
    }
    if (cqOptionBInput) {
        cqOptionBInput.addEventListener('input', () => cqOptionBInput.classList.remove('is-invalid'));
    }
    if (cqOptionCInput) {
        cqOptionCInput.addEventListener('input', () => cqOptionCInput.classList.remove('is-invalid'));
    }
    if (cqOptionDInput) {
        cqOptionDInput.addEventListener('input', () => cqOptionDInput.classList.remove('is-invalid'));
    }
    if (cqCorrectOptionInput) {
        cqCorrectOptionInput.addEventListener('change', () => cqCorrectOptionInput.classList.remove('is-invalid'));
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
    setupVocabulariesTable();
    setupCustomQuestionsTable();

    bindEvents();

    try {
        await loadRoadmaps();
        await loadAllTopicsForCache();
        await loadAllVocabulariesForCache();
        // Sau khi có cache, populate các select Vocabulary/Import
        populateVocabTopicFilter();
        populateCustomQuestionsRoadmapFilter();
        populateCustomQuestionsTopicFilter();
        populateCustomQuestionsVocabularyFilter();
        await loadVocabularies();
        await loadTopics();
        await loadCustomQuestions();
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