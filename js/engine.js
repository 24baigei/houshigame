class GameEngine {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.choicesContainer = document.getElementById('choices-container');
        this.sanValueEl = document.getElementById('san-value');
        this.locationEl = document.getElementById('location');
        
        this.state = {
            currentNodeId: null,
            sanity: 100,
            inventory: [],
            history: []
        };

        this.isTyping = false;
        this.typeSpeed = 30; // 打字速度 (ms)

        this.init();
    }

    init() {
        console.log("Backrooms Engine Initialized");
        // 显示点击开始提示
        this.output.innerHTML = "<div style='text-align:center; margin-top:20vh; cursor:pointer' id='start-prompt'>[ 点击屏幕初始化神经连接 ]</div>";
        
        document.addEventListener('click', () => {
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
        }, { once: true });
    }

    // 加载并解析节点
    loadNode(nodeId) {
        const node = window.storyData[nodeId];
        if (!node) {
            console.error(`Node not found: ${nodeId}`);
            return;
        }

        this.state.currentNodeId = nodeId;
        
        // 清空选项区
        this.choicesContainer.innerHTML = '';
        
        // 处理节点效果 (Effect)
        if (node.effect) {
            this.applyEffect(node.effect);
        }

        // 处理环境变化 (Environment)
        if (node.environment) {
            this.applyEnvironment(node.environment);
        }
        
        // 处理随机事件 (仅在 Level 0 且非特殊节点触发)
        let finalText = node.text;
        if (!node.type && this.state.currentNodeId.startsWith('level0')) {
            finalText = this.processRandomEvents(finalText);
        }

        // 开始打字效果
        this.typeText(finalText, () => {
            this.renderChoices(node.choices);
        });
    }

    // 随机事件系统
    processRandomEvents(text) {
        // 15% 概率插入幻觉文本
        if (Math.random() < 0.15) {
            const hallucinations = [
                "\n[系统错误：视网膜数据同步延迟]",
                "\n（你听到身后有脚步声，但回头什么都没有）",
                "\n（墙壁似乎在... 呼吸？）",
                "\n（荧光灯的嗡嗡声突然停了一秒）"
            ];
            const randomHallucination = hallucinations[Math.floor(Math.random() * hallucinations.length)];
            return text + "\n" + randomHallucination;
        }
        
        // 5% 概率触发文字故障
        if (Math.random() < 0.05) {
            return text.replace(/墙壁/g, "<span class='glitch-text' data-text='墙壁'>墙壁</span>")
                       .replace(/黄色/g, "<span class='glitch-text' data-text='黄色'>黄色</span>");
        }

        return text;
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
            // 检查条件 (如果有)
            if (choice.condition) {
                // TODO: 实现条件检查逻辑
            }

            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = choice.text;
            btn.onclick = () => {
                if (this.isTyping) return; // 打字时禁止交互
                
                // 检查是否是特殊交互
                if (choice.type === 'glitch') {
                    window.effects.triggerGlitch();
                    setTimeout(() => {
                        this.loadNode(choice.nextNodeId);
                    }, 300);
                } else {
                    this.loadNode(choice.nextNodeId);
                }
            };
            this.choicesContainer.appendChild(btn);
            
            // 依次淡入显示
            setTimeout(() => {
                btn.style.opacity = 1;
            }, 100);
        });
    }

    // 应用游戏效果
    applyEffect(effect) {
        if (effect.sanity) {
            // 如果是 start 节点，直接重置为 100
            if (this.state.currentNodeId === 'start') {
                this.state.sanity = 100;
                this.sanValueEl.innerText = 100;
                document.body.style.textShadow = '';
            } else {
                this.updateSanity(effect.sanity);
            }
        }
        if (effect.location) {
            this.locationEl.innerText = effect.location;
        }
    }

    // 应用环境变化
    applyEnvironment(env) {
        if (env.theme) {
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
            window.effects.changeAmbience(env.ambience);
        }
    }

    updateSanity(delta) {
        this.state.sanity = Math.max(0, Math.min(100, this.state.sanity + delta));
        this.sanValueEl.innerText = this.state.sanity;
        
        // SAN值过低时的视觉反馈
        if (this.state.sanity < 50) {
            document.body.style.textShadow = '0 0 5px red';
        } else {
            document.body.style.textShadow = '';
        }
    }
}

// 启动引擎
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});