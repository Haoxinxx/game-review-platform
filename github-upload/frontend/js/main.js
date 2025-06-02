// 主应用程序入口

class App {
    constructor() {
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.start();
            });
        } else {
            this.start();
        }
    }

    start() {
        console.log('🎮 游戏点评平台启动中...');
        
        // 初始化各个管理器
        this.initializeManagers();
        
        // 绑定全局事件
        this.bindGlobalEvents();
        
        // 设置初始页面状态
        this.setInitialState();
        
        console.log('✅ 游戏点评平台启动完成');
    }

    initializeManagers() {
        // 管理器已经在各自的文件中初始化
        // 这里可以进行额外的配置或依赖注入
        
        // 确保所有管理器都已正确初始化
        if (!window.authManager) {
            console.error('认证管理器初始化失败');
        }
        
        if (!window.gamesManager) {
            console.error('游戏管理器初始化失败');
        }
        
        if (!window.commentsManager) {
            console.error('评论管理器初始化失败');
        }
    }

    bindGlobalEvents() {
        // 全局键盘事件
        document.addEventListener('keydown', (e) => {
            // ESC键关闭模态框
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // 全局错误处理
        window.addEventListener('error', (e) => {
            console.error('全局错误:', e.error);
            Utils.showToast('发生了一个错误，请刷新页面重试', 'error');
        });

        // 网络状态监听
        window.addEventListener('online', () => {
            Utils.showToast('网络连接已恢复', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showToast('网络连接已断开', 'warning');
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // 页面重新可见时，检查认证状态
                window.authManager.checkAuthStatus();
            }
        });
    }

    setInitialState() {
        // 显示游戏列表页面
        Utils.showPage('gameListPage');
        
        // 检查URL参数，支持直接访问游戏详情页
        this.handleInitialRoute();
    }

    handleInitialRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('game');
        
        if (gameId) {
            // 如果URL中有游戏ID，直接显示游戏详情
            window.gamesManager.showGameDetail(parseInt(gameId));
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        // 清空表单
        window.authManager.clearForms();
    }

    // 应用程序状态管理
    getAppState() {
        return {
            currentUser: window.authManager.getCurrentUser(),
            currentGame: window.gamesManager.getCurrentGame(),
            isLoggedIn: window.authManager.isLoggedIn()
        };
    }

    // 调试信息
    debug() {
        console.log('应用状态:', this.getAppState());
        console.log('当前页面:', document.querySelector('.page.active')?.id);
    }
}

// 创建并启动应用
window.app = new App();

// 开发环境下的调试工具
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // 添加调试快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + D 显示调试信息
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            window.app.debug();
        }
    });
    
    // 在控制台中提供调试工具
    window.debug = {
        app: window.app,
        auth: window.authManager,
        games: window.gamesManager,
        comments: window.commentsManager,
        api: window.api,
        utils: window.Utils
    };
    
    console.log('🔧 调试模式已启用，使用 window.debug 访问调试工具');
}
