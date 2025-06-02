// API工具类 - 处理所有后端API调用

class API {
    constructor() {
        this.baseURL = window.location.origin;
    }

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            credentials: 'include', // 包含cookies用于session
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }

    // GET请求
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    // POST请求
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT请求
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE请求
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // 用户认证相关API
    async register(userData) {
        return this.post('/api/register', userData);
    }

    async login(credentials) {
        return this.post('/api/login', credentials);
    }

    async logout() {
        return this.post('/api/logout');
    }

    async getCurrentUser() {
        return this.get('/api/user');
    }

    // 游戏相关API
    async getGames(params = {}) {
        return this.get('/api/games', params);
    }

    async getGame(gameId) {
        return this.get(`/api/games/${gameId}`);
    }

    async searchGames(searchTerm) {
        return this.get('/api/games/search', { name: searchTerm });
    }

    // 评论相关API
    async getGameComments(gameId) {
        return this.get(`/api/games/${gameId}/comments`);
    }

    async postComment(commentData) {
        return this.post('/api/comments', commentData);
    }
}

// 创建全局API实例
window.api = new API();

// 工具函数
class Utils {
    // 显示消息提示
    static showToast(message, type = 'success') {
        const toast = document.getElementById('messageToast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');

        // 3秒后自动隐藏
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // 格式化日期
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 生成星级评分HTML
    static generateStars(rating, maxStars = 5) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }

        if (hasHalfStar) {
            starsHTML += '☆';
        }

        const emptyStars = maxStars - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }

        return starsHTML;
    }

    // 截断文本
    static truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // 验证邮箱格式
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 显示加载状态
    static showLoading() {
        const loading = document.getElementById('loadingSpinner');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    // 隐藏加载状态
    static hideLoading() {
        const loading = document.getElementById('loadingSpinner');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    // 页面切换
    static showPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示指定页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    // 滚动到顶部
    static scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 将Utils添加到全局
window.Utils = Utils;
