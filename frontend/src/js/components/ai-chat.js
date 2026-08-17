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

const INITIAL_SUGGESTIONS = [
    'Giải thích từ "improve" giúp mình nhé.',
    'Cho mình ví dụ về thì hiện tại đơn.',
    'Từ đồng nghĩa với "happy" là gì?',
    'Luyện phát âm từ "vocabulary" như thế nào?',
];

// ============================================================
// STATE
// ============================================================

let currentConversationId = null;
let isSending = false;
let hasSentValidMessage = false;
let conversations = [];

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

function selectConversation(conversationId) {
    currentConversationId = conversationId;
    saveConversationId();

    // Cập nhật trạng thái active
    renderConversations();

    // Không có API lấy message history - xóa message và hiển thị suggestion
    clearMessages();
    hasSentValidMessage = false;
    saveHasSentFlag();
    showSuggestions();
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
// SUGGESTIONS
// ============================================================

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

    INITIAL_SUGGESTIONS.forEach(text => {
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
            context: {}
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