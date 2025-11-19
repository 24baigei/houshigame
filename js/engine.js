class GameEngine {
    constructor() {
        // 核心 UI 元素
        this.output = document.getElementById('terminal-output');
        this.choicesContainer = document.getElementById('choices-container');
        
        // 状态栏元素
        this.sanValueEl = document.getElementById('san-value');
        this.hpValueEl = document.getElementById('hp-value');
        this.moneyValueEl = document.getElementById('money-value');
        this.locationEl = document.getElementById('location');
        
        // 物品与任务
        this.inventoryListEl = document.getElementById('inventory-list');
        this.inventoryBarEl = document.getElementById('inventory-bar');
        this.questTrackerEl = document.getElementById('quest-tracker');
        this.activeQuestTextEl = document.getElementById('active-quest-text');
        
        // 侧边面板
        this.sidePanel = document.getElementById('side-panel');
        this.panelContent = document.getElementById('panel-content');
        this.panelTitle = document.getElementById('panel-title');

        // 游戏状态 (GameState v2.0)
        this.state = {
            currentNodeId: null,
            player: {
                sanity: 100,
                hp: 100,
                money: 0
            },
            inventory: [], // [{id: 'water', name: '杏仁水', count: 1, ...props}]
            flags: {}, // 剧情标记 { 'met_k': true, 'meg_rank': 1 }
            quests: {
                active: [], // [{id: 'q1', title: '...', progress: 0}]
                completed: []
            },
            logs: [], // [{title: '...', content: '...', time: '...'}]
            
            // 历史与环境
            history: [],
            pathHistory: [],
            currentTheme: 'level0',
            currentAmbience: 'level0'
        };

        this.isTyping = false;
        this.typeSpeed = 30;

        this.init();
    }

    init() {
        console.log("Backrooms Engine v2.0 Initialized");
        
        // 绑定系统按钮
        document.getElementById('btn-save').addEventListener('click', () => this.saveGame());
        document.getElementById('btn-load').addEventListener('click', () => this.loadGame());
        
        // 新增按钮绑定
        document.getElementById('btn-logs').addEventListener('click', () => this.togglePanel('logs'));
        document.getElementById('btn-quests').addEventListener('click', () => this.togglePanel('quests'));
        document.getElementById('btn-close-panel').addEventListener('click', () => this.sidePanel.classList.add('hidden'));

        // 显示点击开始提示
        this.output.innerHTML = "<div style='text-align:center; margin-top:20vh; cursor:pointer' id='start-prompt'>[ 点击屏幕初始化神经连接 ]</div>";
        
        // 初始点击仅用于激活音频上下文和开始游戏
        const startHandler = () => {
            const prompt = document.getElementById('start-prompt');
            if (prompt) {
                prompt.remove();
                // 激活音频上下文
                if (window.effects.audioCtx.state === 'suspended') {
                    window.effects.audioCtx.resume();
                }
                window.effects.startHum(); // Level 0 默认开启嗡嗡声
                this.loadNode('start');
            }
            document.removeEventListener('click', startHandler);
        };
        
        // 此时不绑定全局click，避免误触，改为特定元素触发
        // 但为了兼容原来的逻辑，我们还是监听一次点击
        document.getElementById('start-prompt').addEventListener('click', startHandler);
    }

    // 加载并解析节点
    loadNode(nodeId, choiceLabel = null) {
        // 0. Level 0 移动路径记录
        if (this.state.currentNodeId && this.state.currentNodeId.startsWith('level0') && choiceLabel) {
            this.recordPath(choiceLabel);
        }

        // 1. 隐藏路径检查 (马尼拉房间)
        if (nodeId === 'level0_explore' && this.checkManilaPath()) {
            nodeId = 'manila_room_enter';
        }

        // 2. 节点进入前置检查 (onEnter) - 用于动态重定向
        // (未来可扩展：例如进入某层级前检查是否有门票，没有则重定向到拒绝节点)

        const node = window.storyData[nodeId];
        if (!node) {
            console.error(`Node not found: ${nodeId}`);
            this.output.innerHTML += `<br>[系统错误: 节点 ${nodeId} 丢失]`;
            return;
        }

        this.state.currentNodeId = nodeId;
        
        // 3. 清空选项区
        this.choicesContainer.innerHTML = '';
        
        // 4. 处理节点效果 (Effect)
        if (node.effect) {
            this.applyEffect(node.effect);
        }

        // 5. 处理环境变化 (Environment)
        if (node.environment) {
            this.applyEnvironment(node.environment);
        } else if (!this.state.currentTheme && this.state.currentNodeId === 'start') {
             this.applyEnvironment({theme: 'level0', ambience: 'level0'});
        }
        
        // 6. Level 0 专属机制
        let finalText = node.text;
        if (!node.type && this.state.currentNodeId.startsWith('level0')) {
            finalText = this.processLevel0Mechanics(finalText, choiceLabel);
        }

        // 开始打字效果
        this.typeText(finalText, () => {
            this.renderChoices(node.choices);
        });
    }

    // 记录路径
    recordPath(action) {
        // 只记录方向性操作
        if (['前', '后', '左', '右'].some(dir => action.includes(dir))) {
            this.state.pathHistory.push(action);
            if (this.state.pathHistory.length > 10) {
                this.state.pathHistory.shift(); // 只保留最近10步
            }
            console.log("Path:", this.state.pathHistory);
        }
    }

    // 检查马尼拉房间触发条件 (上上下下左右左右)
    checkManilaPath() {
        const pattern = ['向前', '向前', '向后', '向后', '向左', '向右', '向左', '向右'];
        const history = this.state.pathHistory;
        
        if (history.length < pattern.length) return false;
        
        const recent = history.slice(-pattern.length);
        return recent.every((val, index) => val.includes(pattern[index]));
    }

    // 判断是否是移动操作
    isMovementAction(text) {
        return ['走', '转', '退', '前', '后', '左', '右'].some(keyword => text.includes(keyword));
    }

    // Level 0 专属机制：随机事件、环境叙事与SAN值影响
    processLevel0Mechanics(text, lastAction) {
        let newText = text;

        // 1. 低SAN值导航干扰 (SAN < 40)
        if (this.state.sanity < 40 && lastAction && Math.random() < 0.3) {
            newText = "你确信自己是向前走的。\n但当你停下脚步时，发现自己回到了原来的房间。\n墙上的霉斑都在嘲笑你的方向感。\n(空间发生了非欧几里得折叠)";
            // 可以在这里扣除一点额外SAN值，或者只是吓唬玩家
        }

        // 2. 环境叙事 (20% 概率)
        if (Math.random() < 0.2) {
            const discoveries = [
                "\n\n你在墙角发现了一个刻歪了的箭头，指向哪里？没人知道。",
                "\n\n地毯上有一块深色的污渍，看起来像是... 干涸的血迹？",
                "\n\n你在墙上看到一行潦草的小字：“别回头”。",
                "\n\n地上扔着一只孤零零的鞋子，尺码看起来像个孩子。",
                "\n\n你闻到了一股淡淡的香草味，这在这里显得格格不入。"
            ];
            const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
            newText += discovery;
        }

        // 3. 幻觉 (基于SAN值概率增加)
        // SAN 100: 5%, SAN 50: 15%, SAN 0: 40%
        const hallucinationChance = 0.05 + (100 - this.state.sanity) * 0.0035;
        
        if (Math.random() < hallucinationChance) {
            const hallucinations = [
                "\n[系统错误：视网膜数据同步延迟]",
                "\n（你听到身后有脚步声，但回头什么都没有）",
                "\n（墙壁似乎在... 呼吸？）",
                "\n（荧光灯的嗡嗡声突然停了一秒）",
                "\n（你看到一个黑影在视野边缘闪过）"
            ];
            
            // 极低SAN值时的严重幻觉
            if (this.state.sanity < 30) {
                hallucinations.push(
                    "\n为什么墙里有脸？为什么它们在笑？",
                    "\n它在看着你。它一直在看着你。",
                    "\n快跑快跑快跑快跑"
                );
            }

            const randomHallucination = hallucinations[Math.floor(Math.random() * hallucinations.length)];
            newText += "\n" + randomHallucination;
        }
        
        // 4. 文字故障
        if (Math.random() < 0.1 || this.state.sanity < 40) {
            newText = newText.replace(/墙壁/g, "<span class='glitch-text' data-text='墙壁'>墙壁</span>")
                             .replace(/黄色/g, "<span class='glitch-text' data-text='黄色'>黄色</span>")
                             .replace(/嗡嗡声/g, "<span class='glitch-text' data-text='嗡嗡声'>嗡嗡声</span>");
        }

        return newText;
    }

    // 打字机效果
    typeText(text, callback) {
        this.isTyping = true;
        this.output.innerHTML = ''; // 清空上一屏
        
        // 将文本按行分割，处理HTML标签
        // 简单实现：暂不支持复杂的嵌套标签逐字打印，先支持整体替换
        // 为了更好的效果，我们这里做一个简化的逐字打印
        
        let i = 0;
        const len = text.length;
        
        const typeChar = () => {
            if (i < len) {
                let char = text[i];
                
                // 简单的HTML标签检测 (如 <span class="glitch">)
                if (char === '<') {
                    let tagBuffer = '';
                    while (text[i] !== '>' && i < len) {
                        tagBuffer += text[i];
                        i++;
                    }
                    tagBuffer += '>';
                    this.output.innerHTML += tagBuffer;
                    i++;
                } else {
                    this.output.innerHTML += char === '\n' ? '<br>' : char;
                    i++;
                    window.effects.playTypingSound();
                }
                
                // 随机打字速度波动，模拟真实感
                const randomSpeed = this.typeSpeed + (Math.random() * 20 - 10);
                setTimeout(typeChar, randomSpeed);
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };

        typeChar();
    }

    // 渲染选项
    renderChoices(choices) {
        if (!choices) return;

        choices.forEach(choice => {
            // 1. 检查条件 (Condition Check)
            if (choice.condition) {
                // 如果条件函数存在且返回 false，则不渲染此选项
                // 注意：story.js 中的 condition 应该是一个函数 (state) => boolean
                // 但由于 JSON 序列化问题，实际中可能需要预定义好逻辑名，或者在这里做简单判断
                // 这里假设 story.js 会被重构为支持函数，或者我们在这里执行简单的逻辑判断
                try {
                    if (typeof choice.condition === 'function') {
                        if (!choice.condition(this.state)) return;
                    }
                } catch (e) {
                    console.error("Condition check failed:", e);
                    return;
                }
            }

            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            
            // 支持动态文本 (例如显示价格)
            let text = choice.text;
            // if (choice.cost) text += ` ($${choice.cost})`;
            
            btn.innerText = text;
            
            // 检查是否因资源不足而禁用
            if (choice.cost && this.state.player.money < choice.cost) {
                btn.disabled = true;
                btn.classList.add('disabled');
                btn.innerText += " [资金不足]";
            }

            btn.onclick = () => {
                if (this.isTyping) return;
                if (btn.disabled) return;

                // 扣除成本
                if (choice.cost) {
                    this.updateMoney(-choice.cost);
                }
                
                // 执行特定交互效果
                if (choice.type === 'glitch') {
                    window.effects.triggerGlitch();
                    setTimeout(() => this.loadNode(choice.nextNodeId, choice.text), 300);
                } else if (this.isMovementAction(choice.text) && this.state.currentNodeId.startsWith('level0')) {
                    window.effects.triggerWalkAnimation(this.state.player.sanity, choice.text, () => {
                        this.loadNode(choice.nextNodeId, choice.text);
                    });
                } else {
                    this.loadNode(choice.nextNodeId, choice.text);
                }
            };
            this.choicesContainer.appendChild(btn);
            
            setTimeout(() => { btn.style.opacity = 1; }, 100);
        });
    }

    // 应用游戏效果
    applyEffect(effect) {
        // 重置逻辑
        if (this.state.currentNodeId === 'start') {
            this.resetGameState();
            // 继续执行后续赋值，确保 location 等被正确设置
        }

        // 基础属性
        if (effect.sanity) this.updateSanity(effect.sanity);
        if (effect.hp) this.updateHp(effect.hp);
        if (effect.money) this.updateMoney(effect.money);
        if (effect.location) this.locationEl.innerText = effect.location;
        
        // 物品与标记
        if (effect.addItem) this.addItem(effect.addItem);
        if (effect.removeItem) this.removeItem(effect.removeItem);
        
        if (effect.flags) {
            if (effect.flags.add) this.state.flags[effect.flags.add] = true;
            // 可以扩展 remove 等
        }

        // 任务与日志
        if (effect.addQuest) this.addQuest(effect.addQuest); // id
        if (effect.completeQuest) this.completeQuest(effect.completeQuest);
        if (effect.addLog) this.addLog(effect.addLog); // title
    }

    resetGameState() {
        this.state.player = { sanity: 100, hp: 100, money: 0 };
        this.state.inventory = [];
        this.state.flags = {};
        this.state.quests = { active: [], completed: [] };
        this.state.pathHistory = [];
        this.state.logs = [];
        
        this.updateStatusUI();
        this.updateInventoryUI();
        this.updateQuestUI();
        document.body.style.textShadow = '';
    }

    // 应用环境变化
    applyEnvironment(env) {
        if (env.theme) {
            this.state.currentTheme = env.theme; // 更新状态以便存档
            
            // 暴力清除所有可能的主题和特效类名
            document.body.className = '';
            
            if (env.theme !== 'level0') {
                document.body.classList.add(`theme-${env.theme}`);
            }
            
            // 特殊环境特效 (根据当前theme重新添加)
            if (env.theme === 'level2') {
                document.body.classList.add('heat-active');
            }

            if (env.theme === 'level3') {
                document.body.classList.add('flash-active');
            }
        }
        
        // 切换音效氛围
        if (env.ambience) {
            this.state.currentAmbience = env.ambience; // 更新状态以便存档
            window.effects.changeAmbience(env.ambience);
        }
    }

    updateSanity(delta) {
        this.state.player.sanity = Math.max(0, Math.min(100, this.state.player.sanity + delta));
        this.updateStatusUI();
        
        if (this.state.player.sanity < 50) {
            document.body.style.textShadow = '0 0 5px red';
        } else {
            document.body.style.textShadow = '';
        }
    }

    updateHp(delta) {
        this.state.player.hp = Math.max(0, Math.min(100, this.state.player.hp + delta));
        this.updateStatusUI();
        if (this.state.player.hp <= 0) {
            // TODO: 死亡逻辑
            this.loadNode('death_generic');
        }
    }

    updateMoney(delta) {
        this.state.player.money += delta;
        this.updateStatusUI();
    }

    updateStatusUI() {
        this.sanValueEl.innerText = Math.floor(this.state.player.sanity);
        this.hpValueEl.innerText = Math.floor(this.state.player.hp);
        this.moneyValueEl.innerText = this.state.player.money;
    }
    // --- 物品系统 ---

    addItem(itemId) {
        const itemNames = {
            "water": "杏仁水",
            "flashlight": "手电筒",
            "royal_ration": "皇家口粮",
            "firesalt": "火盐",
            "k_beacon": "K的信标",
            "recorder": "录音笔",
            "diving_gear": "潜水装备",
            "metro_ticket": "地铁票"
        };
        
        const existingItem = this.state.inventory.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.count++;
        } else {
            this.state.inventory.push({
                id: itemId,
                name: itemNames[itemId] || itemId,
                count: 1
            });
        }
        
        this.updateInventoryUI();
        this.output.innerHTML += `<br><span class="highlight">[系统: 获得 ${itemNames[itemId] || itemId}]</span><br>`;
        
        // 自动解锁日志条目
        if (itemId === 'k_beacon') {
            this.addLog("物品获得: K博士的信标");
        }
    }

    removeItem(itemId) {
        const index = this.state.inventory.findIndex(i => i.id === itemId);
        if (index !== -1) {
            const item = this.state.inventory[index];
            item.count--;
            if (item.count <= 0) {
                this.state.inventory.splice(index, 1);
            }
            this.updateInventoryUI();
            this.output.innerHTML += `<br><span class="warning">[系统: 失去 ${item.name}]</span><br>`;
        }
    }

    updateInventoryUI() {
        this.inventoryBarEl.classList.remove('hidden');
        this.inventoryListEl.innerHTML = '';

        if (this.state.inventory.length === 0) {
            this.inventoryListEl.innerHTML = '<span style="color: var(--dim-text-color); font-size: 0.8em;">[空]</span>';
            return;
        }
        
        this.state.inventory.forEach(item => {
            const span = document.createElement('span');
            span.className = 'inventory-item';
            span.innerHTML = `[${item.name}${item.count > 1 ? `<span class="item-count">x${item.count}</span>` : ''}]`;
            span.onclick = () => this.useItem(item.id);
            this.inventoryListEl.appendChild(span);
        });
    }

    // --- 任务与日志系统 ---

    addQuest(questId) {
        // 假设 quest 数据定义在 storyData 中，或者这里硬编码
        // 简单起见，我们定义一个 questMap
        const quests = {
            "find_k": "寻找 K 博士",
            "build_outpost": "协助建立前哨站",
            "escape_level0": "逃离大厅"
        };

        if (this.state.quests.active.find(q => q.id === questId)) return;
        if (this.state.quests.completed.includes(questId)) return;

        this.state.quests.active.push({
            id: questId,
            title: quests[questId] || questId,
            progress: 0
        });
        
        this.updateQuestUI();
        this.addLog(`新任务: ${quests[questId] || questId}`);
    }

    completeQuest(questId) {
        const index = this.state.quests.active.findIndex(q => q.id === questId);
        if (index !== -1) {
            const quest = this.state.quests.active[index];
            this.state.quests.active.splice(index, 1);
            this.state.quests.completed.push(questId);
            
            this.updateQuestUI();
            this.addLog(`任务完成: ${quest.title}`);
            this.output.innerHTML += `<br><span class="highlight" style="color:#4f4">[任务完成: ${quest.title}]</span><br>`;
        }
    }

    updateQuestUI() {
        if (this.state.quests.active.length > 0) {
            this.questTrackerEl.classList.remove('hidden');
            // 显示最新的一个任务
            const latest = this.state.quests.active[this.state.quests.active.length - 1];
            this.activeQuestTextEl.innerText = latest.title;
        } else {
            this.questTrackerEl.classList.add('hidden');
        }
    }

    addLog(title, content = "") {
        const time = new Date().toLocaleTimeString();
        this.state.logs.push({ title, content, time });
        // 如果面板打开，实时更新
        if (!this.sidePanel.classList.contains('hidden') && this.panelTitle.innerText === 'SYSTEM LOG') {
            this.renderLogs();
        }
    }

    togglePanel(type) {
        if (!this.sidePanel.classList.contains('hidden') &&
           ((type === 'logs' && this.panelTitle.innerText === 'SYSTEM LOG') ||
            (type === 'quests' && this.panelTitle.innerText === 'QUEST LOG'))) {
            this.sidePanel.classList.add('hidden');
            return;
        }

        this.sidePanel.classList.remove('hidden');
        if (type === 'logs') {
            this.panelTitle.innerText = 'SYSTEM LOG';
            this.renderLogs();
        } else {
            this.panelTitle.innerText = 'QUEST LOG';
            this.renderQuests();
        }
    }

    renderLogs() {
        this.panelContent.innerHTML = this.state.logs.map(log => `
            <div class="log-entry">
                <div class="log-time">[${log.time}]</div>
                <div class="log-title">${log.title}</div>
                ${log.content ? `<div class="log-content">${log.content}</div>` : ''}
            </div>
        `).reverse().join('');
    }

    renderQuests() {
        const activeHtml = this.state.quests.active.map(q => `
            <div class="log-entry" style="border-color: var(--highlight-color)">
                <div class="log-title" style="color: var(--highlight-color)">[进行中] ${q.title}</div>
            </div>
        `).join('');

        const completedHtml = this.state.quests.completed.map(qid => `
            <div class="log-entry">
                <div class="log-title" style="text-decoration: line-through; color: var(--dim-text-color)">[已完成] ${qid}</div>
            </div>
        `).join('');

        this.panelContent.innerHTML = activeHtml + (activeHtml && completedHtml ? '<hr>' : '') + completedHtml;
        if (!activeHtml && !completedHtml) {
            this.panelContent.innerHTML = '<div style="text-align:center; color:var(--dim-text-color)">暂无任务记录</div>';
        }
    }

    useItem(itemId) {
        if (this.isTyping) return;

        const itemIndex = this.state.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        const item = this.state.inventory[itemIndex];
        let used = false;
        let message = "";

        // 简单的物品使用逻辑
        switch(itemId) {
            case 'water':
                this.updateSanity(15);
                message = "你喝了一口杏仁水。温热的液体安抚了你的神经。\n[SAN +15]";
                used = true;
                break;
            case 'royal_ration':
                this.updateSanity(30);
                message = "这东西尝起来像过期的饼干，但它让你感到充满力量。\n[SAN +30]";
                used = true;
                break;
            case 'flashlight':
                message = "你晃了晃手电筒。它还亮着，但在这种黑暗中聊胜于无。";
                // 手电筒不消耗
                break;
            default:
                message = "这东西似乎现在用不了。";
        }

        if (used) {
            item.count--;
            if (item.count <= 0) {
                this.state.inventory.splice(itemIndex, 1);
            }
            this.updateInventoryUI();
        }

        // 以系统消息形式插入文本，不触发打字机全屏刷新
        this.output.innerHTML += `<br><br><span class="highlight">> 使用物品: ${item.name}</span><br>${message}<br>`;
        // 滚动到底部
        this.output.scrollTop = this.output.scrollHeight;
    }

    // --- 存档系统 ---

    saveGame() {
        if (this.isTyping) return;
        
        const saveData = JSON.stringify(this.state);
        localStorage.setItem('backrooms_save_v2', saveData);
        
        const btn = document.getElementById('btn-save');
        const originalText = btn.innerText;
        btn.innerText = "[已保存]";
        setTimeout(() => btn.innerText = originalText, 1000);
        this.addLog("系统: 游戏进度已保存");
    }

    loadGame() {
        if (this.isTyping) return;

        const saveData = localStorage.getItem('backrooms_save_v2');
        if (!saveData) {
            alert("没有找到存档记录。");
            return;
        }

        try {
            const loadedState = JSON.parse(saveData);
            
            // 简单的版本迁移检查
            if (!loadedState.player) {
                alert("旧版本存档不兼容，请重新开始。");
                return;
            }

            this.state = loadedState;
            console.log("Game Loaded:", this.state);

            // 恢复 UI 状态
            this.updateStatusUI();
            this.updateInventoryUI();
            this.updateQuestUI();
            
            // 恢复环境
            this.applyEnvironment({
                theme: this.state.currentTheme,
                ambience: this.state.currentAmbience
            });

            // 重新加载节点
            this.loadNode(this.state.currentNodeId);

            const btn = document.getElementById('btn-load');
            const originalText = btn.innerText;
            btn.innerText = "[读取成功]";
            setTimeout(() => btn.innerText = originalText, 1000);
            this.addLog("系统: 游戏进度已读取");

        } catch (e) {
            console.error("Load failed:", e);
            alert("存档文件损坏。");
        }
    }
}

// 启动引擎
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});