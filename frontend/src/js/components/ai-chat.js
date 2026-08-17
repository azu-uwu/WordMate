/**
 * AI Chat Component - WordMate
 *
 * Chịu trách nhiệm:
 * - Load component AI Chat theo convention MPA.
 * - Quản lý popup mở/đóng.
 * - Quản lý currentConversationId (giữ khi chuyển trang MPA).
 * - Hiển thị tối đa 5 conversation dưới dạng bubble.
 * - Gửi message tới POST /api/ai/chat.
 * - Hiển thị suggestion, loading, error.
 */

import api from '../../services/api.js';

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEYS = {
    conversationId: 'wm_ai_current_conversation_id',
    sessionToken: 'wm_ai_session_token',
};

const MAX_CONVERSATIONS = 5;

// ============================================================
// STATE
// ============================================================

let currentConversationId = null;
let isSending = false;
let hasSentValidMessage = false;
let conversations = [];
let historyRequestSeq = 0;

// ============================================================
// DOM ELEMENTS
// ============================================================

let aiChat, toggleBtn, widget, closeBtn, newChatBtn, messagesContainer, input, sendBtn, conversationsContainer;

function getDOMElements() {
    aiChat = document.getElementById('aiChat');
    toggleBtn = document.getElementById('aiChatToggle');
    widget = document.getElementById('aiChatWidget');
    closeBtn = document.getElementById('aiChatClose');
    newChatBtn = document.querySelector('.ai-chat__new-chat');
    messagesContainer = document.querySelector('.ai-chat__messages');
    input = document.querySelector('.ai-chat__input');
    sendBtn = document.querySelector('.ai-chat__send');
    conversationsContainer = document.querySelector('.ai-chat__conversations');
}

// ============================================================
// SESSION & CONVERSATION STATE
// ============================================================

function getToken() {
    return localStorage.getItem('token');
}

function isNewSession() {
    const storedToken = localStorage.getItem(STORAGE_KEYS.sessionToken);
    return storedToken !== getToken();
}

function markSession() {
    localStorage.setItem(STORAGE_KEYS.sessionToken, getToken());
}

function getHasSentKey() {
    return `wm_ai_has_sent_${currentConversationId}`;
}

function handleSession() {
    if (isNewSession()) {
        // Phiên đăng nhập mới - không dùng conversation của phiên trước
        localStorage.removeItem(STORAGE_KEYS.conversationId);
        currentConversationId = null;
        markSession();
    } else {
        // Cùng phiên - khôi phục conversation hiện tại
        const stored = localStorage.getItem(STORAGE_KEYS.conversationId);
        currentConversationId = stored ? Number(stored) : null;
    }

    // Khôi phục trạng thái suggestion cho conversation hiện tại
    hasSentValidMessage = currentConversationId
        ? localStorage.getItem(getHasSentKey()) === 'true'
        : false;
}

function saveConversationId() {
    if (currentConversationId) {
        localStorage.setItem(STORAGE_KEYS.conversationId, String(currentConversationId));
    } else {
        localStorage.removeItem(STORAGE_KEYS.conversationId);
    }
}

function saveHasSentFlag() {
    if (currentConversationId) {
        localStorage.setItem(getHasSentKey(), hasSentValidMessage ? 'true' : 'false');
    }
}

// ============================================================
// POPUP MANAGEMENT
// ============================================================

function openAIChat() {
    if (!widget || !toggleBtn) return;

    widget.hidden = false;
    toggleBtn.style.display = 'none';
    toggleBtn.setAttribute('aria-expanded', 'true');

    // Đảm bảo có conversation (tạo mới nếu chưa có)
    ensureConversation().then(() => {
        // Load danh sách conversation
        loadConversations();

        // Hiển thị suggestion nếu chưa gửi message hợp lệ
        if (!hasSentValidMessage) {
            showSuggestions();
        }
    });
}

function closeAIChat() {
    if (!widget || !toggleBtn) return;

    widget.hidden = true;
    toggleBtn.style.display = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
}

// ============================================================
// CONVERSATION MANAGEMENT
// ============================================================

async function ensureConversation() {
    if (currentConversationId) return;

    try {
        const response = await api.post('/ai/conversations');
        if (response.success && response.data && response.data.conversation_id) {
            currentConversationId = response.data.conversation_id;
            saveConversationId();
            hasSentValidMessage = false;
            saveHasSentFlag();
        }
    } catch (error) {
        console.error('[AIChat] Không thể tạo conversation:', error);
        showError('Không thể tạo hội thoại. Vui lòng thử lại.');
    }
}

