-- ============================================================
-- WordMate Seed Data
-- MySQL 8.0+ / MariaDB 10.3+
-- ============================================================
-- Chứa dữ liệu mẫu cho:
-- - 3 Roadmaps: Basic English, TOEIC, Phrasal Verb & Idiom
-- - Mỗi Roadmap có 3 Topics
-- - Mỗi Topic có 5 Vocabularies
-- Tổng: 3 Roadmaps, 9 Topics, 45 Vocabularies
-- ============================================================

USE wordmate;

-- ============================================================
-- 1. ROADMAPS
-- ============================================================
INSERT INTO roadmaps (name, description, image, is_active, sort_order) VALUES
('Basic English', 'Lộ trình học tiếng Anh cơ bản cho người mới bắt đầu. Bao gồm các chủ đề cơ bản như lời chào, gia đình, hoạt động hàng ngày.', 'basic-english.jpg', 1, 1),
('TOEIC', 'Lộ trình luyện thi TOEIC với các chủ đề thường gặp trong đề thi: công việc, hội họp, du lịch.', 'toeic.jpg', 1, 2),
('Phrasal Verb & Idiom', 'Lộ trình học cụm động từ và thành ngữ tiếng Anh thông dụng trong giao tiếp hàng ngày và công việc.', 'phrasal-verb-idiom.jpg', 1, 3);

-- ============================================================
-- 2. TOPICS
-- ============================================================
-- Topics cho Basic English (roadmap_id = 1)
INSERT INTO topics (roadmap_id, name, description, image, sort_order, is_active) VALUES
(1, 'Greetings', 'Các cách chào hỏi cơ bản trong tiếng Anh', 'greetings.jpg', 1, 1),
(1, 'Family', 'Từ vựng về gia đình và các thành viên', 'family.jpg', 2, 1),
(1, 'Daily Activities', 'Các hoạt động hàng ngày thường gặp', 'daily-activities.jpg', 3, 1);

-- Topics cho TOEIC (roadmap_id = 2)
INSERT INTO topics (roadmap_id, name, description, image, sort_order, is_active) VALUES
(2, 'Business Meeting', 'Từ vựng về cuộc họp và hội nghị', 'business-meeting.jpg', 1, 1),
(2, 'Travel', 'Từ vựng về du lịch và đi lại', 'travel.jpg', 2, 1),
(2, 'Office Communication', 'Từ vựng về giao tiếp văn phòng', 'office-communication.jpg', 3, 1);

-- Topics cho Phrasal Verb & Idiom (roadmap_id = 3)
INSERT INTO topics (roadmap_id, name, description, image, sort_order, is_active) VALUES
(3, 'Common Phrasal Verbs', 'Các cụm động từ thông dụng', 'common-phrasal-verbs.jpg', 1, 1),
(3, 'Business Idioms', 'Thành ngữ thường dùng trong công việc', 'business-idioms.jpg', 2, 1),
(3, 'Everyday Idioms', 'Thành ngữ thông dụng trong đời sống', 'everyday-idioms.jpg', 3, 1);

-- ============================================================
-- 3. VOCABULARIES
-- ============================================================

-- ============================================================
-- Topic: Greetings (topic_id = 1)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(1, 'hello', '/həˈloʊ/', 'other', 'Xin chào', 'Hello, how are you?', 'Xin chào, bạn khỏe không?', 'hello.mp3', 'hello.jpg'),
(1, 'good morning', '/ɡʊd ˈmɔːrnɪŋ/', 'other', 'Chào buổi sáng', 'Good morning! Did you sleep well?', 'Chào buổi sáng! Bạn ngủ ngon không?', 'good-morning.mp3', 'good-morning.jpg'),
(1, 'good afternoon', '/ɡʊd ˌæftərˈnuːn/', 'other', 'Chào buổi chiều', 'Good afternoon, sir. Welcome to our office.', 'Chào buổi chiều, thưa ông. Chào mừng đến văn phòng chúng tôi.', 'good-afternoon.mp3', 'good-afternoon.jpg'),
(1, 'good evening', '/ɡʊd ˈiːvnɪŋ/', 'other', 'Chào buổi tối', 'Good evening! Would you like to order now?', 'Chào buổi tối! Bạn có muốn gọi món không?', 'good-evening.mp3', 'good-evening.jpg'),
(1, 'how are you', '/haʊ ɑːr juː/', 'other', 'Bạn khỏe không?', 'Hi! How are you doing today?', 'Chào! Bạn hôm nay thế nào?', 'how-are-you.mp3', 'how-are-you.jpg');

