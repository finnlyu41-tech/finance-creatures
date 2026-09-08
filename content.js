/* Original workplace comedy. Labels and pairings are entertainment, not assessments. */
(function(root){
  "use strict";
  const data = {
  "version": "0.3.0",
  "contentVersion": "0.6",
  "types": [
    {
      "id": "goodwill",
      "name": "商誉",
      "label": "不是没贡献，是你们还没炸",
      "code": "GW",
      "tagline": "我一请假，你们就原形毕露。",
      "paragraphs": [
        "客户的阴阳怪气，你翻译成“还有优化空间”。\n老板的异想天开，你翻译成“我们再研究一下”。",
        "你在这家公司干的不是财会。\n是人类互联协议。",
        "年终总结没法写“阻止了七次当场翻脸”。\n所以你的贡献又被评为：配合度不错。"
      ],
      "catchphrase": "“都别急，先听我说。”",
      "habitat": "两个人即将打出“呵呵”的群聊。",
      "nemesis": "“你这个工作，好像谁都能做。”",
      "nickname": "团队灭火器",
      "equipment": [
        "负责灭火",
        "不配消防津贴",
        "请假即压力测试"
      ],
      "roasts": [
        "你请一天假，工作群就能剪出十二集预告。",
        "全公司情绪实现了软着陆，只有你没地方降落。",
        "你不是会说话。你是替大家把不好听的咽下去了。",
        "你的绩效叫“配合度”，大家的体面叫“幸好有你”。",
        "别人有工作成果，你有事故未发生记录。"
      ],
      "accent": "#b96754",
      "soft": "#faece6",
      "image": "./assets/characters/goodwill.webp",
      "imageAlt": "商誉的原创人物插画：团队灭火器"
    },
    {
      "id": "provision",
      "name": "预计负债",
      "label": "事情还没发生，你先受够了",
      "code": "PV",
      "tagline": "别人活在当下，我在替下周坐牢。",
      "paragraphs": [
        "领导发来“明天聊聊”。\n你已经模拟了挨批、加活、部门重组，以及离职后适合卖哪种肠粉。",
        "第二天，他只是问你打印机怎么连。",
        "打印机连上了。\n你和昨晚的睡意，彻底失联了。"
      ],
      "catchphrase": "“我不是想多，我是预先受苦。”",
      "habitat": "“对方正在输入…”和未命名会议之间。",
      "nemesis": "“不是什么大事，你明天就知道了。”",
      "nickname": "未来烂事体验官",
      "equipment": [
        "预支十天烦恼",
        "脑内无限续集",
        "小事按灾难计量"
      ],
      "roasts": [
        "别人加班要领导批准，你在脑子里直接办月卡。",
        "领导只打了两个字，你的内心已经出了三份修订稿。",
        "事情还没分配给你，你已经替它写完检讨。",
        "好消息：你预想的没发生。坏消息：你已经难受过了。",
        "你没有未雨绸缪。你是雨还没来，先把自己淋湿。"
      ],
      "accent": "#766088",
      "soft": "#f0ebf4",
      "image": "./assets/characters/provision.webp",
      "imageAlt": "预计负债的原创人物插画：未来烂事体验官"
    },
    {
      "id": "construction",
      "name": "在建工程",
      "label": "一件小事，做成十年规划",
      "code": "WIP",
      "tagline": "正事没开工，工具先上市了。",
      "paragraphs": [
        "原计划：做一张表。\n实际进度：换了软件、建了知识库、画了架构图。",
        "你为“马上开始”做了非常充分的长期准备。",
        "别人问表呢？\n你说先别管表，这套系统以后能管一万张表。"
      ],
      "catchphrase": "“等我把最后一个框架搭好。”",
      "habitat": "所有名为“最终方案”的新建文件夹。",
      "nemesis": "“不用完美，现在发我。”",
      "nickname": "永久开工代表",
      "equipment": [
        "竣工日期待定",
        "准备工作已超支",
        "新工具永远最香"
      ],
      "roasts": [
        "你的第一项待办，是重做这份待办。",
        "别人磨刀不误砍柴，你先给刀成立了一家科技公司。",
        "项目还没交付，项目管理系统已经更新三代。",
        "你很努力。只是被优化掉的，暂时是成果。",
        "你的人生不是烂尾，是始终拒绝停止开工。"
      ],
      "accent": "#a77528",
      "soft": "#faf0d8",
      "image": "./assets/characters/construction.webp",
      "imageAlt": "在建工程的原创人物插画：永久开工代表"
    },
    {
      "id": "other-receivables",
      "name": "其他应收款",
      "label": "编制一人，业务范围全人类",
      "code": "OR",
      "tagline": "别人跨部门协作，你被跨部门使用。",
      "paragraphs": [
        "你的岗位：会计。\n你的实际岗位：谁喊一声，你就归谁。",
        "报销、Excel、打印机、订会议室。\n你只是去茶水间接杯水，回来又接了两个需求。",
        "公司并不是没有边界。\n它把你的边界设成了“其他”。"
      ],
      "catchphrase": "“行，你先发我。”",
      "habitat": "所有“这事不知道找谁”的下一句。",
      "nemesis": "“不用太专业，帮我们弄一下就行。”",
      "nickname": "全公司临时工",
      "equipment": [
        "权限没有",
        "头衔全能",
        "顺便不限量"
      ],
      "roasts": [
        "你的岗位说明书就四个字：以及其他。",
        "好消息：大家都需要你。坏消息：大家都不负责给你涨工资。",
        "“就帮一下”是你办公室里最稳定的劳动合同。",
        "你是万能插座。谁路过，都想接一下。",
        "别人下班前清待办，你下班前刷新待办。"
      ],
      "accent": "#507a99",
      "soft": "#e8f0f5",
      "image": "./assets/characters/other-receivables.webp",
      "imageAlt": "其他应收款的原创人物插画：全公司临时工"
    },
    {
      "id": "depreciated",
      "name": "已提足折旧",
      "label": "仍在使用，请勿追加情绪要求",
      "code": "DEP",
      "tagline": "功能正常，语气报废。",
      "paragraphs": [
        "刚入职时，你会问“为什么”。\n现在你只问“改哪版”。",
        "你能做。也能做好。\n但不要要求你一边做，一边热爱这破班。",
        "公司说你越来越稳重了。\n其实是你的情绪弹窗不再自动弹出了。"
      ],
      "catchphrase": "“能做。别让我再说一遍。”",
      "habitat": "工位上，充电线很多，电量很少。",
      "nemesis": "“年轻人，要有点激情！”",
      "nickname": "出厂热情已过保",
      "equipment": [
        "技能正常运行",
        "热情不再续费",
        "请勿拍打催促"
      ],
      "roasts": [
        "老板以为你成熟了，其实你懒得解释了。",
        "你的工作经验很丰富，体验感很贫瘠。",
        "公司给你加的不是薪，是耐久度测试。",
        "眼里还有光。显示器的，不是梦想的。",
        "别问我有没有成长。问就是越来越耐摔。"
      ],
      "accent": "#647761",
      "soft": "#eaf0e4",
      "image": "./assets/characters/depreciated.webp",
      "imageAlt": "已提足折旧的原创人物插画：出厂热情已过保"
    },
    {
      "id": "receivables",
      "name": "应收账款",
      "label": "说好今天给，至今不知道哪天",
      "code": "AR",
      "tagline": "一句“烦请”，已经盘出杀气。",
      "paragraphs": [
        "第一封：烦请提供。\n第二封：温馨提醒。\n第三封：再次温馨提醒。",
        "你没有发火。\n只是把“烦请”加粗了。",
        "对方终于回复：“收到，谢谢。”\n你盯着零个附件，理解了什么叫无效回款。"
      ],
      "catchphrase": "“不好意思，再打扰一下。”",
      "habitat": "已发送里，像一部日更苦情剧。",
      "nemesis": "“你怎么不早点催我？”",
      "nickname": "附件职业追债人",
      "equipment": [
        "礼貌外壳",
        "高温内胆",
        "附件仍为零"
      ],
      "roasts": [
        "你不是在催资料，是在对一座许愿池进行持续投资。",
        "对方回复得很有礼貌，资料消失得也很有礼貌。",
        "你的爱情可以不被回应，确认函不行。",
        "你发的是工作邮件，对方当成了订阅号。",
        "每天最稳定的关系：你说烦请，他说马上。"
      ],
      "accent": "#7b6094",
      "soft": "#f0eaf7",
      "image": "./assets/characters/receivables.webp",
      "imageAlt": "应收账款的原创人物插画：附件职业追债人"
    },
    {
      "id": "fixed-asset",
      "name": "固定资产",
      "label": "已在本位置形成不可逆依赖",
      "code": "FA",
      "tagline": "公司可以倒闭，椅子能不能先留给我。",
      "paragraphs": [
        "你知道茶水间几点没人，\n哪把椅子不会突然下降，以及旧系统那个按钮藏在哪。",
        "公司宣布全面拥抱变化。\n你先把自己的鼠标拿回了抽屉。",
        "战略随便灵活。\n我这套人体工学配置，不接受组织架构调整。"
      ],
      "catchphrase": "“原来那套呢？我就问原来那套呢？”",
      "habitat": "同一把椅子上，已盘出工龄。",
      "nemesis": "“以后不设固定工位。”",
      "nickname": "工位原住民",
      "equipment": [
        "配置不可更改",
        "旧模板是祖产",
        "午饭自带默认值"
      ],
      "roasts": [
        "你不是抗拒变化，你是懒得再配一次环境。",
        "盘点时别乱走，容易让人以为资产丢了。",
        "你和这把椅子的关系，比和公司的稳定。",
        "公司所有制度你未必熟，空调遥控器你是真熟。",
        "你的舒适区不是心理概念，是靠背第三档。"
      ],
      "accent": "#507895",
      "soft": "#e6eef6",
      "image": "./assets/characters/fixed-asset.webp",
      "imageAlt": "固定资产的原创人物插画：工位原住民"
    },
    {
      "id": "windfall",
      "name": "营业外收入",
      "label": "主营业务受苦，其他项目回甜",
      "code": "JOY",
      "tagline": "公司画的饼不吃，公司买的蛋挞吃。",
      "paragraphs": [
        "领导说大家辛苦了，你内心毫无波动。\n同事说多点了一杯奶茶，你立刻起身履约。",
        "会取消了：赚。\n电梯刚好到了：赚。\n薯条多给一根：本日盈利。",
        "这班确实不怎么样。\n但你不允许它连最后一口开心都吞掉。"
      ],
      "catchphrase": "“先别骂了，有人点下午茶了。”",
      "habitat": "一切能吃、能躺、能提前结束的地方。",
      "nemesis": "“都这么忙了，还惦记吃？”",
      "nickname": "上班只图这几口",
      "equipment": [
        "蛋挞即时到账",
        "优惠券常备",
        "坏日子里捡零钱"
      ],
      "roasts": [
        "精神激励要过三道审批，蛋挞直接入账。",
        "你的快乐成本很低，但绝不接受领导画饼抵账。",
        "今天又是被三分糖挽回劳动关系的一天。",
        "世界破破烂烂，你先领满减。",
        "别人的梦想是财务自由，你此刻只想加料自由。"
      ],
      "accent": "#b67a22",
      "soft": "#fcf0d8",
      "image": "./assets/characters/windfall.webp",
      "imageAlt": "营业外收入的原创人物插画：上班只图这几口"
    },
    {
      "id": "skepticism",
      "name": "职业怀疑",
      "label": "收到你的保证，开始搜集证据",
      "code": "PS",
      "tagline": "你说“绝对没问题”，我说“案子来了”。",
      "paragraphs": [
        "“一直都这样。”\n——一直是多久？这样是哪样？谁同意的？",
        "“你就信我吧。”\n——好的。支持这个结论的东西发一下。",
        "你没有不信任人。\n你只是觉得人类口头承诺这种附件，经常打不开。"
      ],
      "catchphrase": "“我不是杠，我是没看到依据。”",
      "habitat": "所有“应该”“大概”“肯定”后面。",
      "nemesis": "“凭我这么多年的经验。”",
      "nickname": "“放心”文件打不开",
      "equipment": [
        "保证无法入库",
        "截图先别裁",
        "问号不限次数"
      ],
      "roasts": [
        "别人聊天发哈哈，你聊天发依据呢。",
        "你的人际关系，偶尔需要补充支持性文件。",
        "你说信我，我会信。你说绝对信我，我得查。",
        "最能让你精神一振的，不是咖啡，是“肯定没错”。",
        "你不是扫兴，你是连惊喜都想函证一下。"
      ],
      "accent": "#4d7468",
      "soft": "#e5f0e9",
      "image": "./assets/characters/skepticism.webp",
      "imageAlt": "职业怀疑的原创人物插画：“放心”文件打不开"
    },
    {
      "id": "materiality",
      "name": "重要性水平",
      "label": "工作很重要，你本人也一样",
      "code": "MAT",
      "tagline": "这点破事，不配征用我的周末。",
      "paragraphs": [
        "领导：每件事都很急。\n你：那先说清楚，哪件不做公司会消失。",
        "数字错了，你会查。\n表头第四次换蓝色，你会问要不要等天亮。",
        "你不是缺乏主人翁意识。\n你是查了股东名册，发现确实没有你。"
      ],
      "catchphrase": "“急到什么程度？给个排序。”",
      "habitat": "17:59，工作与人生的边界线上。",
      "nemesis": "“就占用大家一点休息时间。”",
      "nickname": "下班有否决权",
      "equipment": [
        "周末非流动资源",
        "晚饭不可随意冲回",
        "顺便需重新议价"
      ],
      "roasts": [
        "你可以对工作负责，但没承诺给所有人的灵感陪葬。",
        "公司说要有主人翁意识。你问分红在哪一页。",
        "你不是不积极，你只是积极地保留了一部分自己。",
        "你的“不方便”，是一次正常的信息披露。",
        "别人的紧急程度，不自动变成你的人生优先级。"
      ],
      "accent": "#b56d5d",
      "soft": "#faebe5",
      "image": "./assets/characters/materiality.webp",
      "imageAlt": "重要性水平的原创人物插画：下班有否决权"
    },
    {
      "id": "substance",
      "name": "实质重于形式",
      "label": "别先赋能，先把重复的删了",
      "code": "SUB",
      "tagline": "数字化转型成功：同一份表，现在填五遍。",
      "paragraphs": [
        "旧流程：填表。\n新流程：登录、申请权限、填表、截图证明填过表、填一张填表进度表。",
        "会上大家都说“赋能”。\n你把刚才那张重复表删了。",
        "你不是不懂管理。\n你只是不想给流程做陪葬的工作量。"
      ],
      "catchphrase": "“先告诉我，少干了哪一步？”",
      "habitat": "任何一场新系统宣讲会的提问环节。",
      "nemesis": "“我们再建一个台账管理这些台账。”",
      "nickname": "废流程拆迁办",
      "equipment": [
        "不为演示鼓掌",
        "重复步骤过敏",
        "能删一张是一张"
      ],
      "roasts": [
        "你连“如何减少会议”的会议都想取消。",
        "系统打通了。人也快打通了，主要是任督二脉那种。",
        "你的年度贡献：有些工作终于不需要做了。",
        "你的浪漫不在鲜花，在那一列不用手填了。",
        "先别AI赋能。能不能先让我不用输两遍名字。"
      ],
      "accent": "#398477",
      "soft": "#e2f1eb",
      "image": "./assets/characters/substance.webp",
      "imageAlt": "实质重于形式的原创人物插画：废流程拆迁办"
    },
    {
      "id": "going-concern",
      "name": "持续经营",
      "label": "每天倒闭一次，次日照常开门",
      "code": "GC",
      "tagline": "每天都不干了，每天都干得挺满。",
      "paragraphs": [
        "周一：谁爱干谁干。\n周二：做完这单就走。\n周三：这单怎么还有下一单？",
        "你的辞职宣言已经不是新闻了。\n是朋友手机里的每日天气。",
        "昨晚把自己劝离职。\n今早闹钟把自己劝复工。"
      ],
      "catchphrase": "“最后一次。今天的最后一次。”",
      "habitat": "每个骂骂咧咧又打开电脑的早上。",
      "nemesis": "“你去年也是这么说的。”",
      "nickname": "口头破产实际营业",
      "equipment": [
        "离职按日计提",
        "复工自动续费",
        "招牌反复挂回"
      ],
      "roasts": [
        "你不是对公司有感情，是离职流程至今没走到发送。",
        "你的去留问题，已经从重大事项变成日常经营。",
        "昨天说彻底不干，今天连最后一封邮件都回了。",
        "你最稳定的长期计划，是每天重新考虑一下。",
        "别人是卷不动了，你是骂完还能再转两圈。"
      ],
      "accent": "#ab792d",
      "soft": "#f8edd7",
      "image": "./assets/characters/going-concern.webp",
      "imageAlt": "持续经营的原创人物插画：口头破产实际营业"
    }
  ],
  "questions": [
    {
      "id": "q01",
      "title": "领导：“明天找你聊聊。”然后下线了。",
      "options": [
        {
          "text": "已经想好挨批、加活，以及辞职以后卖什么肠粉。",
          "type": "provision",
          "reaction": "八个字，你在脑内垫付了八集。"
        },
        {
          "text": "聊什么？给个议程。别用悬疑片管理团队。",
          "type": "skepticism",
          "reaction": "你成功把惊悚片拉回了会议通知。"
        },
        {
          "text": "哦。明天的我负责。今天的我已经关机。",
          "type": "depreciated",
          "reaction": "系统收到，情绪模块拒绝自动启动。"
        },
        {
          "text": "刚说完不干了。现在先看看他又有什么屁事。",
          "type": "going-concern",
          "reaction": "营业执照又从垃圾桶捡回来了。"
        }
      ],
      "scene": "今晚 · 信息量 8 个字，后劲无限"
    },
    {
      "id": "q02",
      "title": "同事端着杯子过来：“顺便帮我一下呗。”",
      "options": [
        {
          "text": "伸手接文件。我的拒绝键可能出厂就没装。",
          "type": "other-receivables",
          "reaction": "你只想接杯水，顺便接了一个部门。"
        },
        {
          "text": "多顺便？用分钟描述，别用感情描述。",
          "type": "materiality",
          "reaction": "很好，模糊需求首次遭遇计量单位。"
        },
        {
          "text": "你先别跟他吵。我来翻译一下双方都在说什么。",
          "type": "goodwill",
          "reaction": "今日兼职：给两种人类协议做适配。"
        },
        {
          "text": "先看这事能不能以后都不用我帮。",
          "type": "substance",
          "reaction": "你不想成为英雄，你想取消这个副本。"
        }
      ],
      "scene": "茶水间 · 顺便不是工作量单位"
    },
    {
      "id": "q03",
      "title": "本来只要做张表。两个小时后——",
      "options": [
        {
          "text": "已买新工具、建新框架。表？先别打断产品战略。",
          "type": "construction",
          "reaction": "恭喜，一张表被你孵化成了创业项目。"
        },
        {
          "text": "试完所有新方法，庄严打开去年那张表。",
          "type": "fixed-asset",
          "reaction": "你完成了一次以怀旧为终点的数字化探索。"
        },
        {
          "text": "把重复填的三处合成一处。没什么好汇报的。",
          "type": "substance",
          "reaction": "你优化了工作，顺手优化掉一场汇报。"
        },
        {
          "text": "表没做完，下午茶拼单成了。我不是一事无成。",
          "type": "windfall",
          "reaction": "进度暂缓，珍珠全额到账。"
        }
      ],
      "scene": "效率改善现场 · 活没少，想法多了"
    },
    {
      "id": "q04",
      "title": "“附件见邮件。”你看了三遍：没附件。",
      "options": [
        {
          "text": "发“烦请补发”。这四个字我已经打出包浆。",
          "type": "receivables",
          "reaction": "你的输入法已把“烦请”设成了祖籍。"
        },
        {
          "text": "截图、时间、发件记录。请确认附件最后出现在哪。",
          "type": "skepticism",
          "reaction": "你把收邮件升级成了失踪人口调查。"
        },
        {
          "text": "资料没来，但今晚会发生的烂事已经全来了。",
          "type": "provision",
          "reaction": "附件是空的，脑内待办不是。"
        },
        {
          "text": "拉三个人对接。绕一圈，全都让我来转。",
          "type": "other-receivables",
          "reaction": "恭喜，你成为了本项目唯一能用的接口。"
        }
      ],
      "scene": "收件箱 · 有礼貌，有正文，就是没东西"
    },
    {
      "id": "q05",
      "title": "奇迹发生：今天真的准时下班。",
      "options": [
        {
          "text": "老板今天没加戏，蛋挞店今天还有货。双赢。",
          "type": "windfall",
          "reaction": "所谓双赢：你赢了两次。"
        },
        {
          "text": "回家坐老位置，开老节目，活成自己的默认设置。",
          "type": "fixed-asset",
          "reaction": "资产从公司调拨至沙发，状态良好。"
        },
        {
          "text": "别叫奇迹。这是我本来就有的人生。",
          "type": "materiality",
          "reaction": "正常下班，不需要发表获奖感言。"
        },
        {
          "text": "今天也没辞成。算了，明天再骂一次。",
          "type": "going-concern",
          "reaction": "本店打烊。明早边骂边恢复营业。"
        }
      ],
      "scene": "18:00 · 本日剧情意外没有续订"
    },
    {
      "id": "q06",
      "title": "看完你的成果，对方：“这不挺简单的？”",
      "options": [
        {
          "text": "你觉得简单，因为我已经替你拦掉三场吵架。",
          "type": "goodwill",
          "reaction": "你交付的不只是表，还有尚未爆炸的群聊。"
        },
        {
          "text": "这是预览版。完整版还有六个我刚想到的模块。",
          "type": "construction",
          "reaction": "请不要刺激在建工程追加投资。"
        },
        {
          "text": "对，特意做简单的。别再要求我把它复杂回去。",
          "type": "substance",
          "reaction": "你和对方对“厉害”的理解，差了三张流程图。"
        },
        {
          "text": "对。因为我已经在这个坑里踩出了地铁。",
          "type": "depreciated",
          "reaction": "这是经验，不是你随口一句就能复刻的魔法。"
        }
      ],
      "scene": "验收现场 · 一句话抹平半天工作"
    },
    {
      "id": "q07",
      "title": "周一刚开电脑，领导：“之前那个全部重来。”",
      "options": [
        {
          "text": "骂完了。重来吧，骂不耽误手速。",
          "type": "going-concern",
          "reaction": "嘴上停业整顿，手上已经新建文件。"
        },
        {
          "text": "我就知道。甚至预演过他这次会用什么表情包。",
          "type": "provision",
          "reaction": "你不是未卜先知，你是受过同款剧情的苦。"
        },
        {
          "text": "哪个之前？为什么全部？把变更点讲清楚。",
          "type": "skepticism",
          "reaction": "你成功阻止“全部”二字直接获得无限权限。"
        },
        {
          "text": "重来可以。谁动我的快捷键，我跟谁有意见。",
          "type": "fixed-asset",
          "reaction": "流程能改，祖传键位受到重点保护。"
        }
      ],
      "scene": "09:01 · 上周的努力已进入回收站"
    },
    {
      "id": "q08",
      "title": "领导：“这个公司真的不能没有你。”",
      "options": [
        {
          "text": "完了。新任务已经穿过这句话朝我走来了。",
          "type": "other-receivables",
          "reaction": "这不是赞美，这是任务投递前的缓冲动画。"
        },
        {
          "text": "知道了。又有两个部门需要我做人话翻译。",
          "type": "goodwill",
          "reaction": "你是公司最没被承认的基础设施。"
        },
        {
          "text": "真的吗？那下午茶能不能给我加个小料。",
          "type": "windfall",
          "reaction": "你的情绪价值结算方式：可食用。"
        },
        {
          "text": "那我下周请假。测试一下这个判断。",
          "type": "materiality",
          "reaction": "一次非常合理的连续性演练。"
        }
      ],
      "scene": "夸奖已送达 · 请留意其附带条款"
    },
    {
      "id": "q09",
      "title": "新系统上线。你登录后，第一反应——",
      "options": [
        {
          "text": "太好了！刚好推倒重建我那套一直没用上的框架。",
          "type": "construction",
          "reaction": "新系统还没稳定，你的新工程已经开张。"
        },
        {
          "text": "我催了三个月的记录呢？那可是完整的施法日志。",
          "type": "receivables",
          "reaction": "数据库里装的不是邮件，是积攒的礼貌。"
        },
        {
          "text": "我的按钮呢？昨天这么大一个按钮呢？",
          "type": "fixed-asset",
          "reaction": "产品说这是迭代，你说这是强拆。"
        },
        {
          "text": "系统需要更新可以。这个旧人能不能暂时跳过。",
          "type": "depreciated",
          "reaction": "检测到更新：新增工作量。已拒绝。"
        }
      ],
      "scene": "升级公告 · 所有人都要重新学习"
    },
    {
      "id": "q10",
      "title": "对方第三次：“今天一定给，放心。”",
      "options": [
        {
          "text": "请确认一下，这个“今天”是哪个会计期间。",
          "type": "receivables",
          "reaction": "你已经开始对日期本身进行催收。"
        },
        {
          "text": "他第四次怎么说，我第五次怎么崩，都安排好了。",
          "type": "provision",
          "reaction": "对方还在第三季，你已追到大结局。"
        },
        {
          "text": "行。又续了一集。先干别的，晚点接着骂。",
          "type": "going-concern",
          "reaction": "气也生，活也干。双线程持续运行。"
        },
        {
          "text": "具体几点？过了几点，我的今天就不陪跑了。",
          "type": "materiality",
          "reaction": "终于有人给“马上”设置了到期日。"
        }
      ],
      "scene": "连续剧 · 今天一定给·第三季"
    },
    {
      "id": "q11",
      "title": "同事：“我感觉你这个人，一眼就能看透。”",
      "options": [
        {
          "text": "依据呢？样本量多少？你观察的期间完整吗？",
          "type": "skepticism",
          "reaction": "闲聊不幸进入了审计现场。"
        },
        {
          "text": "那你应该能看透，我不是你们部门的。",
          "type": "other-receivables",
          "reaction": "真实岗位披露，首次遭遇选择性失明。"
        },
        {
          "text": "不可能。我下个版本的人格还没部署。",
          "type": "construction",
          "reaction": "外界尚未获得你最终版的访问权限。"
        },
        {
          "text": "看透就好。顺便看看我适合几分糖。",
          "type": "windfall",
          "reaction": "你把玄学问题成功转回了采购需求。"
        }
      ],
      "scene": "闲聊突袭 · 对方突然开始给你出报告"
    },
    {
      "id": "q12",
      "title": "忙到最后，只收到三个字：“辛苦了。”",
      "options": [
        {
          "text": "谢谢。我的保养申请在你那压了三年。",
          "type": "depreciated",
          "reaction": "赞美已入库，维修预算仍待审批。"
        },
        {
          "text": "不客气。回我上周那封邮件，比这三个字管用。",
          "type": "receivables",
          "reaction": "你的人生愿望很朴素：收到带附件的回复。"
        },
        {
          "text": "不辛苦。今天群里谁都没翻脸，算我有点功德。",
          "type": "goodwill",
          "reaction": "未发生的事故，继续无人计价。"
        },
        {
          "text": "真心疼我，就把那三张重复表删了。",
          "type": "substance",
          "reaction": "你要的不是安慰，是减少一道工序。"
        }
      ],
      "scene": "今日结算 · 情绪奖励已发放"
    }
  ],
  "siteUrl": "https://finnlyu41-tech.github.io/finance-creatures/",
  "combinations": {
    "goodwill|provision": {
      "title": "提前替全公司尴尬",
      "line": "架还没吵，你连双方的台阶都修好了。"
    },
    "construction|goodwill": {
      "title": "关系维护系统筹备中",
      "line": "架还没劝完，你先想建一个全员情绪管理平台。"
    },
    "goodwill|other-receivables": {
      "title": "公司唯一活人",
      "line": "既负责把事情做完，也负责让其他人看起来像个人。"
    },
    "depreciated|goodwill": {
      "title": "自动微笑已过保",
      "line": "全公司情绪都被你安抚好了。你自己的，客服暂不在线。"
    },
    "goodwill|receivables": {
      "title": "礼貌含量严重超标",
      "line": "一句“烦请”既要追回附件，还得照顾对方暂时不想给的心情。"
    },
    "fixed-asset|goodwill": {
      "title": "工位常驻和事佬",
      "line": "你和这把椅子，分别承载了同事的情绪和你的怨气。"
    },
    "goodwill|windfall": {
      "title": "会议室甜点外交",
      "line": "架不用先劝。你端进来一盒蛋挞，人类文明就恢复了。"
    },
    "goodwill|skepticism": {
      "title": "微笑着要证据",
      "line": "你说得很有道理。来，支持你这个道理的东西发一下。"
    },
    "goodwill|materiality": {
      "title": "有营业时间的好人",
      "line": "18点前替你找台阶。18点后，麻烦自己学会下楼。"
    },
    "goodwill|substance": {
      "title": "灭火顺便拆灶",
      "line": "你先让大家别吵了，再把那个天天让人吵架的流程删了。"
    },
    "going-concern|goodwill": {
      "title": "反复离职的稳定器",
      "line": "你每天说要走，每天又把快散架的群聊扶正。"
    },
    "construction|provision": {
      "title": "灾难应对平台建设中",
      "line": "为了预防一件还没发生的破事，你制造了一个肯定做不完的项目。"
    },
    "other-receivables|provision": {
      "title": "全自动接锅预警机",
      "line": "活还没分给你，你已经替全公司愁完了。"
    },
    "depreciated|provision": {
      "title": "没开机先欠电",
      "line": "今天的活还没来，明天的电已经用完。"
    },
    "provision|receivables": {
      "title": "附件尚未到场，夜宵已点",
      "line": "别人拖的是资料，你提前加的是整个晚上的班。"
    },
    "fixed-asset|provision": {
      "title": "舒适区气象台",
      "line": "公司还没宣布搬工位，你已经替靠垫安排好逃生路线。"
    },
    "provision|windfall": {
      "title": "预先受苦，及时加糖",
      "line": "坏消息还没发生，奶茶已经先买来压惊。"
    },
    "provision|skepticism": {
      "title": "未立案先结案",
      "line": "证据还没看全，最坏的结局已经在脑内通过复核。"
    },
    "materiality|provision": {
      "title": "有门禁的脑内加班",
      "line": "脑子可以提前上班。但本人18点照常离场。"
    },
    "provision|substance": {
      "title": "灾难预案直接删源头",
      "line": "别人预想如何应付，你预想能不能让这破事根本别发生。"
    },
    "going-concern|provision": {
      "title": "提前倒闭，按时开门",
      "line": "每晚在脑内破产，每早靠闹钟重新融资。"
    },
    "construction|other-receivables": {
      "title": "全公司烂尾集散地",
      "line": "自己的项目没竣工，别人的活又来申请入驻。"
    },
    "construction|depreciated": {
      "title": "使用十年，仍未竣工",
      "line": "人已经提足折旧，个人发展计划还在打地基。"
    },
    "construction|receivables": {
      "title": "催件系统开发中",
      "line": "附件还没催回来，你先给催附件搭了一个看板。"
    },
    "construction|fixed-asset": {
      "title": "原地重构十八次",
      "line": "你想改造一切。除了那套用了八年的旧模板。"
    },
    "construction|windfall": {
      "title": "未完成但吃得很好",
      "line": "工程进度不明，开工奶茶、阶段蛋挞、收工夜宵一项没落。"
    },
    "construction|skepticism": {
      "title": "竣工条件不断追加",
      "line": "不是做不完，是每次想交付，你又发现了三个需要确认的问题。"
    },
    "construction|materiality": {
      "title": "烂尾但准点收工",
      "line": "项目可以无限延长，但我的工作时间不行。"
    },
    "construction|substance": {
      "title": "效率改革自身超支",
      "line": "为了少点一次鼠标，已经研发了三个晚上。"
    },
    "construction|going-concern": {
      "title": "永久试营业",
      "line": "项目每天宣布开工，人生每天宣布不干。两边都没完。"
    },
    "depreciated|other-receivables": {
      "title": "全公司唯一还能用的旧设备",
      "line": "权限给得像实习生，调用频率像服务器。"
    },
    "other-receivables|receivables": {
      "title": "一人追着整个供应链",
      "line": "上游欠你附件，下游催你成品。你本人是唯一准时上线的环节。"
    },
    "fixed-asset|other-receivables": {
      "title": "插在工位上的万能插座",
      "line": "人没挪过地方，已经给全公司接过一圈活。"
    },
    "other-receivables|windfall": {
      "title": "奶茶换来的无限劳动力",
      "line": "别人说帮个忙你犹豫了。加一句“给你点了奶茶”，你开始保存文件。"
    },
    "other-receivables|skepticism": {
      "title": "先接过来，再审自己",
      "line": "活先接了。接完开始调查：这玩意为什么归我？"
    },
    "materiality|other-receivables": {
      "title": "万能但不包夜",
      "line": "什么都能接。18点之后，请寻找其他科目。"
    },
    "other-receivables|substance": {
      "title": "修好系统，顺便修人",
      "line": "接口没有你来补。补完发现，最需要升级的是提需求的人。"
    },
    "going-concern|other-receivables": {
      "title": "无限续杯的临时工",
      "line": "每天宣布这是最后一单，每天有人拿着下一单经过你。"
    },
    "depreciated|receivables": {
      "title": "复读机仍在保修期外运行",
      "line": "人已经没电了，输入法还在替你自动补全“烦请”。"
    },
    "depreciated|fixed-asset": {
      "title": "公司文物，禁止挪动",
      "line": "人和椅子都已包浆。别翻新了，批个假就行。"
    },
    "depreciated|windfall": {
      "title": "低电量，但能吃",
      "line": "老板叫你没反应。下午茶群响了，旧设备成功唤醒。"
    },
    "depreciated|skepticism": {
      "title": "看透但仍要求附件",
      "line": "你早就知道哪里不对。只是还得看着大家表演到证据那一步。"
    },
    "depreciated|materiality": {
      "title": "过保但有下班按钮",
      "line": "可以继续用。但超出服务时段，请不要反复拍打。"
    },
    "depreciated|substance": {
      "title": "老设备拒绝新包装",
      "line": "你不是学不会新系统。你是认出了旧麻烦换了个登录页。"
    },
    "depreciated|going-concern": {
      "title": "报废申请从未获批",
      "line": "嘴上已经停产，工时照常计入。"
    },
    "fixed-asset|receivables": {
      "title": "工位上的固定催收点",
      "line": "位置一直没变，催的人也没变，附件还是没出现。"
    },
    "receivables|windfall": {
      "title": "邮件未回，蛋挞已到",
      "line": "对人类的信任暂缓确认，对外卖小哥的信任及时恢复。"
    },
    "receivables|skepticism": {
      "title": "附件重案组",
      "line": "别人说“发了”，你说“请描述它最后一次被看见的地点”。"
    },
    "materiality|receivables": {
      "title": "催收也有营业时间",
      "line": "白天烦请，晚上免打扰。我的礼貌没有24小时服务。"
    },
    "receivables|substance": {
      "title": "催件自动化，心烦手动化",
      "line": "邮件可以自动发。看见“明天一定”的那口气，还是得自己咽。"
    },
    "going-concern|receivables": {
      "title": "连续催收，连续开张",
      "line": "对方的承诺和你的辞职宣言，每天各续一集。"
    },
    "fixed-asset|windfall": {
      "title": "工位下午茶经济体",
      "line": "人没挪地方，奶茶、零食和优惠券形成了完整的内循环。"
    },
    "fixed-asset|skepticism": {
      "title": "祖传模板鉴定专家",
      "line": "你说新系统更好。证据呢？老系统已经服务你八年。"
    },
    "fixed-asset|materiality": {
      "title": "固定工位，固定下班",
      "line": "椅子归公司，18点后的屁股归自己。"
    },
    "fixed-asset|substance": {
      "title": "只升级真的好用的",
      "line": "可以改变世界。不要把能一键办的事，改成七个按钮。"
    },
    "fixed-asset|going-concern": {
      "title": "永久租客每日退房",
      "line": "每天说再也不来了，每天坐回同一个坑。"
    },
    "skepticism|windfall": {
      "title": "蛋挞也要穿行测试",
      "line": "先确认奶茶是不是全糖，再决定要不要相信今天。"
    },
    "materiality|windfall": {
      "title": "晚饭优先于临时灵感",
      "line": "领导的想法可以再酝酿。我的炸鸡凉了就不好吃了。"
    },
    "substance|windfall": {
      "title": "唯一有效的赋能是加餐",
      "line": "少填一张表，再多来一个蛋挞。这才叫工作体验升级。"
    },
    "going-concern|windfall": {
      "title": "奶茶续营",
      "line": "刚宣布不干，同事递来一杯。行，今天再开一会儿。"
    },
    "materiality|skepticism": {
      "title": "会查，也会喊停",
      "line": "该问的证据一份不少。不该改的蓝色，一遍都嫌多。"
    },
    "skepticism|substance": {
      "title": "流程拆迁审计组",
      "line": "别说提升了效率。把前后步骤摆出来，我数一下。"
    },
    "going-concern|skepticism": {
      "title": "对世界存疑，对闹钟认账",
      "line": "你怀疑这班的一切，但明早8点的闹钟证据充分。"
    },
    "materiality|substance": {
      "title": "废活止损委员会",
      "line": "一个负责问为什么要做，一个负责问为什么要现在做。"
    },
    "going-concern|materiality": {
      "title": "限时营业的永动机",
      "line": "可以明天接着干。不代表可以今晚一直干。"
    },
    "going-concern|substance": {
      "title": "一边骂，一边修",
      "line": "嘴上说让它烂掉，手上又把那个烦人的步骤修好了。"
    }
  }
};
  if(typeof module!=="undefined" && module.exports) module.exports=data; else root.FinanceContent=data;
})(globalThis);
