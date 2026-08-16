# Doloc Town｜关卡3首页开发信息

## 1、主题基础信息

### （1）官方与社群链接

- 官方游戏页（Steam）：https://store.steampowered.com/app/2285550/Doloc_Town/
- Steam Community：https://steamcommunity.com/app/2285550
- Official Discord：https://discord.gg/GcxHkA8nSk
- Reddit：https://www.reddit.com/r/DolocTown/
- Official YouTube：https://www.youtube.com/@LogoiGames
- Official 1.0 Launch Trailer：https://www.youtube.com/watch?v=Q9EGUCSi4mo

### （2）用户关心的数据

| 数据 | 值 |
|---|---|
| Full Release | Aug 6, 2026 |
| Players In-Game | 2,420 |
| User Reviews | 94% Positive |
| Steam Achievements | 80 |

> Players In-Game 与 User Reviews 属于动态数据，建站时应标注数据日期或定期更新。以上数据核对日期：2026-08-12。

### SEO 与首页内容 JSON

```json
{
  "home": {
    "meta": {
      "title": "Doloc Town Wiki — Guides, Crops, Map & Recipes",
      "description": "Master Doloc Town with beginner guides, crop rankings, recipes, maps, NPC gifts, item locations, ranching tips, gene systems, and automation help."
    },
    "hero": {
      "eyebrow": "Fan-Made Community Wiki",
      "title": "Doloc Town",
      "description": "Build a vertical farm and restore a post-apocalyptic wasteland while surviving acid rain, heatwaves, and thunderstorms. Explore ruins, befriend townsfolk, modify crop genes, raise animals, and automate your growing farm.",
      "stats": [
        "Full Release Aug 2026",
        "Updated Aug 2026",
        "30+ Hours Main Story",
        "100+ Hours Extra Content",
        "80 Steam Achievements"
      ],
      "primaryCta": "Start Beginner Guide",
      "secondaryCta": "Explore the Map",
      "tertiaryCta": "Find Items & Recipes",
      "videoLabel": "Official 1.0 Launch Trailer"
    },
    "start": {
      "eyebrow": "Start Here",
      "title": "Your Doloc Town Journey",
      "cards": [
        {
          "number": "1",
          "title": "Beginner Guide",
          "description": "Learn the first priorities, essential tools, early upgrades, and mistakes to avoid when starting your farm."
        },
        {
          "number": "2",
          "title": "Crops & Gene System",
          "description": "Choose profitable crops, understand crop genes, and improve harvest value in every stage of the game."
        },
        {
          "number": "3",
          "title": "Map & Exploration",
          "description": "Navigate the valley, Wetlands, ruins, and quest locations while finding useful resources and shortcuts."
        },
        {
          "number": "4",
          "title": "Farming Automation",
          "description": "Use power systems and robotic drones to automate planting, watering, and harvesting on your vertical farm."
        }
      ]
    },
    "aboutGame": {
      "title": "What is Doloc Town?",
      "paragraphs": [
        "Doloc Town is a side-scrolling pixel-art farming simulation set in a post-apocalyptic wasteland. You play as a young scavenger who builds a vertical farm, gathers resources, crafts equipment, fishes, cooks, explores ruins, and helps restore a struggling settlement.",
        "Its farming systems are shaped by acid rain, heatwaves, thunderstorms, crop genes, ranching, and automation. Players can turn harsh weather into power and irrigation, build relationships with townsfolk, uncover the main story, and grow from survivor to farming tycoon."
      ],
      "stats": [
        {
          "label": "Developer",
          "value": "RedSaw Games Studio"
        },
        {
          "label": "Platform",
          "value": "Windows PC via Steam"
        },
        {
          "label": "Genre",
          "value": "Farming Simulation RPG"
        },
        {
          "label": "Full Release",
          "value": "Aug 6, 2026"
        },
        {
          "label": "Main Story",
          "value": "30+ Hours"
        },
        {
          "label": "Extra Content",
          "value": "100+ Hours"
        },
        {
          "label": "Achievements",
          "value": "80"
        }
      ],
      "cta": "Explore All Guides"
    },
    "finalCta": {
      "title": "Ready to Master Doloc Town?",
      "description": "From your first scrap-built farm to crop genes, ranching, Wetlands puzzles, rare materials, and full automation, our community wiki helps you make steady progress across the wasteland.",
      "primary": "Read the Beginner Guide",
      "secondary": "Play on Steam"
    }
  },
  "footer": {
    "aboutTitle": "Doloc Town Wiki",
    "about": "Doloc Town Wiki is an independent fan-made guide site for players exploring the post-apocalyptic farming simulation. It covers beginner progression, crops, genes, maps, quests, NPC gifts, recipes, materials, ranching, and automation. It is not affiliated with RedSaw Games Studio, Logoi Games, Pathea Games, or Valve.",
    "description": "Fan-made guides for the post-apocalyptic vertical farming sim Doloc Town.",
    "playGame": "Play Doloc Town on Steam",
    "officialDiscord": "Official Discord",
    "officialYoutube": "Official YouTube",
    "communityTool": "Steam Community",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service"
  },
  "sidebarCodes": [
    "暂无",
    "暂无"
  ],
  "metadata": {
    "title": "Doloc Town Wiki — Guides, Crops, Map & Recipes",
    "description": "Explore Doloc Town guides for crops, genes, recipes, maps, NPC gifts, fishing, rare items, ranching, quests, and farm automation in one clear wiki.",
    "keywords": "Doloc Town, wiki, guide, crops, map, recipes, NPC gifts, automation"
  }
}
```

