-- Multilingual Demo Data with UTF-8 characters
INSERT INTO books (id, title, alternate_title, author, description, primary_genre, original_language, publication_year, page_count, cover_image_url, average_rating, rating_count, is_featured, is_trending) VALUES
(1, 'Ponniyin Selvan', 'பொன்னியின் செல்வன்', 'Kalki Krishnamurthy', 'Epic Chola historical masterpiece.', 'Historical Fiction', 'Tamil', 1954, 2200, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', 4.9, 14200, TRUE, TRUE),
(2, 'Dune', 'Dune: First Book', 'Frank Herbert', 'Masterpiece of desert planet Arrakis and spice.', 'Sci-Fi', 'English', 1965, 688, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', 4.7, 28500, TRUE, TRUE),
(3, 'The God of Small Things', 'ദ ഗോഡ് ഓഫ് സ്മോൾ തിങ്സ്', 'Arundhati Roy', 'Booker Prize winning novel set in Kerala.', 'Fiction', 'English', 1997, 340, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600', 4.5, 16800, FALSE, TRUE),
(4, 'Godaan', 'गोदान', 'Munshi Premchand', 'Greatest classic Hindi social novel.', 'Classics', 'Hindi', 1936, 380, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 4.8, 9500, FALSE, FALSE),
(5, 'Gitanjali', 'গীতাঞ্জলি', 'Rabindranath Tagore', 'Nobel Prize winning devotional poetry.', 'Philosophy', 'Bengali', 1910, 120, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600', 4.8, 11200, FALSE, FALSE);

INSERT INTO movies (id, title, alternate_title, synopsis, director, original_language, release_year, runtime_minutes, poster_image_url, average_rating, rating_count, is_featured, is_trending) VALUES
(101, 'Interstellar', 'Interstellar', 'A journey through a Saturn wormhole to save humankind.', 'Christopher Nolan', 'English', 2014, 169, 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600', 4.9, 38200, TRUE, TRUE),
(102, 'Nayakan', 'நாயகன்', 'Slum kid rises to become Mumbai underground don.', 'Mani Ratnam', 'Tamil', 1987, 154, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600', 4.8, 18400, TRUE, TRUE),
(103, 'RRR', 'రౌద్రం రణం రుధిరం', 'Two Indian revolutionaries forge epic friendship against colonial rule.', 'S.S. Rajamouli', 'Telugu', 2022, 187, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600', 4.7, 32000, TRUE, TRUE),
(104, 'Manjummel Boys', 'മഞ്ഞുമ്മൽ ബോയ്സ്', 'Real-life Guna Caves rescue mission by Kerala friends.', 'Chidambaram', 'Malayalam', 2024, 135, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600', 4.8, 21500, FALSE, TRUE),
(105, 'Dangal', 'दंगल', 'Father trains daughters to world wrestling championship glory.', 'Nitesh Tiwari', 'Hindi', 2016, 161, 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600', 4.8, 42000, FALSE, TRUE);