async function loadConversations() {
    try {
        const response = await api.get('/ai/conversations');
        if (response.success) {
            conversations = Array.isArray(response.data)
                ? response.data.slice(0, MAX_CONVERSATIONS)
                : [];
            renderConversations();
        }
    } catch (error) {
        console.error('[AIChat] Không thể tải danh sách conversation:', error);
    }
}

function renderConversations() {
    if (!conversationsContainer) return;

    conversationsContainer.innerHTML = '';

    conversations.forEach(conv => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-chat__conversation';
        btn.title = `Hội thoại ${conv.id}`;
        btn.setAttribute('aria-label', `Hội thoại ${conv.id}`);
        btn.dataset.conversationId = conv.id;

        if (conv.id === currentConversationId) {
            btn.classList.add('ai-chat__conversation--active');
        }

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-robot';
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);

        btn.addEventListener('click', () => selectConversation(conv.id));

        conversationsContainer.appendChild(btn);
    });
}

/**
 * Tải lịch sử và render toàn bộ message của một conversation.
 * Có thể tái sử dụng khi khôi phục conversation khi chuyển trang MPA.
 *
 * @param {number} conversationId - ID conversation cần tải lịch sử
 * @returns {Promise<void>}
 */
async function loadConversationHistory(conversationId) {
    // Tăng sequence để loại bỏ response cũ khi user chuyển conversation nhanh
    const requestSeq = ++historyRequestSeq;

    // Xóa message của conversation đang hiển thị trước khi load
    clearMessages();

    try {
        const response = await api.get(`/ai/conversations/${conversationId}/messages`);

        // Bỏ qua response cũ nếu user đã chuyển sang conversation khác
        if (requestSeq !== historyRequestSeq) return;

        if (!response.success) {
            throw new Error(response.message || 'Không thể tải lịch sử hội thoại.');
        }

        const messages = Array.isArray(response.data) ? response.data : [];

        if (messages.length > 0) {
            // Conversation đã có lịch sử - render toàn bộ message theo thứ tự cũ → mới
            renderMessages(messages);
            hasSentValidMessage = true;
        } else {
            // Conversation chưa có message - hiển thị suggestion để bắt đầu hội thoại
            hasSentValidMessage = false;
            showSuggestions();
        }
        saveHasSentFlag();
    } catch (error) {
        // Bỏ qua lỗi của response cũ nếu user đã chuyển sang conversation khác
        if (requestSeq !== historyRequestSeq) return;

        console.error('[AIChat] Không thể tải lịch sử hội thoại:', error);
        showError('Không thể tải lịch sử hội thoại. Vui lòng thử lại.');
    }
}

/**
 * Render danh sách message vào messagesContainer theo đúng thứ tự cũ → mới.
 *
 * @param {Array<{role: string, content: string}>} messages - Danh sách message của conversation
 */
function renderMessages(messages) {
    if (!messagesContainer) return;

    messages.forEach((msg) => {
        const role = msg.role === 'user' ? 'user' : 'assistant';
        addMessage(msg.content, role);
    });
}

function selectConversation(conversationId) {
    if (conversationId === currentConversationId) return;

    currentConversationId = conversationId;
    saveConversationId();

    // Cập nhật trạng thái active trên bubble
    renderConversations();

    // Load và render lịch sử của conversation được chọn
    loadConversationHistory(conversationId);
}

async function createNewConversation() {
    try {
        const response = await api.post('/ai/conversations');
        if (response.success && response.data && response.data.conversation_id) {
            currentConversationId = response.data.conversation_id;
            saveConversationId();

            // Xóa message cũ và hiển thị suggestion
            clearMessages();
            hasSentValidMessage = false;
            saveHasSentFlag();
            showSuggestions();

            // Refresh danh sách conversation
            await loadConversations();
        }
    } catch (error) {
        console.error('[AIChat] Không thể tạo hội thoại mới:', error);
        showError('Không thể tạo hội thoại mới. Vui lòng thử lại.');
    }
}

// ============================================================
// MESSAGE MANAGEMENT
// ============================================================

