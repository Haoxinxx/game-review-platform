// 评论管理

class CommentsManager {
    constructor() {
        this.comments = [];
        this.currentRating = 0;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    // 绑定事件监听器
    bindEvents() {
        // 星级评分点击事件
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(parseInt(e.target.dataset.rating));
            });

            star.addEventListener('mouseenter', (e) => {
                this.highlightStars(parseInt(e.target.dataset.rating));
            });
        });

        // 星级评分区域鼠标离开事件
        document.querySelector('.star-rating').addEventListener('mouseleave', () => {
            this.highlightStars(this.currentRating);
        });

        // 提交评论按钮
        document.getElementById('submitCommentBtn').addEventListener('click', () => {
            this.submitComment();
        });

        // 取消评论按钮
        document.getElementById('cancelCommentBtn').addEventListener('click', () => {
            this.clearCommentForm();
        });
    }

    // 加载游戏评论
    async loadComments(gameId) {
        try {
            const response = await api.getGameComments(gameId);
            this.comments = response.comments;
            this.renderComments();
            this.updateCommentForm();
        } catch (error) {
            Utils.showToast('加载评论失败', 'error');
            console.error('加载评论错误:', error);
        }
    }

    // 渲染评论列表
    renderComments() {
        const commentsList = document.getElementById('commentsList');
        
        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <p>暂无评论，快来发表第一条评论吧！</p>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = this.comments.map(comment => this.createCommentHTML(comment)).join('');
    }

    // 创建评论HTML
    createCommentHTML(comment) {
        const stars = Utils.generateStars(comment.rating);
        const formattedDate = Utils.formatDate(comment.created_at);

        return `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-author">${comment.username}</div>
                    <div class="comment-rating">
                        <span class="comment-stars">${stars}</span>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="comment-content">${comment.content || '用户没有留下文字评论'}</div>
            </div>
        `;
    }

    // 更新评论表单显示状态
    updateCommentForm() {
        const commentForm = document.getElementById('commentForm');
        const loginPrompt = document.getElementById('loginPrompt');

        if (window.authManager.isLoggedIn()) {
            commentForm.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
        } else {
            commentForm.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
        }
    }

    // 设置评分
    setRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
        document.getElementById('ratingValue').textContent = rating;
    }

    // 高亮星星
    highlightStars(rating) {
        document.querySelectorAll('.star').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // 提交评论
    async submitComment() {
        const currentGame = window.gamesManager.getCurrentGame();
        if (!currentGame) {
            Utils.showToast('游戏信息错误', 'error');
            return;
        }

        if (!window.authManager.isLoggedIn()) {
            Utils.showToast('请先登录', 'error');
            return;
        }

        if (this.currentRating === 0) {
            Utils.showToast('请选择评分', 'error');
            return;
        }

        const content = document.getElementById('commentContent').value.trim();

        try {
            const commentData = {
                gameId: currentGame.id,
                rating: this.currentRating,
                content: content
            };

            await api.postComment(commentData);
            Utils.showToast('评论发布成功！', 'success');
            
            // 清空表单
            this.clearCommentForm();
            
            // 重新加载评论
            await this.loadComments(currentGame.id);
            
            // 重新加载游戏详情以更新评分
            await window.gamesManager.showGameDetail(currentGame.id);
            
        } catch (error) {
            Utils.showToast(error.message || '评论发布失败', 'error');
            console.error('提交评论错误:', error);
        }
    }

    // 清空评论表单
    clearCommentForm() {
        this.currentRating = 0;
        this.highlightStars(0);
        document.getElementById('ratingValue').textContent = '0';
        document.getElementById('commentContent').value = '';
    }

    // 获取评论列表
    getComments() {
        return this.comments;
    }
}

// 创建全局评论管理器实例
window.commentsManager = new CommentsManager();
