-- 游戏点评平台数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS game_review_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE game_review_platform;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- 创建游戏表
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    avg_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_avg_rating (avg_rating)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- 插入测试游戏数据
INSERT INTO games (name, platform, description, cover_url, avg_rating, review_count) VALUES
('塞尔达传说：王国之泪', 'Nintendo Switch', '在这个续作中，林克将踏上全新的冒险旅程，探索海拉鲁王国的天空与大地。拥有全新的能力系统和创造性玩法。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 4.8, 1250),
('艾尔登法环', 'PC, PS5, Xbox Series X/S', '由宫崎英高和乔治·R·R·马丁共同打造的开放世界动作RPG游戏。在广阔的交界地展开史诗般的冒险。', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop', 4.7, 2100),
('赛博朋克2077', 'PC, PS5, Xbox Series X/S', '在未来的夜之城中体验开放世界的冒险，成为传奇雇佣兵。经过多次更新，游戏体验大幅提升。', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', 4.2, 1800),
('原神', 'PC, Mobile, PS5', '开放世界冒险RPG，在提瓦特大陆上展开奇幻冒险。拥有精美的画面和丰富的角色系统。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 4.5, 3200),
('我的世界', 'PC, Mobile, Console', '沙盒建造游戏，在无限的世界中创造和探索。发挥你的想象力，建造属于自己的世界。', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=600&fit=crop', 4.6, 5000),
('英雄联盟', 'PC', '5v5团队战略游戏，与朋友一起在召唤师峡谷中战斗。拥有丰富的英雄选择和战术策略。', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop', 4.3, 2800),
('守望先锋2', 'PC, PS5, Xbox Series X/S', '团队射击游戏，选择英雄并与队友协作获得胜利。全新的PvP模式和英雄技能。', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', 4.1, 1600),
('动物森友会', 'Nintendo Switch', '在无人岛上建造属于自己的理想生活。与可爱的动物邻居们一起享受悠闲时光。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 4.4, 1400),
('只狼：影逝二度', 'PC, PS4, Xbox One', '在战国末期的日本，扮演忍者展开复仇之旅。挑战性极高的动作冒险游戏。', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop', 4.6, 1100),
('荒野大镖客：救赎2', 'PC, PS4, Xbox One', '在美国西部开拓时代体验亡命之徒的生活。拥有令人惊叹的开放世界和剧情。', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', 4.8, 1900);

-- 插入测试用户数据
INSERT INTO users (username, email, password_hash) VALUES
('testuser1', 'test1@example.com', '$2b$10$example_hash_1'),
('testuser2', 'test2@example.com', '$2b$10$example_hash_2'),
('gamer_pro', 'gamer@example.com', '$2b$10$example_hash_3');

-- 插入测试评论数据
INSERT INTO comments (user_id, game_id, rating, content) VALUES
(1, 1, 5, '塞尔达传说系列的又一神作！开放世界设计令人惊叹，每个角落都有惊喜等待发现。新的能力系统让游戏玩法更加丰富多样。'),
(2, 1, 5, '游戏的物理引擎和创造性玩法让人欲罢不能，强烈推荐！可以用各种方式解决谜题，自由度极高。'),
(3, 2, 5, '艾尔登法环完美结合了魂系列的挑战性和开放世界的自由度。BOSS战设计精彩，世界观宏大。'),
(1, 2, 4, '游戏难度较高，但成就感十足。画面和音乐都很棒，就是对新手不太友好。'),
(2, 3, 4, '经过多次更新后，游戏体验有了很大改善。夜之城很有魅力，剧情也很吸引人。'),
(3, 4, 5, '原神的世界观和角色设计都很出色，免费游戏中的佳作。画面精美，音乐动听。'),
(1, 5, 5, '我的世界永远不会过时，创造力的天堂！可以和朋友一起建造，乐趣无穷。'),
(2, 6, 4, '英雄联盟虽然学习曲线陡峭，但团队合作的乐趣无穷。竞技性很强，需要不断练习。'),
(3, 7, 3, '相比前作有所改进，但还有提升空间。英雄平衡性还需要调整。'),
(1, 8, 5, '动物森友会是放松心情的完美选择，画面温馨可爱。可以按照自己的节奏慢慢游玩。'),
(2, 9, 5, '只狼的战斗系统独特，需要精确的时机把握。虽然难度很高，但通关后成就感满满。'),
(3, 10, 5, '荒野大镖客2的开放世界令人震撼，细节丰富到令人惊叹。剧情感人，角色塑造出色。');
