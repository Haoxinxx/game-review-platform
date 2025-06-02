// 游戏管理

class GamesManager {
    constructor() {
        this.games = [];
        this.currentGame = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadGames();
    }

    // 绑定事件监听器
    bindEvents() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        // 防抖搜索
        const debouncedSearch = Utils.debounce(() => {
            this.handleSearch();
        }, 500);

        searchInput.addEventListener('input', debouncedSearch);
        searchBtn.addEventListener('click', () => this.handleSearch());

        // 回车搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // 排序功能
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // 返回游戏列表按钮
        document.getElementById('backToListBtn').addEventListener('click', () => {
            this.showGameList();
        });
    }

    // 加载游戏列表
    async loadGames(params = {}) {
        try {
            Utils.showLoading();
            const response = await api.getGames(params);
            this.games = response.games;
            this.renderGameGrid();
        } catch (error) {
            Utils.showToast('加载游戏列表失败', 'error');
            console.error('加载游戏列表错误:', error);
        } finally {
            Utils.hideLoading();
        }
    }

    // 渲染游戏网格
    renderGameGrid() {
        const gameGrid = document.getElementById('gameGrid');
        
        if (this.games.length === 0) {
            gameGrid.innerHTML = `
                <div class="no-games">
                    <p>暂无游戏数据</p>
                </div>
            `;
            return;
        }

        gameGrid.innerHTML = this.games.map(game => this.createGameCard(game)).join('');

        // 绑定游戏卡片点击事件
        gameGrid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = parseInt(card.dataset.gameId);
                this.showGameDetail(gameId);
            });
        });
    }

    // 创建游戏卡片HTML
    createGameCard(game) {
        const stars = Utils.generateStars(game.avg_rating);
        const description = Utils.truncateText(game.description || '暂无描述', 100);

        // 创建图片HTML，如果有cover_url就显示图片，否则显示占位符
        const imageHTML = game.cover_url ?
            `<img src="${game.cover_url}" alt="${game.name}"
                  onload="this.classList.add('loaded')"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder" style="display:none;">🎮</div>` :
            `<div class="placeholder">🎮</div>`;

        return `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-card-image">
                    ${imageHTML}
                </div>
                <div class="game-card-content">
                    <h3 class="game-card-title">${game.name}</h3>
                    <p class="game-card-platform">${game.platform}</p>
                    <p class="game-card-description">${description}</p>
                    <div class="game-card-footer">
                        <div class="game-rating">
                            <span class="rating-stars">${stars}</span>
                            <span class="rating-value">${game.avg_rating}</span>
                        </div>
                        <span class="review-count">${game.review_count} 评论</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 处理搜索
    async handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        
        if (searchTerm) {
            try {
                Utils.showLoading();
                const response = await api.searchGames(searchTerm);
                this.games = response.games;
                this.renderGameGrid();
            } catch (error) {
                Utils.showToast('搜索失败', 'error');
                console.error('搜索错误:', error);
            } finally {
                Utils.hideLoading();
            }
        } else {
            // 如果搜索框为空，重新加载所有游戏
            this.loadGames();
        }
    }

    // 处理排序
    handleSort(sortValue) {
        const [sortBy, order] = sortValue.split('-');
        this.loadGames({ sortBy, order });
    }

    // 显示游戏详情
    async showGameDetail(gameId) {
        try {
            Utils.showLoading();
            
            // 获取游戏详情
            const gameResponse = await api.getGame(gameId);
            this.currentGame = gameResponse.game;
            
            // 渲染游戏详情
            this.renderGameDetail();
            
            // 加载评论
            await window.commentsManager.loadComments(gameId);
            
            // 切换到详情页
            Utils.showPage('gameDetailPage');
            Utils.scrollToTop();
            
        } catch (error) {
            Utils.showToast('加载游戏详情失败', 'error');
            console.error('加载游戏详情错误:', error);
        } finally {
            Utils.hideLoading();
        }
    }

    // 渲染游戏详情
    renderGameDetail() {
        const gameDetail = document.getElementById('gameDetail');
        const game = this.currentGame;

        if (!game) return;

        const stars = Utils.generateStars(game.avg_rating);

        // 创建详情页图片HTML
        const imageHTML = game.cover_url ?
            `<img src="${game.cover_url}" alt="${game.name}"
                  onload="this.classList.add('loaded')"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder" style="display:none;">🎮</div>` :
            `<div class="placeholder">🎮</div>`;

        gameDetail.innerHTML = `
            <div class="game-detail-header">
                <div class="game-detail-image">
                    ${imageHTML}
                </div>
                <div class="game-detail-info">
                    <h1 class="game-detail-title">${game.name}</h1>
                    <p class="game-detail-platform">平台: ${game.platform}</p>
                    <div class="game-detail-rating">
                        <span class="detail-rating-stars">${stars}</span>
                        <span class="detail-rating-value">${game.avg_rating}</span>
                        <span class="detail-review-count">(${game.review_count} 条评论)</span>
                    </div>
                    <p class="game-detail-description">${game.description || '暂无描述'}</p>
                </div>
            </div>
        `;
    }

    // 显示游戏列表
    showGameList() {
        Utils.showPage('gameListPage');
        Utils.scrollToTop();
        
        // 清空搜索框
        document.getElementById('searchInput').value = '';
        
        // 重新加载游戏列表
        this.loadGames();
    }

    // 获取当前游戏
    getCurrentGame() {
        return this.currentGame;
    }
}

// 创建全局游戏管理器实例
window.gamesManager = new GamesManager();
