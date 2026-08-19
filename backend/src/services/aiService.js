const aiModel = require("../models/aiModel");

/**
 * Trợ lý học tập thông minh WordMate AI
 */

/**
 * Từ khóa thể hiện intent học tiếng Anh/từ vựng/ngữ pháp (trong phạm vi).
 * Lưu ý: KHÔNG dùng các từ quá chung như "what", "why", "how", "can", "explain"
 * vì chúng không xác định được intent học tiếng Anh và dễ gây từ chối nhầm.
 */
const englishLearningKeywords = [
    "tiếng anh",
    "english",
    "grammar",
    "ngữ pháp",
    "từ vựng",
    "vocabulary",
    "vocab",
    "wordmate",
    "word",
    "meaning",
    "mean",
    "nghĩa là gì",
    "nghĩa của",
    "nghĩa",
    "dịch",
    "translate",
    "translation",
    "pronounce",
    "pronunciation",
    "phát âm",
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

/**
 * Từ/cụm từ chào hỏi, thăm hỏi ngắn được phép.
 */
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

/**
 * Từ khóa thuộc các lĩnh vực RÕ RÀNG ngoài phạm vi học tiếng Anh/WordMate.
 * Chỉ reject khi câu hỏi chứa các từ khóa cụ thể này.
 */
const outOfScopeKeywords = [
    // Lập trình / coding
    "lập trình",
    "coding",
    "programming",
    "write code",
    "viết code",
    "debug",
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "c#",
    "php",
    "ruby",
    "rust",
    "html",
    "css",
    "sql",
    "react",
    "nodejs",
    "node.js",
    "api",
    "database",
    // Nấu ăn / công thức nấu ăn
    "nấu ăn",
    "cooking",
    "recipe",
    "cách nấu",
    "món ăn",
    "làm bánh",
    // Thời tiết
    "thời tiết",
    "weather",
    "dự báo",
    "nhiệt độ",
    // Thể thao
    "bóng đá",
    "football",
    "soccer",
    "tennis",
    "basketball",
    "cầu lông",
    "thể thao",
    // Toán học
    "toán",
    "math",
    "equation",
    "phương trình",
    "calculus",
    "algebra",
    "geometry",
    // Khoa học tự nhiên
    "vật lý",
    "physics",
    "hóa học",
    "chemistry",
    "sinh học",
    "biology",
    "khoa học",
    "science",
    // Chính trị / kinh tế / tài chính
    "chính trị",
    "politics",
    "kinh tế",
    "economy",
    "tài chính",
    "finance",
    "cổ phiếu",
    "stock",
    "chứng khoán",
    "crypto",
    "bitcoin",
    // Địa lý / lịch sử / xã hội
    "thủ đô",
    "capital",
    "quốc gia",
    "địa lý",
    "geography",
    "lịch sử",
    "history",
    // Tin tức / giải trí
    "tin tức",
    "news",
    "bản tin",
    "phim",
    "movie",
    "cinema",
    "âm nhạc",
    "music",
    "bài hát",
    "song",
    "game",
    "trò chơi",
];


const outOfScopePatterns = [
    /why do (cats|dogs|animals|humans|plants|birds|fish|insects) (have|need|eat)/,
    /how many (legs|wings|eyes|bones|teeth|fingers) (does|do) (a|an|the)/,
    /why is the sky/,
    /what is the (capital|population) of/,
    /how (tall|far|long|big|fast) (is|are|does|do)/,
];

/**
 * Kiểm tra xem câu hỏi có chứa từ khóa thể hiện intent học tiếng Anh/WordMate hay không.
 */
const hasEnglishLearningIntent = (msg) =>
    englishLearningKeywords.some((keyword) => msg.includes(keyword));

/**
 * Kiểm tra lời chào hỏi/thăm hỏi ngắn.
 */
const isGreeting = (msg) => {
    const normalized = msg.replace(/[?!.]+$/g, "").trim();
    return greetings.some(
        (g) => normalized === g || normalized.startsWith(g + " ") || normalized.endsWith(" " + g)
    );
};

/**
 * Kiểm tra context học tập hiện tại có thông tin học tập và câu hỏi có tham chiếu
 * tới nội dung đang học hay không.
 */
const hasLearningContext = (context, msg) => {
    if (!context || typeof context !== "object") return false;

    const hasLearningValue = (value) =>
        value !== undefined && value !== null && value !== "" &&
        !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0);

    const hasContextInfo =
        hasLearningValue(context.vocabulary_id) ||
        hasLearningValue(context.topic_id) ||
        hasLearningValue(context.quiz) ||
        hasLearningValue(context.page) ||
        ["vocabulary", "vocab", "topic", "lesson", "word", "exercise", "grammar"]
            .some((key) => hasLearningValue(context[key]));

    if (!hasContextInfo) return false;

    const referenceWords = [
        "this",
        "that",
        "it",
        "another",
        "remember",
        "nhớ",
        "từ này",
        "từ đó",
        "câu này",
        "câu đó",
        "bài này",
        "bài đó",
        "chủ đề này",
        "chủ đề đó",
        "nó",
    ];

    return referenceWords.some((w) => msg.includes(w));
};

