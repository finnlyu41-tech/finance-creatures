/* Original entertainment content; edit this file to tune the copy. */
(function (root) {
  "use strict";
  const data = {
  "version": "0.1.0",
  "contentVersion": "0.4",
  "types": [
    {
      "id": "goodwill",
      "name": "商誉",
      "label": "关系润滑型",
      "code": "GW",
      "tagline": "我的价值，等我请假那天你们再测。",
      "paragraphs": [
        "别人负责把事情讲清楚，你负责让人愿意继续听。",
        "三个人快吵起来了，你说“都先喝口水”。\n客户语气不太好了，你还能接住最后一句话。",
        "月底算贡献时，没有一栏叫“刚才要不是我，会议已经散了”。\n于是你的价值，又被打包处理了。"
      ],
      "catchphrase": "“先别急，我来问问。”",
      "habitat": "会议快要尴尬起来的前一秒。",
      "nemesis": "“这些不是顺便就能做的吗？”"
    },
    {
      "id": "provision",
      "name": "预计负债",
      "label": "提前预演型",
      "code": "PV",
      "tagline": "事情还没发生，我已经累过一遍。",
      "paragraphs": [
        "领导发来一个“在吗”。",
        "你已经在脑内完成了需求变更、延期说明、连夜修改，以及明天怎么解释。",
        "过了两分钟，对方说：\n“刚才发错人了。”",
        "事情取消了，你已经消耗的电量没有退回来。"
      ],
      "catchphrase": "“我先想一下最坏会怎样。”",
      "habitat": "事情尚未发生、但输入框一直显示“对方正在输入”的时候。",
      "nemesis": "“别想那么多。”"
    },
    {
      "id": "construction",
      "name": "在建工程",
      "label": "持续施工型",
      "code": "WIP",
      "tagline": "我不是没进展，我是一直没竣工。",
      "paragraphs": [
        "你不是没有行动。",
        "你买了工具、改了模板、整理了目录，还为整个计划设计了一套命名规则。",
        "原本只想把这张表做完。\n现在项目已经升级成“重构个人生产力系统”。",
        "开工是真的。\n竣工日期需要再评估一下。"
      ],
      "catchphrase": "“等我把这个框架再完善一下。”",
      "habitat": "新模板、学习计划与未命名文件夹之间。",
      "nemesis": "“别准备了，先给我一版。”"
    },
    {
      "id": "other-receivables",
      "name": "其他应收款",
      "label": "万能接单型",
      "code": "OR",
      "tagline": "没有合适科目的事情，最后都挂我这里。",
      "paragraphs": [
        "报销单不知道找谁，找你。\n系统不知道怎么导，找你。\n行政不知道谁方便，还是找你。",
        "你有一个正式岗位。\n以及十几个“先帮一下”的临时身份。",
        "别人有岗位说明书。\n你有一张不断增加项目的明细表。"
      ],
      "catchphrase": "“发我吧，我先看看。”",
      "habitat": "所有写着“其他”的地方。",
      "nemesis": "“你反正比较熟。”"
    },
    {
      "id": "depreciated",
      "name": "已提足折旧",
      "label": "低功耗运行型",
      "code": "DEP",
      "tagline": "折旧已经提完，使用强度刚刚上来。",
      "paragraphs": [
        "刚入职时，你会为新任务打开新的可能性。\n现在，你主要打开旧模板。",
        "不是不会做。\n是你已经不想再为一个第八次出现的问题，提供第一次的激情。",
        "公司觉得你越来越好用了。\n你觉得保养申请是不是又没批。"
      ],
      "catchphrase": "“能做，别再加别的了。”",
      "habitat": "显示器后面，处于低功耗运行状态。",
      "nemesis": "“你有经验，顺便再带一个。”"
    },
    {
      "id": "receivables",
      "name": "应收账款",
      "label": "礼貌追件型",
      "code": "AR",
      "tagline": "你欠我的不是钱，是那份说好今天给的附件。",
      "paragraphs": [
        "“下午给你。”\n“明天一定。”\n“我同事正在找。”",
        "你已经熟练掌握“烦请”“再提醒一下”和“方便告知预计时间吗”。",
        "对方觉得你消息很多。\n你觉得自己的回声，应该单独开一张明细账。"
      ],
      "catchphrase": "“请问这份资料目前到哪一步了？”",
      "habitat": "邮件已发送文件夹，以及对方始终没出现的附件里。",
      "nemesis": "“刚不是发你了吗？”"
    },
    {
      "id": "fixed-asset",
      "name": "固定资产",
      "label": "稳定驻扎型",
      "code": "FA",
      "tagline": "公司可以战略转型，我的工位最好别动。",
      "paragraphs": [
        "你知道哪把椅子不响，哪个抽屉放充电线，几点的茶水间没人。",
        "公司说要全面提升空间流动性。\n你看着自己的靠垫，第一次理解了搬迁成本。",
        "战略可以灵活。\n这把椅子能不能继续固定。"
      ],
      "catchphrase": "“我现在这个其实挺好用的。”",
      "habitat": "同一个位置，同一个杯子旁边。",
      "nemesis": "“明天开始实行共享工位。”"
    },
    {
      "id": "windfall",
      "name": "营业外收入",
      "label": "快乐入账型",
      "code": "JOY",
      "tagline": "工作没给我惊喜，下午茶给了。",
      "paragraphs": [
        "今天很忙。\n但同事多点了一份点心，电梯刚好到一楼，原定的长会突然缩短了。",
        "你的人生主营业务暂时没有惊人表现。\n旁边捡来的快乐，倒是一笔一笔进来了。",
        "事情还没全解决。\n不过这块蛋挞，确实值得。"
      ],
      "catchphrase": "“至少今天还有这个。”",
      "habitat": "下午茶到达现场，以及任何意外空出来的十分钟里。",
      "nemesis": "“你怎么这都能开心？”"
    },
    {
      "id": "skepticism",
      "name": "职业怀疑",
      "label": "证据追问型",
      "code": "PS",
      "tagline": "别人说没问题，我的问题才刚开始。",
      "paragraphs": [
        "“一直都这样。”\n你问，从什么时候开始？",
        "“这个肯定没问题。”\n你问，看过哪份资料？",
        "“相信我就行。”\n你点点头，然后把问题问得更具体了一点。",
        "你不是故意抬杠。\n你只是对“放心”这个附件始终打不开。"
      ],
      "catchphrase": "“依据是什么？”",
      "habitat": "一个听起来过于顺利的结论后面。",
      "nemesis": "“不用看了，我确认过。”"
    },
    {
      "id": "materiality",
      "name": "重要性水平",
      "label": "到点有界型",
      "code": "MAT",
      "tagline": "这件事不重要，但我下班很重要。",
      "paragraphs": [
        "你不是所有事情都不在乎。",
        "真正影响结果的，你会认真处理。\n只是标题第四次改颜色这件事，暂时没有获得你整个晚上的使用权。",
        "别人说“都挺重要”。\n你说“那请排个先后”。",
        "你对生活的要求不高。\n重要的事情里，能不能也有你。"
      ],
      "catchphrase": "“这件事要排在什么前面？”",
      "habitat": "任务清单旁边，以及准备关电脑的那一刻。",
      "nemesis": "“每件事都是最高优先级。”"
    },
    {
      "id": "substance",
      "name": "实质重于形式",
      "label": "少绕一圈型",
      "code": "SUB",
      "tagline": "流程图很漂亮。现在能少填一张表了吗？",
      "paragraphs": [
        "别人拿来一张颜色很协调的流程图。\n你看了半天，只问了一句：\n“所以原来要填的四张表，现在要填几张？”",
        "答案是五张。",
        "你突然觉得，这个流程可以先别这么漂亮。",
        "你对先进的理解很朴素：\n事情能不能真的少绕一圈。"
      ],
      "catchphrase": "“所以具体省在哪一步？”",
      "habitat": "新流程发布会，以及没人敢打开的旧表格旁边。",
      "nemesis": "“虽然步骤多了，但管理更有仪式感了。”"
    },
    {
      "id": "going-concern",
      "name": "持续经营",
      "label": "重新开张型",
      "code": "GC",
      "tagline": "昨日宣布不干，今日正常营业。",
      "paragraphs": [
        "周一说不干了。\n周二又把昨天卡住的事情往前推了一点。",
        "你也会烦，也会跟朋友宣布这次真的受够了。\n但睡一觉，吃顿饭，第二天又能勉强把招牌挂起来。",
        "你没有宏大的奋斗宣言。\n只是这一期，暂时还在营业。"
      ],
      "catchphrase": "“先把今天过完。”",
      "habitat": "每次重新打开文件的瞬间。",
      "nemesis": "“你不是昨天说不干了吗？”"
    }
  ],
  "questions": [
    {
      "id": "q01",
      "title": "领导只发了两个字：“在吗？”你脑内先弹出什么？",
      "options": [
        {
          "text": "完了。需求变了？时间提前了？还是昨天那份表又有新剧情？",
          "type": "provision"
        },
        {
          "text": "先问什么事。一个“在吗”提供的信息量还不够。",
          "type": "skepticism"
        },
        {
          "text": "手指已经回“在”，灵魂还在加载。",
          "type": "depreciated"
        },
        {
          "text": "叹口气，回一个在。今日营业开始了。",
          "type": "going-concern"
        }
      ]
    },
    {
      "id": "q02",
      "title": "同事说：“这个不归谁管，你顺手帮一下？”",
      "options": [
        {
          "text": "发我吧。我的岗位说明书早就装不下现实了。",
          "type": "other-receivables"
        },
        {
          "text": "可以排队。先说它要插在我哪件事前面。",
          "type": "materiality"
        },
        {
          "text": "先把大家快吵起来的语气降一点，再一起找负责人。",
          "type": "goodwill"
        },
        {
          "text": "先看能不能把那个“谁都不管”的步骤从流程里解决掉。",
          "type": "substance"
        }
      ]
    },
    {
      "id": "q03",
      "title": "你决定改善工作效率。一个小时后，更可能发生什么？",
      "options": [
        {
          "text": "任务还没动，模板、目录和命名规则已经焕然一新。",
          "type": "construction"
        },
        {
          "text": "研究完发现，原来的那套顺手程度依然遥遥领先。",
          "type": "fixed-asset"
        },
        {
          "text": "新方法不好看没关系，真的少操作两步就先留着。",
          "type": "substance"
        },
        {
          "text": "效率还没起飞，但午餐券刚好领到了。",
          "type": "windfall"
        }
      ]
    },
    {
      "id": "q04",
      "title": "对方说附件已经发了，但你这边空空如也。",
      "options": [
        {
          "text": "再追一条：“方便转发一下原邮件吗？”我的回声不能就此消失。",
          "type": "receivables"
        },
        {
          "text": "先确认发给了谁、发在何时。结论和记录得先对上。",
          "type": "skepticism"
        },
        {
          "text": "开始预演资料再拖一天，后面几件事会如何挤在一起。",
          "type": "provision"
        },
        {
          "text": "把几个人拉到一处，最终自己成了文件中转站。",
          "type": "other-receivables"
        }
      ]
    },
    {
      "id": "q05",
      "title": "难得没有急事，下班前半小时你最期待什么？",
      "options": [
        {
          "text": "刚好可以买到那家还没卖完的点心。",
          "type": "windfall"
        },
        {
          "text": "按熟悉路线回家，连晚饭点哪家都不需要重新决策。",
          "type": "fixed-asset"
        },
        {
          "text": "把该交接的说清楚，剩下时间正式归我。",
          "type": "materiality"
        },
        {
          "text": "这一关过了。明天的事明天再开张。",
          "type": "going-concern"
        }
      ]
    },
    {
      "id": "q06",
      "title": "有人看完你的成果说：“这不挺简单的吗？”",
      "options": [
        {
          "text": "我先笑一下。会议没尴尬到散场的贡献，又没列进表里。",
          "type": "goodwill"
        },
        {
          "text": "简单？我还有三版改进方案没来得及上。",
          "type": "construction"
        },
        {
          "text": "对，能直接用就好，不用非得长得很费劲。",
          "type": "substance"
        },
        {
          "text": "因为我已经把同一个坑踩熟了。别再加新坑就行。",
          "type": "depreciated"
        }
      ]
    },
    {
      "id": "q07",
      "title": "一早就遇到计划被打乱。你更接近哪种反应？",
      "options": [
        {
          "text": "抱怨两句，重新开一局，先把眼前一件往前挪。",
          "type": "going-concern"
        },
        {
          "text": "脑内先前排演的那个糟糕版本，居然真的上线了。",
          "type": "provision"
        },
        {
          "text": "先弄清到底是哪项变化，别让一句“都变了”包办解释。",
          "type": "skepticism"
        },
        {
          "text": "至少先别动我的工位和惯用工具，让我保住一点秩序。",
          "type": "fixed-asset"
        }
      ]
    },
    {
      "id": "q08",
      "title": "群里突然出现一串“谢谢你，还是你靠谱”。",
      "options": [
        {
          "text": "谢谢后面，是不是又跟着几件没有明确归属的事？",
          "type": "other-receivables"
        },
        {
          "text": "至少刚才快僵住的气氛，总算接回来了。",
          "type": "goodwill"
        },
        {
          "text": "被夸到了。今天的快乐账上可以多记一笔。",
          "type": "windfall"
        },
        {
          "text": "感谢收到。今天能做的也说清楚了，不自动续杯。",
          "type": "materiality"
        }
      ]
    },
    {
      "id": "q09",
      "title": "工作软件宣布又要更新。你先关注什么？",
      "options": [
        {
          "text": "正好，可以趁机把我的整套流程重搭一遍。",
          "type": "construction"
        },
        {
          "text": "别人到底什么时候能把我要的东西顺利传过来？",
          "type": "receivables"
        },
        {
          "text": "旧入口还在不在？我不想连找按钮都重新开始。",
          "type": "fixed-asset"
        },
        {
          "text": "又要学。教程先存着，让我先缓一口气。",
          "type": "depreciated"
        }
      ]
    },
    {
      "id": "q10",
      "title": "对方第三次说“今天一定给”。",
      "options": [
        {
          "text": "好的，我今天再来。礼貌催促是一项长跑。",
          "type": "receivables"
        },
        {
          "text": "已经开始想：今天再没有，明天会拖到哪一步。",
          "type": "provision"
        },
        {
          "text": "吐槽完，再把接下来能推进的部分重新排一排。",
          "type": "going-concern"
        },
        {
          "text": "我会写清等待到什么时间，以及之后怎样重新安排。",
          "type": "materiality"
        }
      ]
    },
    {
      "id": "q11",
      "title": "朋友说：“你这个人，真的很好懂。”",
      "options": [
        {
          "text": "你先说说看，我核对一下证据。",
          "type": "skepticism"
        },
        {
          "text": "是吗？我在公司到现在还没被归进一个明确类别。",
          "type": "other-receivables"
        },
        {
          "text": "等等，我最近又更新了一个版本的自己。",
          "type": "construction"
        },
        {
          "text": "被懂到了，这句话足够让我今天高兴一小会儿。",
          "type": "windfall"
        }
      ]
    },
    {
      "id": "q12",
      "title": "工作告一段落，对方说“辛苦了”。你心里更想接哪句？",
      "options": [
        {
          "text": "谢谢。现在能不能先别对我追加功能。",
          "type": "depreciated"
        },
        {
          "text": "谢谢。之前答应补的那份资料，也别忘了。",
          "type": "receivables"
        },
        {
          "text": "大家没闹僵，事情也谈下来了，这份隐形工作终于可以下班。",
          "type": "goodwill"
        },
        {
          "text": "谢谢。下一轮能不能真的少走一个重复步骤。",
          "type": "substance"
        }
      ]
    }
  ]
};
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else root.FinanceContent = data;
})(globalThis);
