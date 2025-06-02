// 用户认证管理

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    // 绑定事件监听器
    bindEvents() {
        // 登录按钮
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showLoginModal();
        });

        // 注册按钮
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showRegisterModal();
        });

        // 登出按钮
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // 提示登录按钮
        document.getElementById('promptLoginBtn').addEventListener('click', () => {
            this.showLoginModal();
        });

        // 登录表单提交
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // 注册表单提交
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // 模态框关闭事件
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModals();
            });
        });

        // 点击模态框外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // 消息提示关闭
        document.getElementById('toastClose').addEventListener('click', () => {
            document.getElementById('messageToast').classList.add('hidden');
        });
    }

    // 检查当前认证状态
    async checkAuthStatus() {
        try {
            const response = await api.getCurrentUser();
            this.currentUser = response.user;
            this.updateUI();
        } catch (error) {
            this.currentUser = null;
            this.updateUI();
        }
    }

    // 更新UI显示
    updateUI() {
        const userMenu = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        const username = document.getElementById('username');
        const commentForm = document.getElementById('commentForm');
        const loginPrompt = document.getElementById('loginPrompt');

        if (this.currentUser) {
            // 已登录状态
            userMenu.classList.remove('hidden');
            authButtons.classList.add('hidden');
            username.textContent = this.currentUser.username;

            // 显示评论表单，隐藏登录提示
            if (commentForm) commentForm.classList.remove('hidden');
            if (loginPrompt) loginPrompt.classList.add('hidden');
        } else {
            // 未登录状态
            userMenu.classList.add('hidden');
            authButtons.classList.remove('hidden');

            // 隐藏评论表单，显示登录提示
            if (commentForm) commentForm.classList.add('hidden');
            if (loginPrompt) loginPrompt.classList.remove('hidden');
        }
    }

    // 显示登录模态框
    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('loginUsername').focus();
    }

    // 显示注册模态框
    showRegisterModal() {
        document.getElementById('registerModal').classList.remove('hidden');
        document.getElementById('registerUsername').focus();
    }

    // 关闭所有模态框
    closeModals() {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('registerModal').classList.add('hidden');
        this.clearForms();
    }

    // 清空表单
    clearForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
    }

    // 处理登录
    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            Utils.showToast('请填写用户名和密码', 'error');
            return;
        }

        try {
            const response = await api.login({ username, password });
            this.currentUser = response.user;
            this.updateUI();
            this.closeModals();
            Utils.showToast('登录成功！', 'success');
        } catch (error) {
            Utils.showToast(error.message || '登录失败', 'error');
        }
    }

    // 处理注册
    async handleRegister() {
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 表单验证
        if (!username || !email || !password || !confirmPassword) {
            Utils.showToast('请填写所有字段', 'error');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Utils.showToast('请输入有效的邮箱地址', 'error');
            return;
        }

        if (password.length < 6) {
            Utils.showToast('密码长度至少6位', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showToast('两次输入的密码不一致', 'error');
            return;
        }

        try {
            await api.register({ username, email, password });
            Utils.showToast('注册成功！请登录', 'success');
            this.closeModals();
            setTimeout(() => {
                this.showLoginModal();
                document.getElementById('loginUsername').value = username;
            }, 1000);
        } catch (error) {
            Utils.showToast(error.message || '注册失败', 'error');
        }
    }

    // 登出
    async logout() {
        try {
            await api.logout();
            this.currentUser = null;
            this.updateUI();
            Utils.showToast('已成功登出', 'success');
            
            // 如果在游戏详情页，刷新评论区域
            if (document.getElementById('gameDetailPage').classList.contains('active')) {
                window.commentsManager.updateCommentForm();
            }
        } catch (error) {
            Utils.showToast('登出失败', 'error');
        }
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否已登录
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// 创建全局认证管理器实例
window.authManager = new AuthManager();