-- ============================================================
-- Topic: Family (topic_id = 2)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(2, 'father', '/ˈfɑːðər/', 'noun', 'Cha', 'My father is a teacher.', 'Cha tôi là một giáo viên.', 'father.mp3', 'father.jpg'),
(2, 'mother', '/ˈmʌðər/', 'noun', 'Mẹ', 'My mother cooks delicious food.', 'Mẹ tôi nấu ăn rất ngon.', 'mother.mp3', 'mother.jpg'),
(2, 'brother', '/ˈbrʌðər/', 'noun', 'Anh trai/em trai', 'I have one brother and one sister.', 'Tôi có một anh trai và một chị gái.', 'brother.mp3', 'brother.jpg'),
(2, 'sister', '/ˈsɪstər/', 'noun', 'Chị gái/em gái', 'My sister is studying medicine.', 'Chị gái tôi đang học y.', 'sister.mp3', 'sister.jpg'),
(2, 'grandparents', '/ˈɡrændˌperənts/', 'noun', 'Ông bà', 'I visit my grandparents every weekend.', 'Tôi đến thăm ông bà mỗi cuối tuần.', 'grandparents.mp3', 'grandparents.jpg');

-- ============================================================
-- Topic: Daily Activities (topic_id = 3)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(3, 'wake up', '/weɪk ʌp/', 'phrasal_verb', 'Thức dậy', 'I wake up at 6 AM every day.', 'Tôi thức dậy lúc 6 giờ sáng mỗi ngày.', 'wake-up.mp3', 'wake-up.jpg'),
(3, 'have breakfast', '/hæv ˈbrekfəst/', 'other', 'Ăn sáng', 'I usually have breakfast at 7 AM.', 'Tôi thường ăn sáng lúc 7 giờ sáng.', 'have-breakfast.mp3', 'have-breakfast.jpg'),
(3, 'go to work', '/ɡoʊ tu wɜːrk/', 'other', 'Đi làm', 'I go to work by bus.', 'Tôi đi làm bằng xe buýt.', 'go-to-work.mp3', 'go-to-work.jpg'),
(3, 'have lunch', '/hæv lʌntʃ/', 'other', 'Ăn trưa', 'Let''s have lunch together.', 'Hãy ăn trưa cùng nhau.', 'have-lunch.mp3', 'have-lunch.jpg'),
(3, 'go home', '/ɡoʊ hoʊm/', 'other', 'Về nhà', 'I go home after work.', 'Tôi về nhà sau khi tan làm.', 'go-home.mp3', 'go-home.jpg');

-- ============================================================
-- Topic: Business Meeting (topic_id = 4)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(4, 'agenda', '/əˈdʒendə/', 'noun', 'Chương trình nghị sự', 'Please check the meeting agenda.', 'Vui lòng xem chương trình cuộc họp.', 'agenda.mp3', 'agenda.jpg'),
(4, 'conference', '/ˈkɑːnfərəns/', 'noun', 'Hội nghị', 'The conference will be held in Hanoi.', 'Hội nghị sẽ được tổ chức ở Hà Nội.', 'conference.mp3', 'conference.jpg'),
(4, 'presentation', '/ˌprezənˈteɪʃn/', 'noun', 'Bài thuyết trình', 'She gave an excellent presentation.', 'Cô ấy đã đưa ra một bài thuyết trình xuất sắc.', 'presentation.mp3', 'presentation.jpg'),
(4, 'deadline', '/ˈdedlaɪn/', 'noun', 'Hạn chót', 'The deadline for this project is Friday.', 'Hạn chót cho dự án này là thứ Sáu.', 'deadline.mp3', 'deadline.jpg'),
(4, 'meeting', '/ˈmiːtɪŋ/', 'noun', 'Cuộc họp', 'We have a meeting at 2 PM.', 'Chúng tôi có cuộc họp lúc 2 giờ chiều.', 'meeting.mp3', 'meeting.jpg');

