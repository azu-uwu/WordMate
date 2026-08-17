const aiModel = require("../models/aiModel");

/**
 * Trợ lý học tập thông minh WordMate AI
 */

/**
 * Kiểm tra xem một câu hỏi/tin nhắn của người dùng có nằm ngoài phạm vi hỗ trợ học tiếng Anh/WordMate hay không.
 *
 * @param {string} message - Tin nhắn của người dùng
 * @returns {boolean} true nếu câu hỏi ngoài phạm vi, ngược lại false
 */
const isOutOfScope = (message) => {
    if (!message || typeof message !== "string") return true;
    const msg = message.toLowerCase().trim();

    // 1. Cho phép các câu hỏi chào hỏi hoặc thăm hỏi ngắn
    const greetings = [
        "hello",
        "hi",
        "hey",
        "greetings",
        "xin chào",
        "chào bạn",
        "chào",
        "halo",
        "helo",
        "howdy",
        "ola",
        "bonjour",
        "bạn khỏe không",
        "bạn là ai",
        "tên là gì",
        "who are you",
        "what is your name",
        "how are you",
    ];
    if (greetings.some((g) => msg === g || msg.startsWith(g + " ") || msg.endsWith(" " + g))) {
        return false;
    }

    // 2. Định nghĩa các từ khóa tiếng Anh/học tập (trong phạm vi)
    const englishKeywords = [
        "tiếng anh",
        "english",
        "grammar",
        "ngữ pháp",
        "từ vựng",
        "vocabulary",
        "vocab",
        "wordmate",
        "word",
        "pronounce",
        "pronunciation",
        "phát âm",
        "meaning",
        "nghĩa là gì",
        "nghĩa của",
        "dịch",
        "translate",
        "translation",
        "example",
        "ví dụ",
        "câu ví dụ",
        "noun",
        "verb",
        "adjective",
        "adverb",
        "pronoun",
        "preposition",
        "thì",
        "tense",
        "present simple",
        "past simple",
        "future simple",
        "ielts",
        "toeic",
        "toefl",
        "study",
        "learn",
        "học",
        "luyện nghe",
        "luyện nói",
        "luyện đọc",
        "luyện viết",
        "speaking",
        "listening",
        "reading",
        "writing",
        "chủ đề",
        "topic",
        "roadmap",
        "lộ trình",
        "quiz",
        "câu hỏi",
        "trắc nghiệm",
        "kiểm tra",
        "test",
        "bài tập",
        "sentence",
        "phrase",
        "idiom",
        "phrasal verb",
        "slang",
        "collocation",
        "synonym",
        "antonym",
        "đồng nghĩa",
        "trái nghĩa",
    ];

    const hasEnglishKeyword = englishKeywords.some((keyword) => msg.includes(keyword));
    if (hasEnglishKeyword) {
        return false;
    }

    // 3. Định nghĩa các từ khóa ngoài phạm vi (như lập trình, toán học, thời tiết, nấu ăn, chính trị...)
    const outOfScopeKeywords = [
        "lập trình",
        "coding",
        "programming",
        "write code",
        "viết code",
        "python",
        "javascript",
        "html",
        "css",
        "c++",
        "java",
        "sql",
        "database",
        "nấu ăn",
        "cooking",
        "recipe",
        "món ăn",
        "thời tiết",
        "weather",
        "bóng đá",
        "football",
        "soccer",
        "toán",
        "math",
        "equation",
        "phương trình",
        "vật lý",
        "hóa học",
        "physics",
        "chemistry",
        "sinh học",
        "biology",
        "chính trị",
        "politics",
        "kinh tế",
        "economy",
        "finance",
        "tài chính",
        "cổ phiếu",
        "stock",
        "crypto",
        "bitcoin",
        "phim",
        "movie",
        "cinema",
        "bài hát",
        "song",
        "music",
        "âm nhạc",
        "game",
        "trò chơi",
    ];

    const hasOutOfScopeKeyword = outOfScopeKeywords.some((keyword) => msg.includes(keyword));
    if (hasOutOfScopeKeyword) {
        return true;
    }

    // 4. Các câu hỏi tiếng Việt chung không liên quan đến học tiếng Anh
    const generalVnQuestions = [
        "thủ đô",
        "quốc gia",
        "đất nước",
        "bao nhiêu tuổi",
        "thời tiết",
        "hôm nay",
        "ngày mai",
        "làm bánh",
        "tin tức",
        "news",
        "bản tin",
        "lịch sử",
        "địa lý",
        "khoa học",
        "văn học",
    ];
    if (generalVnQuestions.some((kw) => msg.includes(kw))) {
        return true;
    }

    // 5. Kiểm tra các từ tiếng Anh thông dụng để hỗ trợ giao tiếp tiếng Anh cơ bản (coi là học tiếng Anh giao tiếp)
    const commonEnglishWords = [
        "the",
        "is",
        "are",
        "you",
        "what",
        "how",
        "why",
        "who",
        "can",
        "do",
        "does",
        "have",
        "has",
        "it",
        "this",
        "that",
        "with",
        "for",
        "on",
        "in",
        "at",
        "about",
        "to",
        "me",
        "my",
        "your",
    ];
    const msgWords = msg.split(/\s+/);
    const hasEnglishWords = msgWords.some((w) => commonEnglishWords.includes(w));
    if (hasEnglishWords) {
        return false;
    }

    // Mặc định, nếu không có biểu hiện rõ ràng nào là hỏi về tiếng Anh hoặc chào hỏi, thì coi là ngoài phạm vi
    return true;
};

