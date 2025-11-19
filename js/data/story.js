// 剧情数据文件
// 结构: ID -> Node对象
const storyData = {
    "start": {
        id: "start",
        text: "初始化系统...\n[正在连接到现实切片...]\n错误：定位失败。\n重试中... [成功]\n\n你睁开眼睛。周围是一片令人不安的寂静。",
        // 强制重置环境为 Level 0
        environment: { theme: "level0", ambience: "level0" },
        effect: { sanity: 100, location: "REALITY" }, // 重置状态
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
        text: "你在黄色的迷宫中漫无目的地游荡。时间在这里失去了意义。\n墙上的壁纸有些地方剥落了，露出下面... 更深一层的壁纸。\n\n突然，你注意到前方的墙壁有些<span class='glitch-text' data-text='扭曲'>扭曲</span>。",
        choices: [
            { text: "靠近查看", nextNodeId: "noclip_attempt" },
            { text: "绕开它", nextNodeId: "level0_corridor" }
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
    "level0_corridor": {
        id: "level0_corridor",
        text: "你选择远离那块异常的区域。继续在这单调的地狱中前行。\n无论往哪个方向走，看到的都是同样的黄色壁纸和发霉的地毯。\n你感到越来越渴了。",
        choices: [
            { text: "向左拐", nextNodeId: "level0_left" },
            { text: "向右拐", nextNodeId: "level0_right" },
            { text: "寻找水源", nextNodeId: "level0_water" }
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
            { text: "不敢喝，离开", nextNodeId: "level0_corridor" }
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
    "level0_water": {
        id: "level0_water",
        text: "你试图寻找水源，但这里只有潮湿的地毯。\n如果你愿意，你可以吸吮地毯里的积水。\n这个想法一出现，你就想吐。",
        choices: [
            { text: "还是算了", nextNodeId: "level0_corridor" },
            { text: "真的太渴了...", nextNodeId: "level0_carpet_water" }
        ]
    },
    "level0_carpet_water": {
        id: "level0_carpet_water",
        text: "绝望驱使你趴在地上。地毯里的水有一股霉味和化学药剂的味道。\n你喝了几口，胃里一阵翻腾。\n但这至少是水。\n[SAN值大幅下降]",
        effect: { sanity: -20 },
        choices: [
            { text: "站起来", nextNodeId: "level0_corridor" }
        ]
    },
    "level1_transition": {
        id: "level1_transition",
        text: "世界在你眼前崩塌。重力翻转，光线在视网膜上灼烧出奇怪的图案。\n当你再次恢复知觉时，地毯的霉味消失了。\n取而代之的是... 湿润混凝土的气味。\n\n[进入 Level 1]",
        effect: { location: "LEVEL 1", sanity: 10 },
        environment: { theme: "level1", ambience: "level1" },
        choices: [
             { text: "睁开眼睛", nextNodeId: "level1_start" }
        ]
    },
    "level1_start": {
        id: "level1_start",
        text: "你躺在冰冷粗糙的混凝土地面上。四周的光线比Level 0暗淡许多，但也不再是那种令人作呕的单调黄色。\n这里像是一个巨大的地下仓库，空气中弥漫着浓重的水雾。\n远处传来低沉的机械运作声。",
        choices: [
            { text: "站起来检查身体", nextNodeId: "level1_status" },
            { text: "观察周围环境", nextNodeId: "level1_look" }
        ]
    },
    "level1_status": {
        id: "level1_status",
        text: "除了些许擦伤，你看起来没事。但那种穿越层级带来的眩晕感挥之不去。\n你的衣服被地上的积水浸湿了，冰冷刺骨。",
        choices: [
            { text: "探索这片区域", nextNodeId: "level1_explore" }
        ]
    },
    "level1_look": {
        id: "level1_look",
        text: "墙壁和地面都是裸露的混凝土。天花板上有一些裸露的钢筋和忽明忽暗的灯泡。\n每隔一段距离，地上就有一滩积水。水面上漂浮着淡淡的油花。",
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
            { text: "拿走杏仁水", nextNodeId: "level1_loot_water", effect: { sanity: 15 } },
            { text: "全部拿走", nextNodeId: "level1_loot_all", effect: { sanity: 20 } }
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
        text: "你贪婪地搜刮了一切。背包变得沉甸甸的。\n哪怕是那些干燥无味的饼干，也是难得的美味。\n[获得: 皇家口粮]",
        choices: [
            { text: "离开", nextNodeId: "level1_corridor" }
        ]
    },
    "level1_corridor": {
        id: "level1_corridor",
        text: "走廊尽头出现了一个人影。\n它背对着你，穿着普通的便服，身材高大。\n它站在那里一动不动，似乎在凝视着墙壁。",
        choices: [
            { text: "试着打招呼", nextNodeId: "level1_faceling_talk" },
            { text: "悄悄绕过去", nextNodeId: "level1_faceling_sneak" }
        ]
    },
    "level1_faceling_talk": {
        id: "level1_faceling_talk",
        text: "“你好？”你试探性地问道。\n那个人影缓慢地转过身来。\n它的脸上... 没有五官。原本应该是眼睛、鼻子和嘴巴的地方，只有平滑的皮肤。\n它歪了歪头，似乎对你没有敌意，然后转身走进了黑暗中。",
        effect: { sanity: -5 },
        choices: [
            { text: "深吸一口气，继续走", nextNodeId: "level1_end" }
        ]
    },
    "level1_faceling_sneak": {
        id: "level1_faceling_sneak",
        text: "你屏住呼吸，贴着墙根慢慢挪动。\n那个无面人似乎并没有注意到你，或者它根本不在乎。\n你成功绕过了它。",
        choices: [
            { text: "继续前进", nextNodeId: "level1_end" }
        ]
    },
    "level1_end": {
        id: "level1_end",
        text: "你走了很久，周围的温度开始逐渐升高。\n混凝土墙壁上开始出现生锈的管道，空气中弥漫着一股热蒸汽的味道。\n前方的走廊变得更加狭窄，黑暗中闪烁着红色的警示灯。",
        choices: [
            { text: "进入管道区域", nextNodeId: "level2_transition" }
        ]
    },
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
        effect: { sanity: -10 },
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
            { text: "关掉手电筒 (如果有)", nextNodeId: "level2_smiler_survive" } // 假设逻辑
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
            { text: "拿走所有东西", nextNodeId: "level3_corridor", effect: { sanity: 10 } }
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
        text: "文件上盖着 M.E.G. 的印章。\n“...Level 4 是安全的物流中心。流浪者应尽快前往最近的前哨站...”\n看来你终于到了一个安全的地方。",
        choices: [
            { text: "继续探索", nextNodeId: "level4_end" }
        ]
    },
    "level4_water": {
        id: "level4_water",
        text: "这是真正的杏仁水喷泉！\n你大口痛饮，感觉理智正在迅速恢复。\n之前的恐惧仿佛都消散了。",
        effect: { sanity: 50 },
        choices: [
            { text: "继续探索", nextNodeId: "level4_end" }
        ]
    },
    "level4_end": {
        id: "level4_end",
        text: "虽然这里很安全，但你知道不能永远留在这里。\n你在走廊深处听到了一阵优雅的爵士乐声。\n那扇复古的旋转门后，似乎是一家酒店...",
        choices: [
            { text: "推开旋转门 (前往 Level 5)", nextNodeId: "start" } // 暂时循环
        ]
    }
};

// 导出数据供引擎使用
window.storyData = storyData;