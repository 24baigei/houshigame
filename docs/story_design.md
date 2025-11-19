# 后室 (The Backrooms) - 深度剧情扩展设计 v2.0

## 1. 核心叙事架构：三相分歧 (The Tri-Path)

为了增加深度，我们将引入**阵营**与**理念**的冲突。玩家在旅途中的选择将决定其所属路线。

### 1.1 秩序线 (The Order - MEG)
*   **核心理念**: 探索、记录、生存。认为后室是可以被理解和征服的物理空间。
*   **关键NPC**: Overseer A (MEG 高层), 斥候小队。
*   **目标**: 协助建立 Level 11 的稳定社区，寻找传说中的“枢纽 (The Hub)”。
*   **风格**: 硬科幻、生存、建设。

### 1.2 混沌线 (The Chaos - The Lost)
*   **核心理念**: 崇拜、同化、疯狂。认为后室是神的恩赐，实体是进化的终点。
*   **关键NPC**: “先知” (The Prophet), 杰瑞 (Jerry - 蓝色鹦鹉实体)。
*   **目标**: 阻止 MEG 的扩张，拥抱“蓝色通道”，成为实体的一部分。
*   **风格**: 心理恐怖、宗教隐喻、San值危机。

### 1.3 真相线 (The Truth - Async Legacy)
*   **核心理念**: 罪恶、赎罪、终结。揭露后室的人造起源 (Async 研究所)。
*   **关键NPC**: K 博士 (Dr. K), 失落的特工。
*   **目标**: 寻找 Level 94 的隐藏实验室，执行“俄耳甫斯协议”，重启现实稳定锚。
*   **风格**: 悬疑解谜、元叙事 (Meta-fiction)。

---

## 2. 新增层级规划 (Level Roadmap)

为了支撑上述剧情，我们需要引入更具特色的层级：

### Level 6: 熄灯 (Lights Out)
*   **特征**: 绝对的黑暗。手电筒失效或光照范围极小。
*   **玩法**: 纯听觉导航。必须根据脚步声的回响判断墙壁距离。
*   **剧情点**: **[分歧点]**。在这里你会遇到一个受伤的 MEG 特工和一个疯狂的信徒。救谁？

### Level 7: 海洋之王 (Thalassophobia)
*   **特征**: 无尽的海洋。水面下是深渊。
*   **环境叙事**: 漂浮的家具、沉没的房屋。深海恐惧症。
*   **玩法**: 乘坐小船探索，必须保持安静以避开水下巨兽 (The Thing on Level 7)。
*   **剧情点**: 寻找 K 博士丢弃的防水日志。

### Level 11: 混凝土森林 (The Concrete Jungle)
*   **特征**: 无限循环的现代城市。没有尽头的摩天大楼，永远是正午或黄昏。
*   **玩法**: 开放世界探索。这里相对安全，是 MEG 的主基地。
*   **剧情点**: **[休息站]**。可以在这里补给、交易情报，决定是否加入 MEG。

### Level 94: 动画 (Motion)
*   **特征**: 看起来像 1930 年代的定格动画小镇。一切都是纸板和粘土做的。
*   **环境叙事**: 诡异的怀旧感，永远挂着笑脸的“邻居”。
*   **剧情点**: Async 的秘密实验室就隐藏在这个看似荒诞的层级深处。

### Level 188: 窗之庭 (The Windows)
*   **特征**: 一个巨大的天井，四周全是窗户。
*   **环境叙事**: 每个窗户后面都是不同的景象（有的在开派对，有的是虚空）。
*   **剧情点**: 最终决战前的宁静。必须找到那一扇通往结局的“正确之窗”。

---

## 3. 复杂剧情节点示例 (Complex Story Nodes)

### 示例：Level 6 的道德抉择

```javascript
"level6_encounter": {
    id: "level6_encounter",
    text: "黑暗中传来两个声音。\n左边是微弱的求救声：“帮帮我... 我的腿断了...” (MEG特工)\n右边是癫狂的低语：“它在看着我们... 拥抱黑暗吧...” (信徒)\n你的手电筒快没电了。",
    choices: [
        {
            text: "循着求救声去 (救特工)",
            nextNodeId: "level6_save_agent",
            effect: { 
                sanity: 5, 
                addItem: "meg_badge", // 获得信物，开启 MEG 路线
                flags: { add: "trust_meg" } 
            }
        },
        {
            text: "靠近那个低语者 (接触信徒)",
            nextNodeId: "level6_meet_cultist",
            effect: { 
                sanity: -20, // 接触疯子会掉 SAN
                addItem: "strange_rune", // 获得符文，开启混沌路线
                flags: { add: "know_truth" }
            }
        },
        {
            text: "谁都不理，独自摸索",
            nextNodeId: "level6_alone",
            effect: { sanity: -5 }
        }
    ]
}
```

### 示例：Level 11 的情报交易

```javascript
"level11_hub": {
    id: "level11_hub",
    text: "你来到了 Level 11 的安全屋。这里有自动贩卖机和休息的流浪者。\n一个戴着墨镜的情报贩子向你招手。",
    choices: [
        {
            text: "询问 K 博士的下落",
            nextNodeId: "level11_info_k",
            // 只有拥有 K 的信标才能解锁此选项
            condition: (state) => state.inventory.includes('k_beacon')
        },
        {
            text: "购买 Level 94 的入口坐标",
            nextNodeId: "level11_buy_map",
            // 需要消耗杏仁水作为货币
            condition: (state) => state.inventory.filter(i => i.id === 'water').length >= 2
        }
    ]
}
```

## 4. 开发路线图更新

1.  **Phase 1 (当前)**: 完善 Level 0-4 的线性流程，加入基础环境叙事。
2.  **Phase 2**: 引入 **Inventory System v2** (支持复杂物品和货币) 和 **Flag System** (剧情标记)。
3.  **Phase 3**: 制作 **Level 6** 和 **Level 11**，实现第一次路线分歧。
4.  **Phase 4**: 制作 **Level 37/94**，完成多结局。