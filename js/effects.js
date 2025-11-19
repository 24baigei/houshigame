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
        }
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