## 2、站点首页信息架构

**首页 → Guides / Farming / Characters & Items / Map & Quests → 16个内容页**

- Guides：Beginner Guide、Walkthrough、Tips and Tricks
- Farming：Most Profitable Crops、Crop Tier List、Gene System、Ranching Guide、Fish Locations、Automation
- Characters & Items：NPC Gifts、Recipes、Metal Frame、Old Chips、Old Engine Cores
- Map & Quests：Map、Wetlands Pipes

## 3、网站主题色与默认明暗模式

结论：使用**亮色主题作为默认主题**。Doloc Town 的像素画面虽然是末日废土题材，但核心体验偏温暖、治愈和种植；浅沙色背景配合植物绿与锈橙点缀，比纯暗色更贴近游戏视觉，也更适合长篇攻略阅读。暗色主题仍保留相同主色以保证品牌一致性。

```css
/* 导航页主题色 - 亮色主题 */
--nav-theme: 86 38% 42%;        /* moss green */
--nav-theme-light: 82 45% 58%;  /* young leaf green */

/* 导航页主题色 - 暗色主题 */
--nav-theme: 86 42% 52%;        /* brighter moss green */
--nav-theme-light: 82 48% 64%;  /* brighter leaf green */
```

建议辅助色：背景使用浅沙色 `42 38% 94%`，强调色使用锈橙 `24 68% 52%`，正文使用深灰褐 `35 18% 18%`。

## 4、多语言

结论：首期最多支持以下4种语言，按优先级排列；不包含中文。

| 优先级 | 语言 | 官方本地化主题名 | 选择理由 |
|---|---|---|---|
| 1 | English | Doloc Town | 全球SEO主语言，也是英文攻略关键词的基础版本。 |
| 2 | Japanese | Doloc Town / ドロックタウン | 日本玩家对像素风、农场模拟与治愈游戏接受度高，1.0已提供日语本地化。 |
| 3 | Korean | Doloc Town / 돌록 타운 | 1.0已提供韩语本地化，发布后已有明显的韩语内容与搜索讨论。 |
| 4 | Portuguese (Brazil) | Doloc Town | 巴西葡萄牙语已获官方支持，可覆盖体量较大的非英语PC玩家市场。 |

## 自查结果

- `home.meta.title`：46字符，≤60
- `metadata.title`：46字符，≤60
- `metadata.description`：147字符，符合140–160字符
- `metadata.keywords`：67字符，≤100
- `home.hero.stats`：全部为字符串
- `home.start.cards`：4个对象
- `home.aboutGame.stats`：全部包含 `label` 与 `value`
- `footer.about`：3句介绍
- `sidebarCodes`：无兑换码系统，按要求填写2条“暂无”，未编造兑换码

## 核实来源

- Steam 官方页面：https://store.steampowered.com/app/2285550/Doloc_Town/
- Steam 官方社区：https://steamcommunity.com/app/2285550
- SteamDB 当前数据：https://steamdb.info/app/2285550/info/
- 官方 1.0 Launch Trailer：https://www.youtube.com/watch?v=Q9EGUCSi4mo
