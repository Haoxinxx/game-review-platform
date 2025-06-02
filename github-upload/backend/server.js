const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
    origin: 'http://localhost:8080', // 前端地址
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session配置
app.use(session({
    secret: process.env.SESSION_SECRET || 'game-review-platform-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // 开发环境设为false
        maxAge: 24 * 60 * 60 * 1000 // 24小时
    }
}));

// 静态文件服务 - 为前端提供服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 数据库连接配置
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'game_review_platform',
    charset: 'utf8mb4'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// 测试数据库连接
async function testConnection() {
    try {
        console.log('🔍 正在测试数据库连接...');
        console.log('数据库配置:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database
        });
        const [rows] = await promisePool.execute('SELECT 1 as test');
        console.log('✅ 数据库连接成功');
        console.log('测试查询结果:', rows);
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        console.error('错误详情:', error);
    }
}

// 认证中间件
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: '请先登录' });
    }
}

// API路由

// 用户注册
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 基本验证
        if (!username || !email || !password) {
            return res.status(400).json({ error: '用户名、邮箱和密码都是必填项' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: '密码长度至少6位' });
        }
        
        // 检查用户名和邮箱是否已存在
        const [existingUsers] = await promisePool.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: '用户名或邮箱已存在' });
        }
        
        // 密码哈希
        const passwordHash = crypto.createHash('sha256').update(password + 'game-review-salt').digest('hex');
        
        // 插入新用户
        const [result] = await promisePool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );
        
        res.status(201).json({
            message: '注册成功',
            userId: result.insertId
        });
        
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 用户登录
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码都是必填项' });
        }
        
        // 查找用户
        const [users] = await promisePool.execute(
            'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?',
            [username, username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        const user = users[0];
        
        // 验证密码
        const hashedPassword = crypto.createHash('sha256').update(password + 'game-review-salt').digest('hex');
        const isValidPassword = hashedPassword === user.password_hash;
        
        if (!isValidPassword) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 设置session
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({
            message: '登录成功',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 用户登出
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: '登出失败' });
        }
        res.json({ message: '登出成功' });
    });
});

// 获取当前用户信息
app.get('/api/user', requireAuth, async (req, res) => {
    try {
        const [users] = await promisePool.execute(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [req.session.userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        res.json({ user: users[0] });
        
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取所有游戏列表
app.get('/api/games', async (req, res) => {
    try {
        const { search, sortBy = 'name', order = 'ASC' } = req.query;

        let query = 'SELECT id, name, platform, description, cover_url, avg_rating, review_count FROM games';
        let params = [];

        // 搜索功能
        if (search) {
            query += ' WHERE name LIKE ?';
            params.push(`%${search}%`);
        }

        // 排序
        const validSortFields = ['name', 'avg_rating', 'review_count', 'created_at'];
        const validOrder = ['ASC', 'DESC'];

        if (validSortFields.includes(sortBy) && validOrder.includes(order.toUpperCase())) {
            query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
        }

        const [games] = await promisePool.execute(query, params);
        res.json({ games });

    } catch (error) {
        console.error('获取游戏列表错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取单个游戏详情
app.get('/api/games/:id', async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);

        if (isNaN(gameId)) {
            return res.status(400).json({ error: '无效的游戏ID' });
        }

        // 获取游戏信息
        const [games] = await promisePool.execute(
            'SELECT id, name, platform, description, cover_url, avg_rating, review_count, created_at FROM games WHERE id = ?',
            [gameId]
        );

        if (games.length === 0) {
            return res.status(404).json({ error: '游戏不存在' });
        }

        res.json({ game: games[0] });

    } catch (error) {
        console.error('获取游戏详情错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取游戏评论
app.get('/api/games/:id/comments', async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);

        if (isNaN(gameId)) {
            return res.status(400).json({ error: '无效的游戏ID' });
        }

        const [comments] = await promisePool.execute(
            `SELECT c.id, c.rating, c.content, c.created_at, u.username
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.game_id = ?
             ORDER BY c.created_at DESC`,
            [gameId]
        );

        res.json({ comments });

    } catch (error) {
        console.error('获取游戏评论错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 发布游戏评论
app.post('/api/comments', requireAuth, async (req, res) => {
    try {
        const { gameId, rating, content } = req.body;
        const userId = req.session.userId;

        // 验证输入
        if (!gameId || !rating) {
            return res.status(400).json({ error: '游戏ID和评分是必填项' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: '评分必须在1-5之间' });
        }

        // 检查游戏是否存在
        const [games] = await promisePool.execute(
            'SELECT id FROM games WHERE id = ?',
            [gameId]
        );

        if (games.length === 0) {
            return res.status(404).json({ error: '游戏不存在' });
        }

        // 检查用户是否已经评论过这个游戏
        const [existingComments] = await promisePool.execute(
            'SELECT id FROM comments WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );

        if (existingComments.length > 0) {
            return res.status(400).json({ error: '您已经评论过这个游戏了' });
        }

        // 插入评论
        const [result] = await promisePool.execute(
            'INSERT INTO comments (user_id, game_id, rating, content) VALUES (?, ?, ?, ?)',
            [userId, gameId, rating, content || '']
        );

        // 更新游戏的平均评分和评论数量
        await updateGameRating(gameId);

        res.status(201).json({
            message: '评论发布成功',
            commentId: result.insertId
        });

    } catch (error) {
        console.error('发布评论错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 更新游戏评分的辅助函数
async function updateGameRating(gameId) {
    try {
        const [stats] = await promisePool.execute(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM comments WHERE game_id = ?',
            [gameId]
        );

        const avgRating = parseFloat(stats[0].avg_rating).toFixed(2);
        const reviewCount = stats[0].review_count;

        await promisePool.execute(
            'UPDATE games SET avg_rating = ?, review_count = ? WHERE id = ?',
            [avgRating, reviewCount, gameId]
        );

    } catch (error) {
        console.error('更新游戏评分错误:', error);
    }
}

// 游戏搜索API
app.get('/api/games/search', async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: '搜索关键词不能为空' });
        }

        const [games] = await promisePool.execute(
            'SELECT id, name, platform, description, cover_url, avg_rating, review_count FROM games WHERE name LIKE ? ORDER BY avg_rating DESC',
            [`%${name}%`]
        );

        res.json({ games });

    } catch (error) {
        console.error('搜索游戏错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 前端路由 - 所有非API请求都返回index.html
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    testConnection();
});

module.exports = app;