-- ============================================================
-- Topic: Travel (topic_id = 5)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(5, 'passport', '/ˈpæspɔːrt/', 'noun', 'Hộ chiếu', 'Don''t forget your passport.', 'Đừng quên hộ chiếu của bạn.', 'passport.mp3', 'passport.jpg'),
(5, 'ticket', '/ˈtɪkɪt/', 'noun', 'Vé', 'I bought a round-trip ticket.', 'Tôi đã mua vé khứ hồi.', 'ticket.mp3', 'ticket.jpg'),
(5, 'luggage', '/ˈlʌɡɪdʒ/', 'noun', 'Hành lý', 'My luggage is very heavy.', 'Hành lý của tôi rất nặng.', 'luggage.mp3', 'luggage.jpg'),
(5, 'destination', '/ˌdestɪˈneɪʃn/', 'noun', 'Điểm đến', 'What is your destination?', 'Điểm đến của bạn là đâu?', 'destination.mp3', 'destination.jpg'),
(5, 'reservation', '/ˌrezərˈveɪʃn/', 'noun', 'Đặt chỗ', 'I have a hotel reservation.', 'Tôi có một đặt phòng khách sạn.', 'reservation.mp3', 'reservation.jpg');

-- ============================================================
-- Topic: Office Communication (topic_id = 6)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(6, 'email', '/ˈiːmeɪl/', 'noun', 'Thư điện tử', 'I sent you an email yesterday.', 'Tôi đã gửi cho bạn một email hôm qua.', 'email.mp3', 'email.jpg'),
(6, 'schedule', '/ˈskedʒuːl/', 'noun', 'Lịch trình', 'Can you send me the schedule?', 'Bạn có thể gửi lịch trình cho tôi không?', 'schedule.mp3', 'schedule.jpg'),
(6, 'report', '/rɪˈpɔːrt/', 'noun', 'Báo cáo', 'I need to finish the report by Friday.', 'Tôi cần hoàn thành báo cáo trước thứ Sáu.', 'report.mp3', 'report.jpg'),
(6, 'colleague', '/ˈkɒliːɡ/', 'noun', 'Đồng nghiệp', 'My colleague helped me with the project.', 'Đồng nghiệp của tôi đã giúp tôi với dự án.', 'colleague.mp3', 'colleague.jpg'),
(6, 'department', '/dɪˈpɑːrtmənt/', 'noun', 'Phòng ban', 'She works in the HR department.', 'Cô ấy làm việc ở phòng nhân sự.', 'department.mp3', 'department.jpg');

-- ============================================================
-- Topic: Common Phrasal Verbs (topic_id = 7)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(7, 'look up', '/lʊk ʌp/', 'phrasal_verb', 'Tra cứu', 'Please look up this word in the dictionary.', 'Vui lòng tra từ này trong từ điển.', 'look-up.mp3', 'look-up.jpg'),
(7, 'turn on', '/tɜːrn ɒn/', 'phrasal_verb', 'Bật (thiết bị)', 'Please turn on the lights.', 'Vui lòng bật đèn lên.', 'turn-on.mp3', 'turn-on.jpg'),
(7, 'turn off', '/tɜːrn ɒf/', 'phrasal_verb', 'Tắt (thiết bị)', 'Don''t forget to turn off the computer.', 'Đừng quên tắt máy tính.', 'turn-off.mp3', 'turn-off.jpg'),
(7, 'pick up', '/pɪk ʌp/', 'phrasal_verb', 'Đón/ nhặt lên', 'I will pick you up at 8 PM.', 'Tôi sẽ đón bạn lúc 8 giờ tối.', 'pick-up.mp3', 'pick-up.jpg'),
(7, 'give up', '/ɡɪv ʌp/', 'phrasal_verb', 'Từ bỏ', 'Never give up on your dreams.', 'Không bao giờ từ bỏ ước mơ của bạn.', 'give-up.mp3', 'give-up.jpg');

