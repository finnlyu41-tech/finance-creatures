/* Original comic copy and character settings. Entertainment only; not a psychometric scale. */
(function(root){
  "use strict";
  const data = {
  "version": "0.2.0",
  "contentVersion": "0.5",
  "types": [
    {
      "id": "goodwill",
      "name": "商誉",
      "label": "一请假，群里就对线",
      "code": "GW",
      "tagline": "我的价值，等我请假那天你们再测。",
      "paragraphs": [
        "客户说听不懂，你翻译。\n同事快吵起来，你劝。\n老板说气氛有点僵，你甚至得笑。",
        "账上没有“幸好有你”这个科目。",
        "所以你的主要贡献，\n目前统一归类为：顺手。"
      ],
      "catchphrase": "“先别急，我来问问。”",
      "habitat": "任何即将冷场的会议。",
      "nemesis": "“你也没做什么具体的事吧？”",
      "nickname": "人类兼容补丁",
      "equipment": [
        "人类语言翻译器",
        "救场笑容",
        "没有工时的安抚"
      ],
      "roasts": [
        "你是团队的润滑油，但没人给你做保养。",
        "别人打开Excel，你打开大家的心结。",
        "你请一天假，群聊就能拍一季综艺。"
      ],
      "accent": "#b96754",
      "soft": "#faece6",
      "image": "./assets/characters/goodwill.webp",
      "imageAlt": "商誉的原创几何人物插画：人类兼容补丁"
    },
    {
      "id": "provision",
      "name": "预计负债",
      "label": "人还没到，内心已加班",
      "code": "PV",
      "tagline": "事情还没发生，我先累为敬。",
      "paragraphs": [
        "领导发来“在吗”。\n你已经想好了延期理由、辞职交接，以及回老家养什么。",
        "两分钟后，对方说：“发错了。”",
        "事情撤回了。\n你提前上的那个班，没人给调休。"
      ],
      "catchphrase": "“没事，我已经想过更糟的了。”",
      "habitat": "“对方正在输入…”的那三分钟。",
      "nemesis": "“明天找你聊聊，不是什么大事。”",
      "nickname": "提前受苦冠军",
      "equipment": [
        "脑内连续剧",
        "随身小乌云",
        "尚未发生的加班"
      ],
      "roasts": [
        "你的想象力，主要用于给自己添堵。",
        "事情只有一份，你的预案开了十二个窗口。",
        "领导的“在吗”，是你的情绪启动项。"
      ],
      "accent": "#766088",
      "soft": "#f0ebf4",
      "image": "./assets/characters/provision.webp",
      "imageAlt": "预计负债的原创几何人物插画：提前受苦冠军"
    },
    {
      "id": "construction",
      "name": "在建工程",
      "label": "已经在准备开始了",
      "code": "WIP",
      "tagline": "我要做的很简单，所以先重构一下人生。",
      "paragraphs": [
        "本来只想做张表。\n现在你有了新模板、新工具，以及一套全新的文件命名规范。",
        "正事还没动，\n“如何高效做这件事”的文档写了八页。",
        "不要催。\n我已经在准备开始筹备了。"
      ],
      "catchphrase": "“等我先把框架搭好。”",
      "habitat": "final_最终版_真的最终版_v8。",
      "nemesis": "“先给我一个能用的。”",
      "nickname": "永久施工现场",
      "equipment": [
        "没有日期的蓝图",
        "升级中的框架",
        "竣工延期通知"
      ],
      "roasts": [
        "你不是没执行力，你把执行力用来准备执行。",
        "你的待办事项里，第一项是优化待办事项。",
        "事情越小，你的前期工程越大。"
      ],
      "accent": "#a77528",
      "soft": "#faf0d8",
      "image": "./assets/characters/construction.webp",
      "imageAlt": "在建工程的原创几何人物插画：永久施工现场"
    },
    {
      "id": "other-receivables",
      "name": "其他应收款",
      "label": "不知道找谁，就先找你",
      "code": "OR",
      "tagline": "别人说“其他”，你说“到”。",
      "paragraphs": [
        "报销找你，打印机也找你。\n谁都不知道归谁管的事，最后精准归你。",
        "你的岗位叫会计，\n实际工作范围取决于今天谁路过。",
        "每次听到“就帮一下”，\n你的人生又多了一张明细表。"
      ],
      "catchphrase": "“行，你先发我。”",
      "habitat": "所有部门的工作交界处。",
      "nemesis": "“你反正比较熟。”",
      "nickname": "办公室万能插座",
      "equipment": [
        "八个工作群",
        "别人的烂尾活",
        "用不完的“顺便”"
      ],
      "roasts": [
        "你的岗位说明书，应该加个“等”字。",
        "别人跨部门协作，你被跨部门使用。",
        "你不是人手不够，你是所有人的人手。"
      ],
      "accent": "#507a99",
      "soft": "#e8f0f5",
      "image": "./assets/characters/other-receivables.webp",
      "imageAlt": "其他应收款的原创几何人物插画：办公室万能插座"
    },
    {
      "id": "depreciated",
      "name": "已提足折旧",
      "label": "能运行，不要拍打",
      "code": "DEP",
      "tagline": "人没报废，表情已经停止更新。",
      "paragraphs": [
        "刚入职时，眼里有光。\n现在也有，是显示器的反光。",
        "你可以做。\n但别要求你边做边说“这太有挑战性了”。",
        "公司：经验越来越丰富。\n你：说明书里写的保养呢？"
      ],
      "catchphrase": "“能做。别加别的。”",
      "habitat": "工位上，靠咖啡维持连接。",
      "nemesis": "“你有经验，顺便再带一个。”",
      "nickname": "低电量老功臣",
      "equipment": [
        "旧模板",
        "续命咖啡",
        "出厂时的热情（已失联）"
      ],
      "roasts": [
        "别人的成长是升级，你的成长是耐摔。",
        "你的情绪不是稳定，是没电。",
        "公司把你当骨干，你只想找个靠背。"
      ],
      "accent": "#647761",
      "soft": "#eaf0e4",
      "image": "./assets/characters/depreciated.webp",
      "imageAlt": "已提足折旧的原创几何人物插画：低电量老功臣"
    },
    {
      "id": "receivables",
      "name": "应收账款",
      "label": "每天对着空气施法",
      "code": "AR",
      "tagline": "我的“烦请”，像发给了许愿池。",
      "paragraphs": [
        "“今天给。”“明天一定。”“刚发了呀。”\n你已收集齐三个版本的童话。",
        "你和对方最稳定的关系，\n是你发消息，他负责存在。",
        "对方终于说“收到”。\n你甚至想回一句：谢谢你证明互联网还通着。"
      ],
      "catchphrase": "“温馨提醒一下，再温馨提醒一下。”",
      "habitat": "已发送邮件，以及迟迟不来的附件。",
      "nemesis": "“你怎么不早点催？”",
      "nickname": "礼貌催件永动机",
      "equipment": [
        "礼貌模板",
        "未读消息",
        "没有附件的邮件"
      ],
      "roasts": [
        "你发的不是邮件，是连续剧，天天更新。",
        "你的“烦请”，是办公室里最克制的咒语。",
        "别人等爱情，你等一份盖章扫描件。"
      ],
      "accent": "#7b6094",
      "soft": "#f0eaf7",
      "image": "./assets/characters/receivables.webp",
      "imageAlt": "应收账款的原创几何人物插画：礼貌催件永动机"
    },
    {
      "id": "fixed-asset",
      "name": "固定资产",
      "label": "人可以变，椅子不能换",
      "code": "FA",
      "tagline": "公司可以转型。我的靠垫不行。",
      "paragraphs": [
        "你知道哪块地砖会响，\n几点茶水间没人，哪把椅子不会暗算腰。",
        "老板说：“我们要拥抱变化。”\n你把自己的马克杯往怀里挪了挪。",
        "战略随便灵活。\n这块地方我已经盘出包浆了。"
      ],
      "catchphrase": "“现在这套不挺好的吗？”",
      "habitat": "同一把椅子，同一个杯子旁边。",
      "nemesis": "“下周开始共享工位。”",
      "nickname": "工位原住民",
      "equipment": [
        "私人靠垫",
        "祖传快捷键",
        "雷打不动的午饭"
      ],
      "roasts": [
        "你不是不愿改变，你是已经配置好了。",
        "公司资产盘点时，你最好举一下手。",
        "工位是租的，感情是不动产。"
      ],
      "accent": "#507895",
      "soft": "#e6eef6",
      "image": "./assets/characters/fixed-asset.webp",
      "imageAlt": "固定资产的原创几何人物插画：工位原住民"
    },
    {
      "id": "windfall",
      "name": "营业外收入",
      "label": "正事不一定顺，蛋挞一定香",
      "code": "JOY",
      "tagline": "工资还没涨，蛋挞先到账。",
      "paragraphs": [
        "客户改了三遍需求。\n但同事多点了一份点心，你突然觉得世界还能处。",
        "会议取消：赚了。\n电梯刚好到：又赚了。",
        "人生主营业务暂时一般，\n但你很擅长从边角料里分红。"
      ],
      "catchphrase": "“等一下，今天有奶茶！”",
      "habitat": "下午茶群，和任何突然空出的十分钟。",
      "nemesis": "“这有什么值得高兴的？”",
      "nickname": "快乐捡漏王",
      "equipment": [
        "隐藏优惠券",
        "多出来的蛋挞",
        "自带的小开心"
      ],
      "roasts": [
        "你的人生财报，靠营业外项目撑得很热闹。",
        "公司画的大饼你不信，小饼干你真吃。",
        "苦可以明天再吃，蛋挞凉了就不好吃了。"
      ],
      "accent": "#b67a22",
      "soft": "#fcf0d8",
      "image": "./assets/characters/windfall.webp",
      "imageAlt": "营业外收入的原创几何人物插画：快乐捡漏王"
    },
    {
      "id": "skepticism",
      "name": "职业怀疑",
      "label": "你说确定，我说依据呢",
      "code": "PS",
      "tagline": "你说“没问题”，我听见了立项通知。",
      "paragraphs": [
        "“一直都这样。”\n——一直是从哪一天开始的？",
        "“你就相信我。”\n——好的，那原始资料呢？",
        "你不是爱抬杠。\n你只是对“放心”这种文件格式不兼容。"
      ],
      "catchphrase": "“你这个结论怎么来的？”",
      "habitat": "每一个“肯定”后面。",
      "nemesis": "“差不多就行。”",
      "nickname": "人形问号",
      "equipment": [
        "放大镜",
        "确认邮件",
        "打不开的“放心”"
      ],
      "roasts": [
        "别人发三个感叹号，你回三个问题。",
        "世界上最短的悬疑小说：“这张表肯定对。”",
        "你谈恋爱听到“永远”，可能会先确认期间。"
      ],
      "accent": "#4d7468",
      "soft": "#e5f0e9",
      "image": "./assets/characters/skepticism.webp",
      "imageAlt": "职业怀疑的原创几何人物插画：人形问号"
    },
    {
      "id": "materiality",
      "name": "重要性水平",
      "label": "认真归认真，周末归周末",
      "code": "MAT",
      "tagline": "这事不配占用我的周末。",
      "paragraphs": [
        "领导：每件事都很重要。\n你：那总得有一个排队规则吧。",
        "真正影响结果的，你会管。\n标题第四次改颜色，不配拥有你的一生。",
        "你不是没有责任心。\n你只是把自己也列进了保护范围。"
      ],
      "catchphrase": "“急到什么程度？比我吃饭还急？”",
      "habitat": "17:59，鼠标已经在关机按钮附近。",
      "nemesis": "“下班前顺便……”",
      "nickname": "下班边界管理员",
      "equipment": [
        "任务优先级",
        "已订好的晚饭",
        "不自动续期的耐心"
      ],
      "roasts": [
        "你不是不在状态，是状态有下班时间。",
        "你愿意为工作负责，但不想为所有人的临时起意负责。",
        "你把“都行”留给了午饭，不是加班。"
      ],
      "accent": "#b56d5d",
      "soft": "#faebe5",
      "image": "./assets/characters/materiality.webp",
      "imageAlt": "重要性水平的原创几何人物插画：下班边界管理员"
    },
    {
      "id": "substance",
      "name": "实质重于形式",
      "label": "先别演示，告诉我省在哪",
      "code": "SUB",
      "tagline": "数字化转型：从填四张表，变成填五张。",
      "paragraphs": [
        "新流程发布会上，大家都说“赋能”。\n你只问：“所以到底少点了几次鼠标？”",
        "答案是多点六次。",
        "你不反对仪式感。\n你反对它每天找你收过路费。"
      ],
      "catchphrase": "“能用就行，别再加一层。”",
      "habitat": "所有新流程的提问环节。",
      "nemesis": "“我们先建一个台账，管理这些台账。”",
      "nickname": "形式主义拆解员",
      "equipment": [
        "实用小工具",
        "一把扳手",
        "被删掉的多余步骤"
      ],
      "roasts": [
        "别人优化汇报，你优化不需要汇报的部分。",
        "你的浪漫，是少填一张重复的表。",
        "你最爱问的一句：原来那个按钮去哪了？"
      ],
      "accent": "#398477",
      "soft": "#e2f1eb",
      "image": "./assets/characters/substance.webp",
      "imageAlt": "实质重于形式的原创几何人物插画：形式主义拆解员"
    },
    {
      "id": "going-concern",
      "name": "持续经营",
      "label": "口头破产，实际营业",
      "code": "GC",
      "tagline": "昨晚宣布不干，今早准时开张。",
      "paragraphs": [
        "周一：不干了。\n周二：这次真的不干了。\n周三：先把这一单做完。",
        "你的辞职宣言像天气预报。\n朋友会看，但已经不据此安排出行。",
        "也没什么远大理想。\n今天的咖啡还热着，先把招牌挂起来。"
      ],
      "catchphrase": "“行吧，来都来了。”",
      "habitat": "每一个重新打开电脑的早上。",
      "nemesis": "“你上个月也是这么说的。”",
      "nickname": "每日重新开张",
      "equipment": [
        "热咖啡",
        "没发出去的辞职信",
        "每天续费的勇气"
      ],
      "roasts": [
        "你的离职计划已经进入长期滚动预测。",
        "你不是打不倒，是闹钟每天把你扶起来。",
        "大不了不干了。小不了，还是干了。"
      ],
      "accent": "#ab792d",
      "soft": "#f8edd7",
      "image": "./assets/characters/going-concern.webp",
      "imageAlt": "持续经营的原创几何人物插画：每日重新开张"
    }
  ],
  "questions": [
    {
      "id": "q01",
      "title": "领导只发了两个字：“在吗？”",
      "options": [
        {
          "text": "人在，魂已开始写离职交接。",
          "type": "provision",
          "reaction": "对方正在输入，你的人生已经快进。"
        },
        {
          "text": "什么事？请勿使用悬疑片式沟通。",
          "type": "skepticism",
          "reaction": "有些“在吗”，应该直接附上案情。"
        },
        {
          "text": "回一个“在”。情绪服务不在本月套餐里。",
          "type": "depreciated",
          "reaction": "基础版在线。热情需要另外充值。"
        },
        {
          "text": "在。刚才不想干了，现在又开张了。",
          "type": "going-concern",
          "reaction": "营业执照差点撕了，又粘回去了。"
        }
      ],
      "scene": "工作群 · 17:58"
    },
    {
      "id": "q02",
      "title": "同事：“就帮个小忙，应该很快。”",
      "options": [
        {
          "text": "发我吧。我的“其他”明细账不差这一项。",
          "type": "other-receivables",
          "reaction": "你一伸手，岗位边界又往后退了一米。"
        },
        {
          "text": "多小？请用分钟，不要用形容词。",
          "type": "materiality",
          "reaction": "“很快”不是一个可用的计量单位。"
        },
        {
          "text": "先帮你稳住群里快吵起来的两位。",
          "type": "goodwill",
          "reaction": "今日隐藏岗位：人类兼容补丁。"
        },
        {
          "text": "先看能不能以后都不用帮这个忙。",
          "type": "substance",
          "reaction": "你的目标是彻底消灭这个“小忙”。"
        }
      ],
      "scene": "新任务已送达"
    },
    {
      "id": "q03",
      "title": "你说：“我今天要提高效率。”两小时后——",
      "options": [
        {
          "text": "工作还没动，工具箱像要去拯救世界。",
          "type": "construction",
          "reaction": "磨刀两小时，顺便给刀做个管理系统。"
        },
        {
          "text": "试了一圈，还是旧模板顺手。喜提原地升级。",
          "type": "fixed-asset",
          "reaction": "版本没变，信念更坚定了。"
        },
        {
          "text": "删了一个多余步骤。没有汇报PPT。",
          "type": "substance",
          "reaction": "你连“提高效率”这件事也不想走形式。"
        },
        {
          "text": "发现下午茶有第二杯半价。效率另说，先省了。",
          "type": "windfall",
          "reaction": "不是跑题，是快乐优先入账。"
        }
      ],
      "scene": "效率提升计划 · 第一天"
    },
    {
      "id": "q04",
      "title": "对方：“资料发你了。”你点开：没有附件。",
      "options": [
        {
          "text": "发出今日第六声“烦请”。不知道在求哪路神仙。",
          "type": "receivables",
          "reaction": "邮件服务器正常，愿望暂未实现。"
        },
        {
          "text": "发哪了？几时发的？请出示案发现场。",
          "type": "skepticism",
          "reaction": "附件失踪案正式立项。"
        },
        {
          "text": "已经在想：今晚外卖要点能放多久的。",
          "type": "provision",
          "reaction": "资料还没到，夜宵已经排期。"
        },
        {
          "text": "把三个人拉进群，最后自己负责四处转发。",
          "type": "other-receivables",
          "reaction": "系统终于互通了，接口还是你。"
        }
      ],
      "scene": "收件箱 · 附件数量 0"
    },
    {
      "id": "q05",
      "title": "今天真的能准时下班，你最先想到——",
      "options": [
        {
          "text": "那家蛋挞应该还热着。今天有盼头了。",
          "type": "windfall",
          "reaction": "主营业务一般，快乐及时确认。"
        },
        {
          "text": "按老路线回家，坐我已经盘熟的沙发。",
          "type": "fixed-asset",
          "reaction": "在公司固定，在家继续固定。"
        },
        {
          "text": "太好了，我订的晚饭终于不是一个风险事项。",
          "type": "materiality",
          "reaction": "你的生活也配拥有按时交付。"
        },
        {
          "text": "又苟过一天。明天的我，交给你了。",
          "type": "going-concern",
          "reaction": "本日已结账，明日另行开张。"
        }
      ],
      "scene": "下班倒计时 · 今日罕见无急事"
    },
    {
      "id": "q06",
      "title": "对方看了你半天的成果：“这不挺简单的吗？”",
      "options": [
        {
          "text": "哈哈是啊。你没看到的争执，都被我静音了。",
          "type": "goodwill",
          "reaction": "这句“哈哈”，含有未计价的情绪劳动。"
        },
        {
          "text": "这才哪到哪，我连升级路线图都画好了。",
          "type": "construction",
          "reaction": "不要激我，我会再开一个项目。"
        },
        {
          "text": "能简单用最好。你别要求我再做得复杂一点。",
          "type": "substance",
          "reaction": "简单不是缺点，是你努力的方向。"
        },
        {
          "text": "对。因为我已经在这个坑里开出快捷通道了。",
          "type": "depreciated",
          "reaction": "熟能生巧，也熟能面无表情。"
        }
      ],
      "scene": "成果验收 · 一句轻飘飘的评价"
    },
    {
      "id": "q07",
      "title": "刚坐下，原定计划全部推倒重来。你——",
      "options": [
        {
          "text": "好，重开。我对“重新开始”已经很熟了。",
          "type": "going-concern",
          "reaction": "每日任务：先恢复营业。"
        },
        {
          "text": "还好，我昨晚已经想到了这出。坏了，还有第二出。",
          "type": "provision",
          "reaction": "你的预案里，甚至包含预案失效。"
        },
        {
          "text": "谁说要推倒的？需求到底改了哪一条？",
          "type": "skepticism",
          "reaction": "先别掀桌，证据链还没摆好。"
        },
        {
          "text": "人可以改计划。能别顺便改我模板的列顺序吗？",
          "type": "fixed-asset",
          "reaction": "A列就是A列。这是你的底线之一。"
        }
      ],
      "scene": "周一 · 09:01"
    },
    {
      "id": "q08",
      "title": "“还得是你，别人都不行！”你听出了——",
      "options": [
        {
          "text": "一个新任务正在骑马赶来的声音。",
          "type": "other-receivables",
          "reaction": "夸奖尚未到账，任务先到账了。"
        },
        {
          "text": "又该我出面，把气氛从冰点拉回常温了。",
          "type": "goodwill",
          "reaction": "你是会计，也是移动暖场设备。"
        },
        {
          "text": "那有奶茶吗？精神奖励能加珍珠吗？",
          "type": "windfall",
          "reaction": "请将口头激励兑换为可食用资产。"
        },
        {
          "text": "夸我可以。给我加活需要另开会计期间。",
          "type": "materiality",
          "reaction": "赞美不自动生成无限工作额度。"
        }
      ],
      "scene": "工作群 · @了你好几次"
    },
    {
      "id": "q09",
      "title": "你打开新系统，第一句话是——",
      "options": [
        {
          "text": "终于可以重新搭一套完美的工作流了！",
          "type": "construction",
          "reaction": "注意，一项新工程已破土动工。"
        },
        {
          "text": "我那一百封催件邮件还在吗？那是我的施法记录。",
          "type": "receivables",
          "reaction": "“烦请”是你最重要的历史数据。"
        },
        {
          "text": "我的按钮呢？昨天还在这里的大按钮呢？",
          "type": "fixed-asset",
          "reaction": "这不是更新，是你的居住环境被装修了。"
        },
        {
          "text": "又更新？我这个旧人能不一起更新吗？",
          "type": "depreciated",
          "reaction": "系统需要重启，你需要放假。"
        }
      ],
      "scene": "系统公告 · 更新成功"
    },
    {
      "id": "q10",
      "title": "对方第三次说：“今天一定给。”你——",
      "options": [
        {
          "text": "好的。顺便确认一下，你那边现在是哪一年？",
          "type": "receivables",
          "reaction": "语气越礼貌，咒语等级越高。"
        },
        {
          "text": "开始预演第四次，以及它对我今晚的连锁伤害。",
          "type": "provision",
          "reaction": "你已经在看下一季预告片了。"
        },
        {
          "text": "又续订一集。行，先把手上的做完。",
          "type": "going-concern",
          "reaction": "讨厌连续剧，但每天准时追更。"
        },
        {
          "text": "请给个具体时间。我的晚上不参与无限延期。",
          "type": "materiality",
          "reaction": "承诺需要到期日，不能只有情绪价值。"
        }
      ],
      "scene": "对方的“今天一定” · 第三集"
    },
    {
      "id": "q11",
      "title": "“你这人吧，真的一眼就能看懂。”你心想——",
      "options": [
        {
          "text": "请提供支持这个结论的底稿。",
          "type": "skepticism",
          "reaction": "一段闲聊被你升级成了证据审查。"
        },
        {
          "text": "那你应该能看懂，我现在不是很有空。",
          "type": "other-receivables",
          "reaction": "别人看懂了你，却没看见你的待办。"
        },
        {
          "text": "不可能。我的最新版本还没发布。",
          "type": "construction",
          "reaction": "当前可见人格仅为预览版。"
        },
        {
          "text": "看懂就好。今天吃啥，你决定。",
          "type": "windfall",
          "reaction": "人类很复杂。你的午饭诉求很简单。"
        }
      ],
      "scene": "同事突然评价你"
    },
    {
      "id": "q12",
      "title": "忙了一天，对方说：“辛苦了。”你最想接——",
      "options": [
        {
          "text": "谢谢，我的保养申请也请顺便通过一下。",
          "type": "depreciated",
          "reaction": "重要资产也需要维护，不只是继续用。"
        },
        {
          "text": "不辛苦，回一下我上周那封邮件就行。",
          "type": "receivables",
          "reaction": "你的愿望非常具体，并且已经逾期。"
        },
        {
          "text": "没事，今天居然没有人吵起来。算我赢。",
          "type": "goodwill",
          "reaction": "该贡献无法单独计价，但大家确实活下来了。"
        },
        {
          "text": "那下次能把这三张重复表合成一张吗？",
          "type": "substance",
          "reaction": "你对关怀的理解：少一道重复工序。"
        }
      ],
      "scene": "今天最后一笔 · “辛苦了”"
    }
  ],
  "siteUrl": "https://finnlyu41-tech.github.io/finance-creatures/"
};
  if(typeof module!=="undefined" && module.exports) module.exports=data; else root.FinanceContent=data;
})(globalThis);