/**
 * Kiểm tra history conversation có nội dung học tiếng Anh và câu hỏi có tham chiếu
 * tới nội dung đang trao đổi trong history hay không.
 */
const hasLearningHistory = (historyMessages, msg) => {
    if (!Array.isArray(historyMessages) || historyMessages.length === 0) return false;

    const historyText = historyMessages
        .filter((m) => m && m.content && typeof m.content === "string")
        .map((m) => m.content.toLowerCase())
        .join(" ")
        .trim();

    if (!historyText) return false;

    const historyHasLearningContent = englishLearningKeywords.some((keyword) =>
        historyText.includes(keyword)
    );
    if (!historyHasLearningContent) return false;

    const referenceWords = [
        "this",
        "that",
        "it",
        "another",
        "more",
        "again",
        "remember",
        "nhớ",
        "từ này",
        "từ đó",
        "câu này",
        "câu đó",
        "bài này",
        "bài đó",
        "chủ đề này",
        "chủ đề đó",
        "nó",
        "tiếp",
        "nữa",
    ];

    return referenceWords.some((w) => msg.includes(w));
};

/**
 * Kiểm tra câu hỏi có RÕ RÀNG thuộc lĩnh vực ngoài phạm vi hay không.
 */
const isClearlyOutOfScope = (msg) => {
    if (outOfScopeKeywords.some((keyword) => msg.includes(keyword))) return true;
    if (outOfScopePatterns.some((pattern) => pattern.test(msg))) return true;
    return false;
};

/**
 * Kiểm tra xem một câu hỏi/tin nhắn của người dùng có nằm ngoài phạm vi hỗ trợ học tiếng Anh/WordMate hay không.
 *
 * Logic 3 tầng:
 * - Tầng 1: Context học tập hiện tại (vocabulary/topic/quiz/page) và History có nội dung học tiếng Anh,
 *           kết hợp với câu hỏi có tham chiếu tới nội dung đang học → hợp lệ (không reject).
 * - Tầng 2: Chỉ reject khi câu hỏi RÕ RÀNG ngoài phạm vi (lập trình, nấu ăn, thời tiết, thể thao,
 *           kiến thức tổng quát...). Không dùng các từ chung như "what", "why", "how", "can", "explain".
 * - Tầng 3: Không chắc chắn → không reject, cho phép gọi Gemini. System prompt yêu cầu Gemini chỉ hỗ trợ
 *           học tiếng Anh/WordMate và từ chối thân thiện nếu câu hỏi ngoài phạm vi.
 *
 * @param {string} message - Tin nhắn của người dùng
 * @param {object} [options] - Tùy chọn
 * @param {object} [options.context] - Ngữ cảnh học tập hiện tại từ Frontend
 * @param {object[]} [options.historyMessages] - Lịch sử hội thoại gần nhất
 * @returns {boolean} true nếu câu hỏi ngoài phạm vi, ngược lại false
 */