-- ============================================================
-- Topic: Business Idioms (topic_id = 8)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(8, 'break even', '/breɪk ˈiːvn/', 'idiom', 'Hòa vốn', 'The company finally broke even last month.', 'Công ty cuối cùng đã hòa vốn tháng trước.', 'break-even.mp3', 'break-even.jpg'),
(8, 'cut corners', '/kʌt ˈkɔːrnərz/', 'idiom', 'Cắt giảm chi phí/tiết kiệm', 'Don''t cut corners on safety.', 'Đừng cắt giảm về an toàn.', 'cut-corners.mp3', 'cut-corners.jpg'),
(8, 'get the ball rolling', '/ɡet ðə bɔːl ˈroʊlɪŋ/', 'idiom', 'Bắt đầu', 'Let''s get the ball rolling on this project.', 'Hãy bắt đầu dự án này.', 'get-the-ball-rolling.mp3', 'get-the-ball-rolling.jpg'),
(8, 'hit the nail on the head', '/hɪt ðə neɪl ɒn ðə hed/', 'idiom', 'Nói đúng trọng tâm', 'You hit the nail on the head with that comment.', 'Bạn đã nói đúng trọng tâm với nhận xét đó.', 'hit-the-nail-on-the-head.mp3', 'hit-the-nail-on-the-head.jpg'),
(8, 'think outside the box', '/θɪŋk ˌaʊtsaɪd ðə bɒks/', 'idiom', 'Tư duy sáng tạo', 'We need to think outside the box to solve this.', 'Chúng ta cần tư duy sáng tạo để giải quyết vấn đề này.', 'think-outside-the-box.mp3', 'think-outside-the-box.jpg');

-- ============================================================
-- Topic: Everyday Idioms (topic_id = 9)
-- ============================================================
INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image) VALUES
(9, 'piece of cake', '/piːs ʌv keɪk/', 'idiom', 'Đơn giản, dễ dàng', 'The exam was a piece of cake.', 'Bài kiểm tra thật dễ dàng.', 'piece-of-cake.mp3', 'piece-of-cake.jpg'),
(9, 'under the weather', '/ˈʌndər ðə ˈweðər/', 'idiom', 'Không khỏe, bị ốm', 'I''m feeling a bit under the weather today.', 'Hôm nay tôi cảm thấy hơi không khỏe.', 'under-the-weather.mp3', 'under-the-weather.jpg'),
(9, 'hit the books', '/hɪt ðə bʊks/', 'idiom', 'Học bài', 'I need to hit the books for the exam.', 'Tôi cần học bài cho kỳ thi.', 'hit-the-books.mp3', 'hit-the-books.jpg'),
(9, 'cost an arm and a leg', '/kɒst ən ɑːrm ənd ə leɡ/', 'idiom', 'Rất đắt', 'This car costs an arm and a leg.', 'Chiếc xe này đắt đỏ.', 'cost-an-arm-and-a-leg.mp3', 'cost-an-arm-and-a-leg.jpg'),
(9, 'once in a blue moon', '/wʌns ɪn ə bluː muːn/', 'idiom', 'Hiếm khi', 'I only see him once in a blue moon.', 'Tôi chỉ gặp anh ấy hiếm khi.', 'once-in-a-blue-moon.mp3', 'once-in-a-blue-moon.jpg');

-- ============================================================
-- KẾT THÚC SEED DATA
-- ============================================================
-- Tổng kết:
-- - 3 Roadmaps
-- - 9 Topics (3 topics mỗi roadmap)
-- - 45 Vocabularies (5 vocabularies mỗi topic)
-- ============================================================