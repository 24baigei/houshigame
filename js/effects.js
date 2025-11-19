class EffectsManager {
    constructor() {
        this.container = document.getElementById('crt-container');
        // Web Audio API 初始化
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.audioCtx.destination);
        this.gainNode.gain.value = 0.1; // 全局音量
        
        this.humOscillators = []; // 存储嗡嗡声振荡器
    }

    // 启动后室标志性的荧光灯嗡嗡声
    startHum() {
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        
        // 停止之前的
        this.stopHum();

        // 创建三个不同频率的振荡器来模拟复杂的电流声
        const freqs = [50, 60, 120];
        freqs.forEach(f => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'sawtooth'; // 锯齿波更有电流感
            osc.frequency.value = f;
            
            // 随机微调频率，制造不稳定性
            setInterval(() => {
                osc.frequency.value = f + Math.random() * 2 - 1;
            }, 100);

            gain.gain.value = 0.05;
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            this.humOscillators.push({osc, gain});
        });
    }

    stopHum() {
        this.humOscillators.forEach(o => {
            o.osc.stop();
            o.osc.disconnect();
        });
        this.humOscillators = [];
    }

    // 触发屏幕强烈闪烁和扭曲（用于切入）
    triggerGlitch() {
        document.body.classList.add('noclip-active');
        
        // 随机生成一些视觉噪音
        const noise = document.createElement('div');
        noise.style.position = 'absolute';
        noise.style.top = '0';
        noise.style.left = '0';
        noise.style.width = '100%';
        noise.style.height = '100%';
        noise.style.backgroundColor = '#fff';
        noise.style.opacity = '0.1';
        noise.style.zIndex = '999';
        document.body.appendChild(noise);

        setTimeout(() => {
            document.body.classList.remove('noclip-active');
            noise.remove();
        }, 500);
    }

    // 触发 ASCII 字符流动画
    triggerWalkAnimation(sanity, actionType, callback) {
        const overlay = document.getElementById('ascii-overlay');
        if (!overlay) {
            if (callback) callback();
            return;
        }

        overlay.classList.add('active');
        overlay.innerHTML = ''; // 清空
        
        // 解析方向
        let direction = 'forward';
        if (actionType.includes('左')) direction = 'left';
        if (actionType.includes('右')) direction = 'right';
        if (actionType.includes('退') || actionType.includes('后')) direction = 'back';

        // SAN值影响颜色
        if (sanity < 40) {
            overlay.classList.add('insane');
        } else {
            overlay.classList.remove('insane');
        }

        this.playFootstepSound();

        const duration = 1200;
        const frameTime = 30; // 30ms 一帧
        let elapsed = 0;
        
        // 每一行的字符宽度 (估算)
        const cols = Math.floor(window.innerWidth / 10);
        const center = Math.floor(cols / 2);
        let pathCenter = center;

        const interval = setInterval(() => {
            elapsed += frameTime;
            
            // 动态生成一行
            // 1. 计算路径中心偏移
            if (direction === 'left') pathCenter -= 0.5;
            if (direction === 'right') pathCenter += 0.5;
            
            // 扰动
            const noise = (Math.random() - 0.5) * (sanity < 50 ? 2 : 0.5);
            const currentCenter = Math.floor(pathCenter + noise);

            // 2. 生成字符串
            let line = "";
            const pathWidth = 10 + (direction === 'back' ? (elapsed/duration)*10 : 0); // 后退时路径变宽?
            
            for (let i = 0; i < cols; i++) {
                if (i === currentCenter - Math.floor(pathWidth/2)) {
                    line += direction === 'left' ? '/' : (direction === 'right' ? '\\' : '|');
                } else if (i === currentCenter + Math.floor(pathWidth/2)) {
                    line += direction === 'left' ? '/' : (direction === 'right' ? '\\' : '|');
                } else if (i > currentCenter - pathWidth/2 && i < currentCenter + pathWidth/2) {
                    // 路径内部：空或者少量噪点
                    line += Math.random() > 0.95 ? '.' : ' ';
                } else {
                    // 路径外部：随机乱码/噪点
                    const chars = " .`',:;^";
                    // SAN值越低，外部噪点越混乱
                    const chaosChars = "@#$%&?!";
                    const charSet = sanity < 30 ? chaosChars : chars;
                    line += Math.random() > 0.8 ? charSet[Math.floor(Math.random() * charSet.length)] : ' ';
                }
            }

            // 3. 更新 DOM
            // 创建新行
            const div = document.createElement('div');
            div.textContent = line;
            overlay.appendChild(div);
            
            // 移除旧行，保持屏幕不溢出太多
            if (overlay.children.length > 40) {
                overlay.removeChild(overlay.firstChild);
            }
            
            // 滚动到底部 (flex-end handle this visually, but we keep DOM clean)

            if (elapsed >= duration) {
                clearInterval(interval);
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.innerHTML = ''; // 清理
                    if (callback) callback();
                }, 200);
            }
        }, frameTime);
    }

    playFootstepSound() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        // 简单的低频噪音模拟脚步声
        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(10, t + 0.1);
        
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(t);
        osc.stop(t + 0.1);

        // 第二步
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.frequency.setValueAtTime(100, t + 0.6);
        osc2.frequency.exponentialRampToValueAtTime(10, t + 0.7);
        gain2.gain.setValueAtTime(0.2, t + 0.6);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.7);
        
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        
        osc2.start(t + 0.6);
        osc2.stop(t + 0.7);
    }

    // 播放打字机音效 (合成高频短促音)
    playTypingSound() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, this.audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.05);
    }

    // 改变背景氛围
    changeAmbience(type) {
        this.stopHum(); // 先停止当前音效
        
        switch(type) {
            case 'level0':
                this.startHum();
                break;
            case 'level1':
                this.startIndustrialRumble();
                break;
            case 'level2':
                this.startSteamHiss();
                break;
            case 'level3':
                this.startElectricBuzz();
                break;
            case 'level4':
                this.startOfficeRain();
                break;
            case 'level11':
                this.startCityAmbience();
                break;
            case 'level9':
            case 'metro':
                this.startIndustrialRumble();
                break;
            case 'level7':
                this.startUnderwater();
                break;
            case 'level8':
                this.startCaveWind();
                break;
            case 'level52':
                this.startSchoolHum();
                break;
            case 'level188':
                this.startWindHowl();
                break;
            case 'level3999':
                this.startArcadeMusic();
                break;
            case 'the_end':
                // 静默，只有微弱的硬盘读写声
                this.startSchoolHum(); // 复用微弱嗡嗡声
                break;
        }
    }

    // Level 3999: 8-bit 琶音 (模拟街机音乐)
    startArcadeMusic() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        const osc = this.audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 440;
        
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.05;

        // 简单的琶音序列
        const arp = this.audioCtx.createOscillator();
        arp.type = 'square';
        arp.frequency.value = 8; // 速度
        
        const arpGain = this.audioCtx.createGain();
        arpGain.gain.value = 50;

        arp.connect(arpGain);
        arpGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        arp.start();

        this.humOscillators.push({osc, gain});
        this.humOscillators.push({osc: arp, gain: arpGain});
    }

    // Level 52: 学校嗡嗡声 (极其安静，偶尔有电流声)
    startSchoolHum() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        // 复用低频嗡嗡声，但频率更高一点，模拟老式日光灯
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 120;
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.02;
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        this.humOscillators.push({osc, gain});
    }

    // Level 188: 高空风声
    startWindHowl() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 500;
        
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.1;

        // 快速变化的LFO模拟阵风
        const lfo = this.audioCtx.createOscillator();
        lfo.type = 'triangle';
        lfo.frequency.value = 0.5;
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = 0.05;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();

        this.humOscillators.push({osc: noise, gain});
        this.humOscillators.push({osc: lfo, gain: lfoGain});
    }

    // Level 7: 水下闷响 (低通滤波器极重)
    startUnderwater() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200; // 只有低频

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.3; // 水压感

        // 缓慢的压力波动
        const lfo = this.audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05;
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = 0.1;
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();

        this.humOscillators.push({osc: noise, gain});
        this.humOscillators.push({osc: lfo, gain: lfoGain});
    }

    // Level 8: 洞穴风声 (带回声)
    startCaveWind() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.1;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();

        this.humOscillators.push({osc: noise, gain});
    }

    // Level 11: 城市风声 (高通噪声 + 缓慢LFO)
    startCityAmbience() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 300; // 风声

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.05;

        // 模拟风的强弱变化
        const lfo = this.audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1;
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = 0.03;
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();

        this.humOscillators.push({osc: noise, gain});
        this.humOscillators.push({osc: lfo, gain: lfoGain});
    }

    // Level 3: 高频电流声
    startElectricBuzz() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 50; // 基频

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.05;

        // 使用噪声调制频率，模拟不稳定的电流
        const modOsc = this.audioCtx.createOscillator();
        modOsc.type = 'square';
        modOsc.frequency.value = 10;
        const modGain = this.audioCtx.createGain();
        modGain.gain.value = 200; // 调制深度

        modOsc.connect(modGain);
        modGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        modOsc.start();

        this.humOscillators.push({osc, gain});
        this.humOscillators.push({osc: modOsc, gain: modGain});
    }

    // Level 4: 办公室雨声 (粉红噪声 + 滤波器)
    startOfficeRain() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2; // 粉红噪声近似
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800; // 闷闷的雨声

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.1;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();

        this.humOscillators.push({osc: noise, gain});
    }

    // Level 1: 低沉机械轰鸣
    startIndustrialRumble() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        // 使用低通滤波器处理白噪来实现轰鸣声
        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120; // 仅保留低频

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.15;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();
        
        this.humOscillators.push({osc: noise, gain}); // 借用humOscillators存储引用以便停止
    }

    // Level 2: 蒸汽嘶嘶声
    startSteamHiss() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'highpass'; // 高通滤波
        filter.frequency.value = 1000;

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.03;

        // 添加一个LFO来调制音量，模拟蒸汽喷出的不稳定性
        const lfo = this.audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.2; // 缓慢变化
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = 0.02;
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();

        this.humOscillators.push({osc: noise, gain});
        this.humOscillators.push({osc: lfo, gain: lfoGain});
    }
}

window.effects = new EffectsManager();