/**
 * Xử lý cuộc hội thoại chat của user với AI Gemini.
 *
 * @param {object} param0 - { userId, message, conversationId, context }
 * @param {number} param0.userId - ID người dùng
 * @param {string} param0.message - Tin nhắn của người dùng gửi cho AI
 * @param {number} [param0.conversationId] - ID conversation hiện tại (tùy chọn)
 * @param {object} [param0.context] - Ngữ cảnh học tập hiện tại từ Frontend (tùy chọn)
 * @returns {Promise<object>} Đối tượng chứa kết quả phản hồi của AI
 */
const chat = async ({ userId, message, conversationId, context }) => {
    // 1. Kiểm tra message hợp lệ
    if (!message || typeof message !== "string" || message.trim().length === 0) {
        const error = new Error("Tin nhắn không hợp lệ");
        error.status = 400;
        throw error;
    }

    // 2. Kiểm tra/Tạo conversation và xác thực quyền sở hữu
    let currentConversationId = conversationId;
    if (!currentConversationId) {
        const createResult = await aiModel.createConversation(userId);
        currentConversationId = createResult.insertId;
    } else {
        const conversation = await aiModel.getConversationById(currentConversationId);
        if (!conversation) {
            const error = new Error("Hội thoại không tồn tại");
            error.status = 404;
            throw error;
        }
        if (conversation.user_id !== userId) {
            const error = new Error("Bạn không có quyền truy cập hội thoại này");
            error.status = 403;
            throw error;
        }
    }

    // 3. Kiểm tra câu hỏi ngoài phạm vi trước khi gọi Gemini
    if (isOutOfScope(message)) {
        return {
            conversation_id: currentConversationId,
            reply: "Xin lỗi, tôi là trợ lý học tập WordMate AI. Tôi chỉ có thể hỗ trợ các nội dung liên quan đến học tiếng Anh, từ vựng, ngữ pháp, các câu ví dụ và thông tin bài học/quiz trên ứng dụng WordMate. Bạn có muốn chọn một trong các câu hỏi gợi ý bên dưới để tiếp tục không?",
            role: "assistant",
            outOfScope: true,
            showSuggestions: true,
        };
    }

    // 4. Lấy tối đa 10 tin nhắn gần nhất làm lịch sử hội thoại
    let historyMessages = [];
    try {
        historyMessages = await aiModel.getMessagesByConversation(currentConversationId, 10);
    } catch (dbErr) {
        console.error("Lỗi khi truy vấn lịch sử hội thoại từ database:", dbErr);
        const error = new Error("Lỗi cơ sở dữ liệu khi lấy lịch sử hội thoại");
        error.status = 500;
        throw error;
    }

    // 5. Xây dựng Prompt tổng hợp
    const systemPrompt = `Bạn là WordMate AI, một trợ lý hỗ trợ học tiếng Anh chuyên nghiệp tích hợp trong ứng dụng WordMate.
Nhiệm vụ của bạn là hỗ trợ người dùng học tiếng Anh hiệu quả: giải thích từ vựng, ngữ pháp, cung cấp câu ví dụ, giải thích các câu hỏi/quiz và nội dung đang học.
Hãy phản hồi bằng tiếng Việt thân thiện, rõ ràng, ngắn gọn và dễ hiểu, xen kẽ tiếng Anh khi giải thích từ vựng/ví dụ.`;

    let contextPrompt = "";
    if (context && typeof context === "object") {
        contextPrompt = `\n--- NGỮ CẢNH HỌC TẬP HIỆN TẠI ---\n`;
        if (context.page) contextPrompt += `Trang hiện tại: ${context.page}\n`;
        if (context.topic_id) contextPrompt += `ID chủ đề đang học: ${context.topic_id}\n`;
        if (context.vocabulary_id) contextPrompt += `ID từ vựng đang học: ${context.vocabulary_id}\n`;
        if (context.quiz) {
            contextPrompt += `Thông tin quiz/câu hỏi hiện tại: ${JSON.stringify(context.quiz)}\n`;
        }
        contextPrompt += `-----------------------------------\n`;
    }

    let historyPrompt = "";
    if (historyMessages && historyMessages.length > 0) {
        historyPrompt = `\n--- LỊCH SỬ HỘI THOẠI (Tối đa 10 tin nhắn gần nhất) ---\n`;
        for (const msg of historyMessages) {
            const roleName = msg.role === "user" ? "Người học" : "WordMate AI";
            historyPrompt += `${roleName}: ${msg.content}\n`;
        }
        historyPrompt += `------------------------------------------------------\n`;
    }

    const finalPrompt = `${systemPrompt}

${contextPrompt}
${historyPrompt}

Người học: ${message}
WordMate AI:`;

    // 6. Gọi Gemini API chỉ từ Backend
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const error = new Error("Dịch vụ AI chưa được cấu hình khóa API");
        error.status = 500;
        throw error;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 giây timeout

    let reply = "";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: finalPrompt,
                            },
                        ],
                    },
                ],
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API trả về lỗi (Status ${response.status}):`, errorText);
            const error = new Error("Không thể nhận câu trả lời từ AI. Vui lòng thử lại sau.");
            error.status = 502;
            throw error;
        }

        const result = await response.json();
        reply = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply || typeof reply !== "string") {
            console.error("Cấu trúc response từ Gemini không đúng:", JSON.stringify(result));
            const error = new Error("Phản hồi không hợp lệ từ máy chủ AI");
            error.status = 502;
            throw error;
        }

        reply = reply.trim();
    } catch (apiErr) {
        clearTimeout(timeoutId);
        if (apiErr.name === "AbortError") {
            const error = new Error("Yêu cầu tới AI Assistant đã quá thời gian chờ (Timeout)");
            error.status = 504;
            throw error;
        }
        if (apiErr.status) {
            throw apiErr;
        }
        console.error("Lỗi khi kết nối hoặc gọi Gemini API:", apiErr);
        const error = new Error("Không thể kết nối đến AI Assistant. Vui lòng thử lại sau.");
        error.status = 503;
        throw error;
    }

    // 7. Lưu tin nhắn của user và response của assistant vào ai_messages nếu hợp lệ
    try {
        await aiModel.createMessage({
            conversationId: currentConversationId,
            role: "user",
            content: message,
        });

        await aiModel.createMessage({
            conversationId: currentConversationId,
            role: "assistant",
            content: reply,
        });
    } catch (dbSaveErr) {
        console.error("Lỗi khi lưu tin nhắn vào cơ sở dữ liệu:", dbSaveErr);
        const error = new Error("Lỗi hệ thống khi lưu lịch sử hội thoại");
        error.status = 500;
        throw error;
    }

    // 8. Trả về thông tin kết quả
    return {
        conversation_id: currentConversationId,
        reply,
        role: "assistant",
    };
};

module.exports = {
    chat,
};
