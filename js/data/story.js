// 剧情数据文件 v2.0 (Metroidvania Update)
// 结构: ID -> Node对象
const storyData = {
    // ==========================================
    // PROLOGUE & LEVEL 0 (The Lobby)
    // ==========================================
    "start": {
        id: "start",
        text: "初始化系统...\n[正在连接到现实切片...]\n错误：定位失败。\n重试中... [成功]\n\n你睁开眼睛。周围是一片令人不安的寂静。",
        // 强制重置环境为 Level 0
        environment: { theme: "level0", ambience: "level0" },
        effect: { sanity: 100, hp: 100, money: 0, location: "REALITY" }, // 重置状态
        choices: [
            { text: "观察四周", nextNodeId: "prologue_1" }
        ]
    },
    "prologue_1": {
        id: "prologue_1",
        text: "这里看起来像是一个普通的办公室，但有些不对劲。\n空气中弥漫着陈旧地毯的霉味，荧光灯发出持续不断的低频嗡嗡声。\n所有的窗户都被厚重的百叶窗遮死，透不出一丝光亮。",
        choices: [
            { text: "检查电脑屏幕", nextNodeId: "prologue_computer" },
            { text: "走向门口", nextNodeId: "prologue_door" }
        ]
    },
    "prologue_computer": {
        id: "prologue_computer",
        text: "屏幕上闪烁着绿色的光标。除了一行文字外，什么都没有：\n\n“不要相信墙壁。”\n\n你感到一阵寒意顺着脊背爬上来。",
        choices: [
            { text: "离开办公桌", nextNodeId: "prologue_1" }
        ]
    },
    "prologue_door": {
        id: "prologue_door",
        text: "你握住门把手。冰冷，粘腻。\n门缓缓打开，外面不是走廊，而是... 同样的黄色壁纸，同样的荧光灯，无限延伸。\n\n你试图后退，但身后的门却像融化了一样消失了。\n你被困住了。",
        choices: [
            { text: "呼救", nextNodeId: "level0_start_scream" },
            { text: "保持冷静，向前走", nextNodeId: "level0_start_calm" }
        ]
    },
    "level0_start_scream": {
        id: "level0_start_scream",
        text: "你大声呼喊。声音在空荡荡的房间里回荡，仿佛被墙壁吞噬。\n并没有人回应。\n除了... 远处的嗡嗡声似乎变得更响了。\n[SAN值下降]",
        effect: { sanity: -10 },
        choices: [
            { text: "继续", nextNodeId: "level0_explore" }
        ]
    },
    "level0_start_calm": {
        id: "level0_start_calm",
        text: "你深吸一口气，试图压制住内心的恐慌。这里不合逻辑，但恐慌解决不了问题。\n你迈出了第一步。",
        choices: [
            { text: "继续", nextNodeId: "level0_explore" }
        ]
    },
    "level0_explore": {
        id: "level0_explore",
        text: "你在黄色的迷宫中漫无目的地游荡。时间在这里失去了意义。\n墙上的壁纸有些地方剥落了，露出下面... 更深一层的壁纸。\n你试图寻找某种规律，或者仅仅是出口。",
        choices: [
            { text: "继续向前走", nextNodeId: "level0_corridor" },
            { text: "向后退", nextNodeId: "level0_backtrack" },
            { text: "向左转", nextNodeId: "level0_left" },
            { text: "向右转", nextNodeId: "level0_right" }
        ]
    },
    // ... Level 0 迷宫逻辑 (保留原样或简化) ...
    "level0_corridor": {
        id: "level0_corridor",
        text: "你继续前行。嗡嗡声似乎变大了。\n你看到墙上有一道划痕，看起来很眼熟。\n是你刚才留下的吗？还是别人？",
        choices: [
            { text: "无视它，向左转", nextNodeId: "level0_left" },
            { text: "向右转", nextNodeId: "level0_right" },
            { text: "继续向前", nextNodeId: "level0_explore" }
        ]
    },
    "level0_left": {
        id: "level0_left",
        text: "你向左转，进入了一个看起来完全相同的房间。\n等等，墙上的那个污渍... 你刚才是不是见过？\n这种既视感让你感到恶心。",
        choices: [
            { text: "继续走", nextNodeId: "level0_corridor" },
            { text: "回头", nextNodeId: "level0_back" }
        ]
    },
    "level0_right": {
        id: "level0_right",
        text: "这是一条死胡同。\n但在死胡同的尽头，地板上放着一瓶不知是谁留下的液体。\n瓶身标签模糊不清，看起来像是某种杏仁饮料。",
        choices: [
            { text: "喝下它", nextNodeId: "level0_drink", effect: { sanity: 20 } },
            { text: "捡起来带走", nextNodeId: "level0_loot_water", effect: { addItem: "water" } },
            { text: "不敢喝，离开", nextNodeId: "level0_corridor" }
        ]
    },
    "level0_loot_water": {
        id: "level0_loot_water",
        text: "你将杏仁水放进口袋。虽然现在不渴，但留着总没错。",
        choices: [
            { text: "继续探索", nextNodeId: "level0_corridor" }
        ]
    },
    "level0_back": {
        id: "level0_back",
        text: "你猛地回头。\n身后本该是刚才走过的路，但现在却是一堵墙。\n空间在你身后重组了。\n没有回头路了。",
        effect: { sanity: -5 },
        choices: [
            { text: "只能前进了", nextNodeId: "level0_explore" }
        ]
    },
    "level0_drink": {
        id: "level0_drink",
        text: "你拧开瓶盖，一股淡淡的杏仁香气飘了出来。\n你大口吞咽着。温热，甜腻，但缓解了喉咙的灼烧感。\n你感觉清醒了一些。\n[SAN值恢复]",
        choices: [
            { text: "继续探索", nextNodeId: "level0_corridor" }
        ]
    },
    "level0_backtrack": {
        id: "level0_backtrack",
        text: "你试图原路返回。但当你回头时，刚才走过的走廊不见了。\n取而代之的是一堵实心的墙。\n这里没有回头路。",
        effect: { sanity: -5 },
        choices: [
            { text: "只能向前走了", nextNodeId: "level0_explore" }
        ]
    },
    // Manila Room & Noclip
    "manila_room_enter": {
        id: "manila_room_enter",
        text: "当你再次转弯时，地板的质感变了。\n不再是潮湿的地毯，而是硬木地板。\n你走进了一个没有窗户的小房间。这里的墙壁是米色的，而不是那种令人作呕的黄。\n房间中央有一张桌子。",
        choices: [
            { text: "阅读桌上的文件", nextNodeId: "manila_room_doc" }
        ]
    },
    "manila_room_doc": {
        id: "manila_room_doc",
        text: "“...切入点通常是不稳定的。如果你看到了扭曲的墙壁，不要犹豫...”\n这是一份流浪者的手记。\n当你读完抬起头时，房间消失了，你又回到了黄色的地狱。\n但你前方出现了一块<span class='glitch-text' data-text='扭曲'>扭曲</span>的墙壁。",
        choices: [
            { text: "靠近那块墙壁", nextNodeId: "noclip_attempt" }
        ]
    },
    "noclip_attempt": {
        id: "noclip_attempt",
        text: "你伸出手，手指穿过了墙壁，就像穿过一层水幕。\n这就是... 所谓的“切入”吗？\n你的大脑在尖叫，这违反了物理法则。",
        choices: [
            { text: "把整个身体挤进去", nextNodeId: "level1_transition", type: "glitch" },
            { text: "太危险了，缩回来", nextNodeId: "level0_corridor" }
        ]
    },

    // ==========================================
    // LEVEL 1 (Habitable Zone)
    // ==========================================
    "level1_transition": {
        id: "level1_transition",
        text: "世界在你眼前崩塌。重力翻转，光线在视网膜上灼烧出奇怪的图案。\n当你再次恢复知觉时，地毯的霉味消失了。\n取而代之的是... 湿润混凝土的气味。\n\n[进入 Level 1]",
        effect: { location: "LEVEL 1", sanity: 10, addQuest: "find_k" }, // 自动接取主线任务
        environment: { theme: "level1", ambience: "level1" },
        choices: [
             { text: "睁开眼睛", nextNodeId: "level1_start" }
        ]
    },
    "level1_start": {
        id: "level1_start",
        text: "你躺在冰冷粗糙的混凝土地面上。四周的光线比Level 0暗淡许多，但也不再是那种令人作呕的单调黄色。\n这里像是一个巨大的地下仓库，空气中弥漫着浓重的水雾。\n远处传来低沉的机械运作声。",
        choices: [
            { text: "探索这片区域", nextNodeId: "level1_explore" }
        ]
    },
    "level1_explore": {
        id: "level1_explore",
        text: "你在迷雾中前行。这里比Level 0开阔得多，但也更加阴冷。\n前方隐约出现了一些木箱子，堆放在角落里。",
        choices: [
            { text: "检查箱子", nextNodeId: "level1_crate" },
            { text: "无视并继续前进", nextNodeId: "level1_corridor" }
        ]
    },
    "level1_crate": {
        id: "level1_crate",
        text: "木箱表面印着模糊的标志，看起来像是 MEG (M.E.G.) 的补给箱。\n你撬开其中一个，里面放着几瓶杏仁水和一包看起来像饼干的东西。",
        choices: [
            { text: "拿走杏仁水", nextNodeId: "level1_loot_water", effect: { addItem: "water" } },
            { text: "全部拿走", nextNodeId: "level1_loot_all", effect: { addItem: "water" } } 
        ]
    },
    "level1_loot_water": {
        id: "level1_loot_water",
        text: "你把杏仁水塞进口袋。在这鬼地方，这东西比黄金还珍贵。\n你感觉安心了一些。",
        choices: [
            { text: "离开", nextNodeId: "level1_corridor" }
        ]
    },
    "level1_loot_all": {
        id: "level1_loot_all",
        text: "你贪婪地搜刮了一切。背包变得沉甸甸的。\n哪怕是那些干燥无味的饼干，也是难得的美味。",
        effect: { addItem: "royal_ration" },
        choices: [
            { text: "离开", nextNodeId: "level1_corridor" }
        ]
    },
    "level1_corridor": {
        id: "level1_corridor",
        text: "你穿过一片开阔区域，前方出现了微弱的亮光。\n几个帐篷散乱地搭建在混凝土柱子之间。",
        choices: [
            { text: "靠近营地", nextNodeId: "level1_outpost" },
            { text: "保持警惕，绕行", nextNodeId: "level1_hound_intro" }
        ]
    },
    "level1_outpost": {
        id: "level1_outpost",
        text: "你小心翼翼地靠近。这里似乎是一个废弃的 M.E.G. 临时据点。\n突然，一个声音从帐篷后传来：“别动，流浪者。”\n一个穿着战术背心的人走了出来，手里拿着一根铁管。",
        choices: [
            { text: "举起双手表示友好", nextNodeId: "level1_npc_talk" },
            { text: "转身就跑", nextNodeId: "level1_hound_intro" }
        ]
    },
    "level1_npc_talk": {
        id: "level1_npc_talk",
        text: "那人打量了你一番，放下了武器。“抱歉，最近‘猎犬’很活跃，我们不得不小心。”\n他自称是阿尔法基地的斥候。\n“如果你要去Level 2，带上这个。你会需要的。”\n他扔给你一个手电筒。",
        choices: [
            { text: "接过手电筒并道谢", nextNodeId: "level1_leave_outpost", effect: { addItem: "flashlight" } }
        ]
    },
    "level1_leave_outpost": {
        id: "level1_leave_outpost",
        text: "告别了斥候，你继续上路。\n手电筒的光束穿透了浓雾，让你能看清更远的地方。\n但这也不一定是好事... 因为你看到前方黑暗中有一双反光的眼睛。",
        choices: [
            { text: "那是... 狗？", nextNodeId: "level1_hound_encounter" }
        ]
    },
    "level1_hound_intro": {
        id: "level1_hound_intro",
        text: "你选择避开营地，独自潜入黑暗。\n突然，你听到了一阵急促的、类似狗爪敲击地面的声音。\n哒、哒、哒。\n有什么东西在快速接近。",
        choices: [
            { text: "准备战斗", nextNodeId: "level1_hound_encounter" }
        ]
    },
    "level1_hound_encounter": {
        id: "level1_hound_encounter",
        text: "一只类人生物四肢着地，从阴影中爬了出来。\n它的头发凌乱油腻，嘴里长满了参差不齐的牙齿。\n是“猎犬”。它正死死盯着你，发出低沉的咆哮。",
        choices: [
            { text: "转身逃跑", nextNodeId: "level1_hound_death" },
            { text: "与它对视，缓慢后退", nextNodeId: "level1_hound_survive" }
        ]
    },
    "level1_hound_death": {
        id: "level1_hound_death",
        text: "恐惧让你本能地转身逃跑。\n这是一个致命的错误。\n猎犬的爆发力远超人类。你只感觉到背部一阵剧痛，然后世界陷入了黑暗。\n\n[你成为了它们的食物]",
        type: "ending",
        choices: [
            { text: "重新开始", nextNodeId: "start" }
        ]
    },
    "level1_hound_survive": {
        id: "level1_hound_survive",
        text: "你强忍着恐惧，死死盯着它的眼睛，一步一步向后退。\n猎犬似乎被你的目光震慑住了，它咆哮着，但没有扑上来。\n直到你退到一个拐角，它终于失去了兴趣，转身离开了。\n你的心脏几乎要跳出胸膛。",
        effect: { sanity: -10 },
        choices: [
            { text: "赶紧离开这片区域", nextNodeId: "level1_end" }
        ]
    },
    "level1_end": {
        id: "level1_end",
        text: "你走了很久，周围的温度开始逐渐升高。\n混凝土墙壁上开始出现生锈的管道，空气中弥漫着一股热蒸汽的味道。\n前方的走廊变得更加狭窄，黑暗中闪烁着红色的警示灯。",
        choices: [
            { text: "进入管道区域", nextNodeId: "level2_transition" }
        ]
    },

    // ==========================================
    // LEVEL 2 (Pipe Dreams)
    // ==========================================
    "level2_transition": {
        id: "level2_transition",
        text: "你钻进狭窄的通道，热浪扑面而来。\n这里的温度至少有40度。汗水瞬间浸透了你的衣服。\n墙壁上布满了生锈的管道，有些还在嘶嘶漏气。\n\n[进入 Level 2]",
        effect: { location: "LEVEL 2", sanity: -5 },
        environment: { theme: "level2", ambience: "level2" },
        choices: [
            { text: "忍受高温前行", nextNodeId: "level2_start" }
        ]
    },
    "level2_start": {
        id: "level2_start",
        text: "管道发出的噪音震耳欲聋。这里就像是一个巨大的、生锈的肠道。\n光线昏暗且发红，来自那些闪烁不定的应急灯。\n你感觉呼吸有些困难。",
        choices: [
            { text: "寻找出口", nextNodeId: "level2_corridor" }
        ]
    },
    "level2_corridor": {
        id: "level2_corridor",
        text: "你在迷宫般的管道间穿梭。有些管道烫得惊人，稍微触碰就会烫伤皮肤。\n前方似乎有一个岔路口。",
        choices: [
            { text: "左边 (有冷风)", nextNodeId: "level2_trap" },
            { text: "右边 (更热了)", nextNodeId: "level2_heat" }
        ]
    },
    "level2_trap": {
        id: "level2_trap",
        text: "你感觉到一丝冷风，欣喜若狂地冲了过去。\n但当你转过弯，发现那不是风，而是一根断裂的高压蒸汽管正在喷射。\n你勉强躲开，但手臂还是被烫出了一片水泡。",
        effect: { sanity: -10, hp: -20 },
        choices: [
            { text: "退回去", nextNodeId: "level2_corridor" }
        ]
    },
    "level2_heat": {
        id: "level2_heat",
        text: "你咬着牙走向更热的深处。直觉告诉你，这里反而是正确的路。\n突然，黑暗中出现了一张笑脸。\n一张惨白的、咧到耳根的巨大笑脸，漂浮在半空中。",
        choices: [
            { text: "盯着它看", nextNodeId: "level2_smiler_death" },
            { text: "慢慢后退，不要转身", nextNodeId: "level2_smiler_survive" },
            { text: "关掉手电筒", nextNodeId: "level2_smiler_survive", condition: (s) => s.inventory.some(i => i.id === 'flashlight') }
        ]
    },
    "level2_smiler_death": {
        id: "level2_smiler_death",
        text: "你被那诡异的笑容吸引，无法移开视线。\n那张脸越来越大，直到占据了你全部的视野。\n你听到了牙齿摩擦的声音，然后是... \n\n[连接中断]",
        type: "ending",
        choices: [
            { text: "重新连接", nextNodeId: "start" }
        ]
    },
    "level2_smiler_survive": {
        id: "level2_smiler_survive",
        text: "你知道那是“笑魇”。它们被光线吸引。\n你尽可能降低自己的存在感，慢慢退入阴影中。\n那张笑脸在原地徘徊了一会儿，然后飘向了别处。\n你活下来了。",
        effect: { sanity: -10 },
        choices: [
            { text: "尽快离开这里", nextNodeId: "level2_end" }
        ]
    },
    "level2_end": {
        id: "level2_end",
        text: "你在管道中挣扎了不知多久，终于发现前方有一扇普通的木门。\n这在充满金属和蒸汽的Level 2显得格格不入。\n你推开门，但迎面而来的不是霉味，而是一股浓烈的臭氧味。",
        choices: [
            { text: "跨过门槛", nextNodeId: "level3_transition" }
        ]
    },

    // ==========================================
    // LEVEL 3 (Electrical Station)
    // ==========================================
    "level3_transition": {
        id: "level3_transition",
        text: "周围的空间瞬间变得狭窄。你发现自己站在一条砖砌的走廊里。\n头顶上方，无数根粗大的黑色电缆像蛇一样缠绕在一起。\n偶尔有蓝白色的电火花爆裂，照亮了阴暗的角落。\n\n[进入 Level 3: 电站]",
        effect: { location: "LEVEL 3", sanity: -5 },
        environment: { theme: "level3", ambience: "level3" },
        choices: [
            { text: "小心前进", nextNodeId: "level3_start" }
        ]
    },
    "level3_start": {
        id: "level3_start",
        text: "这里的噪音比前几层都要大。电流的嗡嗡声几乎要钻进你的脑子里。\n你知道这一层极其危险。这里是实体的巢穴。\n你必须保持高度警惕。",
        choices: [
            { text: "寻找物资", nextNodeId: "level3_loot" },
            { text: "寻找出口", nextNodeId: "level3_corridor" }
        ]
    },
    "level3_loot": {
        id: "level3_loot",
        text: "你在一个变电箱后面发现了一个生锈的铁盒。\n里面有一些奇怪的晶体，散发着热量。\n这是... 火盐？\n旁边还有一瓶杏仁水。",
        choices: [
            { text: "拿走所有东西", nextNodeId: "level3_corridor", effect: { addItem: "firesalt" } } 
        ]
    },
    "level3_corridor": {
        id: "level3_corridor",
        text: "你转过拐角，突然看到前方有一团纠缠在一起的肢体。\n那是“肢团 (Clump)”。\n它似乎还没发现你，正在啃食着什么东西。",
        choices: [
            { text: "慢慢后退", nextNodeId: "level3_chase" },
            { text: "扔一块石头引开它", nextNodeId: "level3_distract" }
        ]
    },
    "level3_chase": {
        id: "level3_chase",
        text: "你的脚碰到了地上的碎砖。\n那团肢体瞬间停止了动作，无数只手臂指向了你。\n跑！",
        effect: { sanity: -15 },
        choices: [
            { text: "狂奔", nextNodeId: "level3_escape" }
        ]
    },
    "level3_distract": {
        id: "level3_distract",
        text: "你捡起一块砖头扔向远处。肢团发出一声尖啸，冲向了声音的来源。\n你趁机溜了过去。",
        choices: [
            { text: "继续前进", nextNodeId: "level3_escape" }
        ]
    },
    "level3_escape": {
        id: "level3_escape",
        text: "你气喘吁吁地跑进了一个死胡同。不，这里有一部电梯。\n电梯门半开着，里面透出柔和的蓝光。\n这与周围的地狱景象截然不同。",
        choices: [
            { text: "钻进电梯", nextNodeId: "level4_transition" }
        ]
    },

    // ==========================================
    // LEVEL 4 (Abandoned Office)
    // ==========================================
    "level4_transition": {
        id: "level4_transition",
        text: "电梯门缓缓关闭，隔绝了外面的噪音。\n当你再次走出来时，脚下是柔软的地毯，空气中弥漫着打印机墨粉的味道。\n窗外下着雨。\n\n[进入 Level 4: 废弃办公室]",
        effect: { location: "LEVEL 4", sanity: 20 },
        environment: { theme: "level4", ambience: "level4" },
        choices: [
            { text: "深吸一口气", nextNodeId: "level4_start" }
        ]
    },
    "level4_start": {
        id: "level4_start",
        text: "这里安静得让人想哭。没有怪物，没有高温，没有致幻的黄色。\n这只是一间普通的、空荡荡的办公室。\n你可以在这里稍作休息。",
        choices: [
            { text: "查看桌上的文件", nextNodeId: "level4_doc" },
            { text: "喝点饮水机的水", nextNodeId: "level4_water" }
        ]
    },
    "level4_doc": {
        id: "level4_doc",
        text: "文件上盖着 M.E.G. 的印章。\n“...Level 4 是安全的物流中心。流浪者应尽快前往 Level 11 (混凝土森林) 建立联系...”\n文件下面压着一张磁卡。",
        choices: [
            { text: "拿走磁卡并离开", nextNodeId: "level4_end", effect: { addItem: "metro_ticket" } } // 暂时用地铁票代替磁卡逻辑
        ]
    },
    "level4_water": {
        id: "level4_water",
        text: "这是真正的杏仁水喷泉！\n你大口痛饮，感觉理智正在迅速恢复。\n之前的恐惧仿佛都消散了。",
        effect: { sanity: 50, hp: 20 },
        choices: [
            { text: "继续探索", nextNodeId: "level4_end" }
        ]
    },
    "level4_end": {
        id: "level4_end",
        text: "虽然这里很安全，但你知道不能永远留在这里。\n你在走廊深处看到了一扇自动玻璃门，外面似乎是... 城市？\n另一边则是一台自动售货机，但这似乎是去往地铁站的路。",
        choices: [
            { text: "走出玻璃门 (前往 Level 11)", nextNodeId: "level11_transition" },
            { text: "寻找地铁站 (前往 Metro)", nextNodeId: "metro_station_enter" }
        ]
    },

    // ==========================================
    // LEVEL 7 (Thalassophobia - The Ocean)
    // ==========================================
    "level7_enter": {
        id: "level7_enter",
        text: "你感觉脚下一空，坠入了冰冷的水中。\n这里是 Level 7。头顶是混凝土天花板，脚下是无尽的深渊。\n你需要潜水装备才能深入，否则会因为体温过低而死。",
        environment: { theme: "level7", ambience: "underwater" }, 
        effect: { location: "LEVEL 7", hp: -5 },
        choices: [
            { 
                text: "潜入深处 (寻找 Level 8 入口)", 
                nextNodeId: "level8_transition", 
                condition: (s) => s.inventory.some(i => i.id === 'diving_gear')
            },
            {
                text: "没有装备，游回水面 (返回 Level 4)", 
                nextNodeId: "level4_start" 
            }
        ]
    },
    
    // ==========================================
    // LEVEL 8 (Cave System)
    // ==========================================
    "level8_transition": {
        id: "level8_transition",
        text: "你穿过了海底的岩石裂缝，发现了一个没有水的干燥洞穴。\n这里充满了蜘蛛网和不明粘液。\n[进入 Level 8: 洞穴系统]",
        effect: { location: "LEVEL 8", sanity: -20 },
        environment: { theme: "level8", ambience: "cave_wind" },
        choices: [
            { text: "小心前进", nextNodeId: "level8_start" }
        ]
    },
    "level8_start": {
        id: "level8_start",
        text: "黑暗中传来悉悉索索的声音。\n有什么东西在岩壁上爬行。\n你需要强光手电筒才能看清路。",
        choices: [
            { 
                text: "打开强光手电", 
                nextNodeId: "level8_spider_mother",
                condition: (s) => s.inventory.some(i => i.id === 'flashlight')
            },
            {
                text: "摸黑前进 (极度危险)",
                nextNodeId: "level8_death",
                effect: { hp: -100 }
            }
        ]
    },
    "level8_spider_mother": {
        id: "level8_spider_mother",
        text: "光束照亮了前方——一只巨大的蜘蛛堵住了去路。\n它是“蜘蛛之母”。\n它似乎在守护着身后的通道。",
        choices: [
            { text: "使用杀虫剂 (如果有)", nextNodeId: "level8_victory", condition: (s) => s.inventory.some(i => i.id === 'bug_spray') },
            { text: "逃跑", nextNodeId: "level7_enter" }
        ]
    },
    "level8_death": {
        id: "level8_death",
        text: "你在黑暗中被无数只小蜘蛛包围了。\n毒液注入了你的身体。\n你成为了它们的巢穴。",
        type: "ending",
        choices: [
            { text: "重新开始", nextNodeId: "start" }
        ]
    },
    "level8_victory": {
        id: "level8_victory",
        text: "蜘蛛之母被化学药剂驱散了。\n你穿过了它的巢穴，发现前方有一扇现代化的金属门。\n这在洞穴里显得格格不入。",
        choices: [
            { text: "打开门 (前往 Level 9)", nextNodeId: "level9_transition" }
        ]
    },

    // ==========================================
    // LEVEL 11 (Concrete Jungle - HUB)
    // ==========================================
    "level11_transition": {
        id: "level11_transition",
        text: "你推开玻璃门，一阵微风吹过。\n眼前是无尽的摩天大楼，天空是永恒的黄昏紫。\n街道干净得不自然，偶尔能看到其他流浪者匆匆走过。\n这里是 Level 11，后室中最安全的地方之一。\n\n[进入 Level 11: 混凝土森林]",
        effect: { location: "LEVEL 11", sanity: 10, addLog: "发现新区域: Level 11" },
        environment: { theme: "level11", ambience: "level11" },
        choices: [
            { text: "前往 M.E.G. 前哨站", nextNodeId: "level11_outpost" },
            { text: "探索街道", nextNodeId: "level11_street" }
        ]
    },
    "level11_outpost": {
        id: "level11_outpost",
        text: "M.E.G. 的 Alpha 基地坐落在一座巨大的银行大楼里。\n这里有武装警卫，甚至还有电力。\n大厅里有一个公告板和一个补给站。",
        choices: [
            { text: "查看公告板 (接取任务)", nextNodeId: "level11_board" },
            { text: "购买补给", nextNodeId: "level11_shop" },
            { text: "回到街道", nextNodeId: "level11_street" }
        ]
    },
    "level11_board": {
        id: "level11_board",
        text: "公告板上贴满了寻人启事和赏金任务。\n[任务: 建立前哨] 需要: 50 杏仁水, 5 电池。\n[任务: 寻找 K 博士] 状态: 悬赏中。",
        choices: [
            { text: "接取 '建立前哨'", nextNodeId: "level11_outpost", effect: { addQuest: "build_outpost" } },
            { text: "离开", nextNodeId: "level11_outpost" }
        ]
    },
    "level11_shop": {
        id: "level11_shop",
        text: "军需官正在擦拭一把霰弹枪。\n“杏仁水 10元，手电筒 50元。童叟无欺。”\n(当前资金: $0 - 你需要先找点值钱的东西卖)",
        choices: [
            { text: "没钱，离开", nextNodeId: "level11_outpost" }
        ]
    },
    "level11_street": {
        id: "level11_street",
        text: "你漫步在空旷的街道上。这里偶尔会有“无面人”经过，但它们通常是无害的。\n远处有一座地铁站的入口。",
        choices: [
            { text: "进入地铁站", nextNodeId: "metro_station_enter" },
            { text: "回到前哨站", nextNodeId: "level11_outpost" }
        ]
    },

    // ==========================================
    // THE METRO (Fast Travel Hub)
    // ==========================================
    "metro_station_enter": {
        id: "metro_station_enter",
        text: "地铁站里弥漫着臭氧和灰尘的味道。\n自动闸机闪烁着红灯。\n你需要一张车票才能进入。",
        choices: [
            { 
                text: "刷票进站", 
                nextNodeId: "metro_platform", 
                condition: (s) => s.inventory.some(i => i.id === 'metro_ticket'),
                effect: { removeItem: 'metro_ticket', addLog: "消耗: 地铁票" }
            },
            { text: "离开", nextNodeId: "level11_street" }
        ]
    },
    "metro_platform": {
        id: "metro_platform",
        text: "站台上空无一人。电子显示屏上列出了站点：\n1. Level 11 (当前)\n2. Level 9 (黑暗郊区) [危险]\n3. Level 36 (机场) [未解锁]",
        choices: [
            { text: "等待前往 Level 9 的列车", nextNodeId: "level9_transition" },
            { text: "出站 (Level 11)", nextNodeId: "level11_transition" }
        ]
    },
    "level9_transition": {
        id: "level9_transition",
        text: "列车呼啸而来，你走了上去。\n几分钟后，你到达了目的地。\n出站后，迎接你的是永恒的黑夜和闪烁的路灯。\n\n[进入 Level 9: 黑暗郊区]",
        effect: { location: "LEVEL 9", sanity: -10 },
        environment: { theme: "level9", ambience: "level9" }, // 需新增
        choices: [
            { text: "潜入夜色", nextNodeId: "start" } // 暂时循环回 start，待开发 Level 9
        ]
    },

    // ==========================================
    // LEVEL 52 (School Halls - The Academy)
    // ==========================================
    "level52_enter": {
        id: "level52_enter",
        text: "你推开一扇标着“校长室”的门，却发现自己站在一条充满消毒水味的走廊里。\n两旁的储物柜无限延伸，头顶的广播正在播放刺耳的下课铃。\n这里是 Level 52。\n你需要遵守校规才能生存。",
        environment: { theme: "level52", ambience: "school_bell" },
        effect: { location: "LEVEL 52", sanity: -5 },
        choices: [
            { text: "查看墙上的校规", nextNodeId: "level52_rules" },
            { text: "在走廊奔跑", nextNodeId: "level52_detention" }
        ]
    },
    "level52_rules": {
        id: "level52_rules",
        text: "校规第1条：禁止奔跑。\n校规第2条：上课铃响后必须进入教室。\n校规第3条：不要直视“老师”。\n\n广播突然响起：“距离上课还有10秒。”",
        choices: [
            { text: "走进最近的教室", nextNodeId: "level52_classroom" },
            { text: "继续留在走廊", nextNodeId: "level52_hallway_death" }
        ]
    },
    "level52_hallway_death": {
        id: "level52_hallway_death",
        text: "上课铃响了。\n走廊尽头出现了一个巨大的身影，手里拿着戒尺。\n“你迟到了。”\n\n[你被送去了永久禁闭室]",
        type: "ending",
        choices: [
            { text: "重新开始", nextNodeId: "start" }
        ]
    },
    "level52_classroom": {
        id: "level52_classroom",
        text: "教室里坐满了无面学生，它们正整齐地盯着黑板。\n黑板上写着复杂的数学公式，似乎也是通往下一层的密码。\n你需要一本历史课本才能解开谜题。",
        choices: [
            { 
                text: "使用历史课本 (如果有)", 
                nextNodeId: "level52_pass", 
                condition: (s) => s.inventory.some(i => i.id === 'history_book')
            },
            { text: "试图作弊", nextNodeId: "level52_detention" },
            { text: "安静地坐着等待下课", nextNodeId: "level52_wait" }
        ]
    },
    "level52_pass": {
        id: "level52_pass",
        text: "你将课本上的年代代入公式，黑板缓缓移开，露出了一条密道。\n这是一条通往 Level 188 的捷径。",
        choices: [
            { text: "钻进密道", nextNodeId: "level188_enter" }
        ]
    },
    "level52_detention": {
        id: "level52_detention",
        text: "你违反了校规。\n视线变得模糊，你被传送到了“禁闭室”。\n这里没有光，没有声音，只有无尽的时间流逝。\n[SAN值归零]",
        effect: { sanity: -100 },
        type: "ending",
        choices: [
            { text: "重新开始", nextNodeId: "start" }
        ]
    },
    "level52_wait": {
        id: "level52_wait",
        text: "你坐了整整45分钟。下课铃终于响了。\n虽然安全，但你什么也没发现。\n你回到了走廊。",
        effect: { sanity: -10 },
        choices: [
            { text: "继续探索", nextNodeId: "level52_enter" }
        ]
    },

    // ==========================================
    // LEVEL 188 (The Windows)
    // ==========================================
    "level188_enter": {
        id: "level188_enter",
        text: "你从密道爬出，发现自己在一个巨大的天井庭院里。\n四周的墙壁上密密麻麻布满了窗户。\n这里是 Level 188。\n大多数窗户后面是虚空，但有一扇是通往终焉的门。",
        environment: { theme: "level188", ambience: "wind_howl" },
        effect: { location: "LEVEL 188" },
        choices: [
            { text: "寻找亮着灯的窗户", nextNodeId: "level188_search" },
            { text: "扔一块石头试探", nextNodeId: "level188_throw" }
        ]
    },
    "level188_search": {
        id: "level188_search",
        text: "你发现了一扇透出霓虹光芒的窗户。\n里面似乎是一间充满了80年代风格的游戏厅。\n那是传说中的 Level 3999 吗？",
        choices: [
            { text: "爬进去", nextNodeId: "level3999_enter" }
        ]
    },
    "level188_throw": {
        id: "level188_throw",
        text: "石头击碎了一扇窗户，但没有落地声。\n几秒钟后，那扇窗户里伸出了一只巨大的黑色手臂。\n窗户实体 (The Window) 被激怒了。",
        effect: { sanity: -20 },
        choices: [
            { text: "快跑！寻找其他窗户", nextNodeId: "level188_search" }
        ]
    },

    // ==========================================
    // LEVEL 3999 (The True Arcade)
    // ==========================================
    "level3999_enter": {
        id: "level3999_enter",
        text: "你从窗户翻入，落在一堆紫色的懒人沙发上。\n空气中弥漫着爆米花和旧地毯的味道。\n霓虹灯牌写着“LEVEL 3999”。\n这里是通往自由的最后一站。",
        environment: { theme: "level3999", ambience: "arcade_music" },
        effect: { location: "LEVEL 3999", sanity: 100, addLog: "到达: 终焉前厅" },
        choices: [
            { text: "寻找出口", nextNodeId: "level3999_task" }
        ]
    },
    "level3999_task": {
        id: "level3999_task",
        text: "一个戴着墨镜的管理员拦住了你。\n“想出去？先完成这里的指标。”\n你需要证明你不仅仅是一个数据包。",
        choices: [
            { 
                text: "交付 'K博士的信标' (真相线)", 
                nextNodeId: "ending_truth", 
                condition: (s) => s.inventory.some(i => i.id === 'k_beacon')
            },
            { 
                text: "交付 '奇怪的符文' (混沌线)", 
                nextNodeId: "ending_chaos", 
                condition: (s) => s.inventory.some(i => i.id === 'strange_rune')
            },
            { 
                text: "强行闯关 (前往 The End)", 
                nextNodeId: "the_end_enter"
            }
        ]
    },

    // ==========================================
    // THE END (Fake Reality)
    // ==========================================
    "the_end_enter": {
        id: "the_end_enter",
        text: "你推开了一扇写着“EXIT”的门。\n你发现自己在一个巨大的图书馆里。\n所有的书都是空白的。\n一台电脑屏幕上显示着：“恭喜通关”。",
        environment: { theme: "the_end", ambience: "silence" },
        effect: { location: "THE END" },
        choices: [
            { text: "点击屏幕上的 '退出游戏'", nextNodeId: "fake_ending" },
            { text: "寻找隐藏的后台指令", nextNodeId: "true_ending_path" }
        ]
    },
    "fake_ending": {
        id: "fake_ending",
        text: "系统正在关闭...\n再见，流浪者。\n\n[你回到了现实... 或者只是另一个更真实的梦境？]",
        type: "ending",
        choices: [
            { text: "重新开始", nextNodeId: "start" }
        ]
    },
    "true_ending_path": {
        id: "true_ending_path",
        text: "你敲击键盘，输入了 RUN ORPHEUS_PROTOCOL.EXE。\n图书馆开始崩塌。\n你看见了代码的底层。\n你看见了 K 博士。\n他微笑着向你伸出手。",
        type: "ending",
        choices: [
            { text: "拥抱奇点 (真结局)", nextNodeId: "start" }
        ]
    },
    
    // 分支结局
    "ending_truth": {
        id: "ending_truth",
        text: "你交出了信标。管理员摘下墨镜，他是 K 博士的投影。\n“你做到了。现在，我们去重启这个世界。”\n[结局：守护者]",
        type: "ending",
        choices: [{ text: "新游戏+", nextNodeId: "start" }]
    },
    "ending_chaos": {
        id: "ending_chaos",
        text: "符文开始燃烧。整个街机厅被蓝色的火焰吞噬。\n你感到无比的自由。\n你不再是人，你是后室的一部分。\n[结局：同化]",
        type: "ending",
        choices: [{ text: "新游戏+", nextNodeId: "start" }]
    }
};

// 导出数据供引擎使用
window.storyData = storyData;