function addMessage(text, role) {
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-chat__message ai-chat__message--${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'ai-chat__message-bubble';
    bubble.textContent = text;

    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function clearMessages() {
    if (!messagesContainer) return;
    messagesContainer.innerHTML = '';
}

function scrollToBottom() {
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// ============================================================
// PAGE DETECTION & CONTEXT
// ============================================================

/**
 * Xác định trang hiện tại của MPA dựa trên URL path.
 * @returns {string|null} Tên trang: 'learn' | 'quiz' | 'dashboard' | 'notebook' | 'profile' | null
 */
function getCurrentPage() {
    const path = window.location.pathname || '';
    const pageMap = [
        { name: 'learn', pattern: '/learn/' },
        { name: 'quiz', pattern: '/quiz/' },
        { name: 'dashboard', pattern: '/dashboard/' },
        { name: 'notebook', pattern: '/notebook/' },
        { name: 'profile', pattern: '/profile/' },
    ];
    const match = pageMap.find((p) => path.includes(p.pattern));
    return match ? match.name : null;
}

/**
 * Lấy topic_id hợp lệ từ query param 'topic_id' trên URL.
 * @returns {number|null}
 */
function getTopicIdFromUrl() {
    const raw = new URLSearchParams(window.location.search).get('topic_id');
    if (raw === null || raw === '') return null;
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Lấy từ vựng đang học hiện tại từ flashcard (Learn).
 * @returns {string|null}
 */
function getLearnCurrentWord() {
    const el = document.querySelector('.flashcard-word');
    const word = el ? el.textContent.trim() : '';
    // Bỏ qua placeholder mặc định "word" trong learn.html
    return word && word !== 'word' ? word : null;
}

/**
 * Lấy thông tin câu hỏi quiz đang hiển thị từ DOM (Quiz).
 * Chỉ đọc dữ liệu thật: state câu hỏi đang hiển thị VÀ nội dung không phải placeholder.
 * @returns {Object|null}
 */
function getQuizQuestionContext() {
    const questionState = document.getElementById('quiz-question-state');
    if (!questionState || questionState.hidden) return null;

    const questionEl = questionState.querySelector('.quiz-question:not([hidden])');
    if (!questionEl) return null;

    const textEl = questionEl.querySelector('.quiz-question-text');
    const badgeEl = questionEl.querySelector('.quiz-question-type-badge');
    const options = Array.from(questionEl.querySelectorAll('.quiz-option-text'))
        .map((o) => o.textContent.trim())
        .filter(Boolean);

    const question = textEl ? textEl.textContent.trim() : '';

    // Template placeholder ({{question}} / {{option_1}}) chưa có dữ liệu thật → không gửi
    const hasPlaceholder = question.includes('{{') || options.some((o) => o.includes('{{'));
    if (hasPlaceholder) return null;

    return {
        question,
        question_type: questionEl.dataset.questionType || '',
        options,
        badge: badgeEl ? badgeEl.textContent.trim() : '',
    };
}

/**
 * Lấy topic_id của chủ đề Dashboard mà user đang thao tác (đang focus).
 * @returns {number|null}
 */
function getDashboardTopicId() {
    const active = document.querySelector('.topic-card:focus');
    if (active && active.dataset.topicId) {
        const id = Number(active.dataset.topicId);
        if (Number.isInteger(id) && id > 0) return id;
    }
    return null;
}

/**
 * Lấy bộ lọc/tìm kiếm hiện tại của Notebook từ DOM (không bắt buộc vocabulary_id).
 * @returns {Object} { topicId, search }
 */
function getNotebookContext() {
    let topicId = null;
    const activeChip = document.querySelector('.notebook-filter-chip.is-active');
    if (activeChip && activeChip.dataset.topicId) {
        const id = Number(activeChip.dataset.topicId);
        if (Number.isInteger(id) && id > 0) topicId = id;
    }

    const searchEl = document.querySelector('.notebook-search-input');
    const search = searchEl ? searchEl.value.trim() : '';

    return { topicId, search };
}

/**
 * Xây dựng context thực tế gửi tới Backend theo trang hiện tại.
 * Được gọi lại mỗi lần gửi message để phản ánh đúng trang/state mới nhất.
 * @returns {Object}
 */
function buildContext() {
    const page = getCurrentPage();
    const context = {};
    if (page) context.page = page;

    switch (page) {
        case 'learn': {
            const topicId = getTopicIdFromUrl();
            if (topicId) context.topic_id = topicId;

            // vocabulary_id không có sẵn trong DOM Learn,
            // dùng từ đang học trên flashcard làm dữ liệu ngữ cảnh cụ thể.
            const word = getLearnCurrentWord();
            if (word) context.word = word;
            break;
        }
        case 'quiz': {
            const quiz = getQuizQuestionContext();
            if (quiz && (quiz.question || quiz.options.length > 0)) {
                context.quiz = quiz;
            }
            break;
        }
        case 'dashboard': {
            const topicId = getDashboardTopicId();
            if (topicId) context.topic_id = topicId;
            break;
        }
        case 'notebook': {
            const { topicId, search } = getNotebookContext();
            if (topicId) context.topic_id = topicId;
            if (search) context.search = search;
            break;
        }
        case 'profile':
        default:
            // Không thêm dữ liệu cụ thể, chỉ gửi page chung.
            break;
    }

    return context;
}

// ============================================================
// SUGGESTIONS
// ============================================================

/**
 * Chọn danh sách câu hỏi gợi ý phù hợp với context/trang hiện tại.
 * Ưu tiên nội dung cụ thể (từ đang học / topic đang dùng) trước suggestion chung.
 * @returns {string[]}
 */
function buildSuggestions() {
    const page = getCurrentPage();

    if (page === 'learn') {
        const word = getLearnCurrentWord();
        const topicId = getTopicIdFromUrl();

        // Có từ vựng đang học → ưu tiên suggestion liên quan đến từ đó
        if (word) {
            return [
                `Giải thích nghĩa và cách dùng từ "${word}".`,
                `Cho mình thêm một câu ví dụ với từ "${word}".`,
                `Từ "${word}" có từ đồng nghĩa nào?`,
                `Làm thế nào để nhớ từ "${word}"?`,
            ];
        }

        // Có topic hiện tại → suggestion liên quan đến chủ đề
        if (topicId) {
            return [
                'Những từ quan trọng trong chủ đề này là gì?',
                'Giải thích nghĩa của các từ vựng trong chủ đề này.',
                'Cho mình một câu ví dụ với một từ trong chủ đề này.',
                'Giúp mình học chủ đề này hiệu quả hơn.',
            ];
        }

        return [
            'Giải thích một từ vựng tiếng Anh cho mình.',
            'Cho mình ví dụ về thì hiện tại đơn.',
            'Từ đồng nghĩa và trái nghĩa là gì?',
            'Luyện phát âm tiếng Anh như thế nào?',
        ];
    }

    if (page === 'quiz') {
        return [
            'Giải thích câu hỏi này.',
            'Giải thích đáp án đúng.',
            'Giải thích từ vựng trong câu hỏi.',
            'Cho mình biết vì sao các đáp án khác sai.',
        ];
    }

    if (page === 'dashboard') {
        const topicId = getDashboardTopicId();

        if (topicId) {
            return [
                'Giới thiệu chủ đề này.',
                'Những từ quan trọng trong chủ đề này là gì?',
                'Giúp mình học chủ đề này hiệu quả hơn.',
                'Cho mình mẹo ghi nhớ từ vựng của chủ đề này.',
            ];
        }

        return [
            'Giới thiệu lộ trình học tiếng Anh của mình.',
            'Làm sao để học từ vựng hiệu quả?',
            'Gợi ý cho mình cách luyện ngữ pháp.',
            'Mẹo ghi nhớ từ vựng lâu là gì?',
        ];
    }

    if (page === 'notebook') {
        return [
            'Giải thích một từ vựng cho mình.',
            'Cho mình ví dụ với một từ trong sổ tay.',
            'Phân biệt hai từ tiếng Anh.',
            'Giải thích ngữ pháp tiếng Anh.',
        ];
    }

    if (page === 'profile') {
        return [
            'Gợi ý cho mình cách học tiếng Anh hiệu quả.',
            'Làm sao để mở rộng vốn từ vựng?',
            'Mẹo cải thiện ngữ pháp tiếng Anh là gì?',
            'Cho mình lộ trình học từ vựng phù hợp.',
        ];
    }

    // Trang không xác định → suggestion chung
    return [
        'Giải thích một từ vựng tiếng Anh cho mình.',
        'Cho mình ví dụ về một thì tiếng Anh.',
        'Từ đồng nghĩa với một từ mình đang học là gì?',
        'Luyện phát âm tiếng Anh như thế nào?',
    ];
}

function showSuggestions() {
    hideSuggestions();

    if (!messagesContainer) return;

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'ai-chat__suggestions';
    suggestionsDiv.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;';

    const label = document.createElement('p');
    label.textContent = 'Bạn có thể hỏi mình:';
    label.style.cssText = 'font-size:0.8125rem;color:var(--wm-text-muted);margin:0 0 0.25rem;';
    suggestionsDiv.appendChild(label);

    buildSuggestions().forEach(text => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-chat__suggestion';
        btn.textContent = text;
        btn.style.cssText = 'text-align:left;padding:0.5rem 0.75rem;font-size:0.875rem;color:var(--wm-text-primary);background:var(--wm-bg-page);border:1px solid var(--wm-border);border-radius:var(--wm-radius-md);cursor:pointer;transition:all var(--wm-transition-fast);';

        btn.addEventListener('mouseenter', () => {
            btn.style.borderColor = 'var(--wm-primary)';
            btn.style.color = 'var(--wm-primary)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.borderColor = 'var(--wm-border)';
            btn.style.color = 'var(--wm-text-primary)';
        });
        btn.addEventListener('click', () => {
            input.value = text;
            sendMessage();
        });

        suggestionsDiv.appendChild(btn);
    });

    messagesContainer.appendChild(suggestionsDiv);
    scrollToBottom();
}

function hideSuggestions() {
    if (!messagesContainer) return;
    const suggestions = messagesContainer.querySelector('.ai-chat__suggestions');
    if (suggestions) suggestions.remove();
}

// ============================================================
// LOADING & ERROR
// ============================================================

function showLoading() {
    if (!messagesContainer) return;

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-chat__message ai-chat__message--assistant ai-chat__message--loading';

    const bubble = document.createElement('div');
    bubble.className = 'ai-chat__message-bubble';
    bubble.textContent = 'Đang suy nghĩ...';

    loadingDiv.appendChild(bubble);
    messagesContainer.appendChild(loadingDiv);
    scrollToBottom();
}

function hideLoading() {
    if (!messagesContainer) return;
    const loading = messagesContainer.querySelector('.ai-chat__message--loading');
    if (loading) loading.remove();
}

function showError(message) {
    if (!messagesContainer) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'ai-chat__message ai-chat__message--assistant ai-chat__message--error';

    const bubble = document.createElement('div');
    bubble.className = 'ai-chat__message-bubble';
    bubble.textContent = message;

    errorDiv.appendChild(bubble);
    messagesContainer.appendChild(errorDiv);
    scrollToBottom();
}

// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage() {
    const message = input.value.trim();
    if (!message || isSending) return;

    // Đảm bảo có conversation trước khi gửi
    if (!currentConversationId) {
        await ensureConversation();
        if (!currentConversationId) return; // Không thể tạo conversation
    }

    // Ẩn suggestion
    hideSuggestions();

    // Hiển thị message của user
    addMessage(message, 'user');
    input.value = '';

    // Hiển thị loading
    showLoading();
    isSending = true;
    setSendDisabled(true);

    try {
        const response = await api.post('/ai/chat', {
            message,
            conversation_id: currentConversationId,
            context: buildContext()
        });

        if (response.success && response.data) {
            const data = response.data;

            // Cập nhật conversation id nếu có
            if (data.conversation_id) {
                currentConversationId = data.conversation_id;
                saveConversationId();
            }

            // Hiển thị reply của assistant
            if (data.reply) {
                addMessage(data.reply, 'assistant');
            }

            // Xử lý out-of-scope: hiển thị lại suggestion
            if (data.outOfScope && data.showSuggestions) {
                hasSentValidMessage = false;
                saveHasSentFlag();
                showSuggestions();
            } else {
                // Message hợp lệ - không hiển thị lại suggestion
                hasSentValidMessage = true;
                saveHasSentFlag();
            }
        }
    } catch (error) {
        console.error('[AIChat] Không thể gửi tin nhắn:', error);
        showError('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
        hideLoading();
        isSending = false;
        setSendDisabled(false);
        if (input) input.focus();
    }
}

function setSendDisabled(disabled) {
    if (sendBtn) sendBtn.disabled = disabled;
    if (input) input.disabled = disabled;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function bindEvents() {
    if (toggleBtn) {
        toggleBtn.addEventListener('click', openAIChat);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeAIChat);
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewConversation);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// ============================================================
// INITIALIZE
// ============================================================

export function initAIChat() {
    getDOMElements();

    if (!aiChat) {
        console.warn('[AIChat] Component AI Chat không tồn tại.');
        return;
    }

    // Xử lý phiên đăng nhập
    handleSession();

    // Bind sự kiện
    bindEvents();

    console.log('[AIChat] Component AI Chat đã khởi tạo.');
}