const isOutOfScope = (message, { context, historyMessages } = {}) => {
    if (!message || typeof message !== "string") return true;
    const msg = message.toLowerCase().trim();
    if (!msg) return true;

    // Câu hỏi có intent học tiếng Anh/từ vựng/ngữ pháp rõ ràng → hợp lệ
    if (hasEnglishLearningIntent(msg)) return false;

    // Lời chào hỏi/thăm hỏi ngắn → hợp lệ
    if (isGreeting(msg)) return false;

    // Tầng 1 — Context học tập hiện tại: câu hỏi có tham chiếu tới nội dung đang học
    if (hasLearningContext(context, msg)) return false;

    // Tầng 1 — History: câu hỏi có tham chiếu tới nội dung đang trao đổi trong history
    if (hasLearningHistory(historyMessages, msg)) return false;

    // Tầng 2 — Chặn các trường hợp rõ ràng ngoài phạm vi
    if (isClearlyOutOfScope(msg)) return true;

    // Tầng 3 — Không chắc chắn → không reject, để Gemini quyết định (Gemini sẽ từ chối nếu ngoài phạm vi)
    return false;
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

    // 3. Lấy tối đa 10 tin nhắn gần nhất làm lịch sử hội thoại
    //    (lấy TRƯỚC khi kiểm tra out-of-scope để tầng 1 có thể dùng history)
    let historyMessages = [];
    try {
        historyMessages = await aiModel.getMessagesByConversation(currentConversationId, 10);
    } catch (dbErr) {
        console.error("Lỗi khi truy vấn lịch sử hội thoại từ database:", dbErr);
        const error = new Error("Lỗi cơ sở dữ liệu khi lấy lịch sử hội thoại");
        error.status = 500;
        throw error;
    }

    // 4. Kiểm tra câu hỏi ngoài phạm vi trước khi gọi Gemini
    //    Nếu out-of-scope: không gọi Gemini, không lưu message, trả về gợi ý.
    if (isOutOfScope(message, { context, historyMessages })) {
        return {
            conversation_id: currentConversationId,
            outOfScope: true,
            showSuggestions: true,
            reply: "Xin lỗi, mình chỉ có thể hỗ trợ các câu hỏi liên quan đến việc học tiếng Anh trong WordMate.",
            role: "assistant",
        };
    }

    // 5. System prompt
    const systemPrompt = `Bạn là WordMate AI, một trợ lý hỗ trợ học tiếng Anh chuyên nghiệp tích hợp trong ứng dụng WordMate.
Nhiệm vụ của bạn là hỗ trợ người dùng học tiếng Anh hiệu quả: giải thích từ vựng, ngữ pháp, cung cấp câu ví dụ, giải thích các câu hỏi/quiz và nội dung đang học.
Bạn CHỈ được phép hỗ trợ các nội dung liên quan đến: học tiếng Anh, từ vựng, ngữ pháp, câu ví dụ, và nội dung WordMate (topic/vocabulary/quiz mà người dùng đang học).
Nếu người dùng hỏi nội dung hoàn toàn không liên quan (ví dụ: lập trình, nấu ăn, thời tiết, thể thao, tin tức, sức khỏe, giải trí...), hãy TỪ CHỐI một cách thân thiện bằng tiếng Việt, giải thích rằng bạn chỉ hỗ trợ việc học tiếng Anh trong WordMate, và KHÔNG trả lời nội dung ngoài phạm vi.
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

    const model = process.env.GEMINI_MODEL;
    if (!model) {
        const error = new Error("Dịch vụ AI chưa được cấu hình model Gemini. Vui lòng thiết lập GEMINI_MODEL trong .env");
        error.status = 500;
        throw error;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
    isOutOfScope,
};