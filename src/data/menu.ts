// 真实菜品数据
export interface Spec {
  name: string
  options: { label: string; price: number }[]
}

export interface Dish {
  id: string
  name: string
  price: number
  image: string
  description?: string   // 随机生成的描述，可随时删除
  specs?: Spec[]
  monthSales?: number     // 用于排名，保留但不强制显示
  rating?: string
}

export interface Category {
  name: string
  dishes: Dish[]
}

const imgBase = (id: string) => `https://picsum.photos/200/150?random=${id}`
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// 随机描述库
const descPool = [
  '鲜香入味', '口感滑嫩', '麻辣鲜香', '清爽解腻', '酸甜可口', '酥脆多汁',
  '回味无穷', '经典家常', '浓香四溢', '微辣爽口', '秘制酱汁', '外酥里嫩',
  '入口即化', '鲜甜适中', '香辣过瘾', '清淡营养', '汁浓味厚', '脆嫩爽口'
]

const dishNames: Record<string, string[]> = {
  '凉菜': ['蒜泥白肉', '凉拌木耳', '口水鸡', '拍黄瓜', '皮蛋豆腐', '麻辣牛肉', '红油肚丝', '凉拌三丝', '夫妻肺片', '五香熏鱼', '凉拌海带', '香辣鸭掌', '醋溜白菜', '姜汁皮蛋', '凉拌猪耳', '红油抄手', '凉拌豆皮', '爽口萝卜'],
  '卤味': ['卤猪蹄', '卤鸡爪', '卤鸭脖', '卤牛肉', '卤豆腐', '卤蛋', '卤猪耳', '卤鸭翅', '卤鸡翅', '卤猪头肉', '卤鸭舌', '卤牛肚', '卤鸡腿', '卤猪肝', '卤藕片', '卤海带', '卤豆干', '卤猪心'],
  '炒菜': ['鱼香肉丝', '宫保鸡丁', '麻婆豆腐', '回锅肉', '酸辣土豆丝', '糖醋里脊', '干煸四季豆', '辣椒炒肉', '番茄炒蛋', '醋溜白菜', '蒜蓉西兰花', '蚝油生菜', '红烧茄子', '葱爆羊肉', '孜然牛肉', '干锅花菜', '小炒肉', '地三鲜'],
  '炖菜': ['红烧排骨', '清炖羊肉', '土豆炖牛肉', '小鸡炖蘑菇', '酸菜鱼', '毛血旺', '水煮肉片', '萝卜炖牛腩', '冬瓜排骨汤', '菌菇炖鸡汤', '番茄牛腩', '炖大骨头', '雪豆炖猪蹄', '海带炖排骨', '玉米排骨汤', '豆腐鱼头煲', '肥肠炖豆腐', '羊杂汤'],
  '海鲜': ['清蒸鲈鱼', '白灼虾', '辣炒花蛤', '蒜蓉粉丝扇贝', '葱油蛏子', '椒盐皮皮虾', '红烧带鱼', '干烧大虾'],
  '汤': ['紫菜蛋花汤', '番茄蛋汤', '酸辣汤', '冬瓜丸子汤', '菌菇汤', '豆腐白菜汤', '榨菜肉丝汤', '玉米排骨汤'],
  '主食': ['米饭', '馒头', '花卷', '葱油饼', '炒饭', '汤面', '拌面', '饺子'],
  '酒水': ['青岛啤酒', '雪花勇闯天涯', '百威啤酒', '王老吉', '加多宝', '可乐', '雪碧', '矿泉水'],
}

function generateDishes(catName: string, count: number): Dish[] {
  const names = dishNames[catName] || []
  const shuffled = [...names].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)
  const basePrices: Record<string, [number, number]> = {
    '凉菜': [12, 28],
    '卤味': [25, 45],
    '炒菜': [18, 48],
    '炖菜': [38, 78],
    '海鲜': [48, 128],
    '汤': [8, 22],
    '主食': [2, 18],
    '酒水': [3, 12],
  }
  const [minP, maxP] = basePrices[catName] || [10, 30]

  return selected.map((name, i) => {
    // 随机描述，50% 概率有描述
    const hasDesc = Math.random() > 0.3
    const description = hasDesc ? descPool[rand(0, descPool.length - 1)] : undefined

    const hasSpecs = catName === '酒水'  // 只有酒水有温度规格
    const specs = hasSpecs ? [
      { name: '温度', options: [{ label: '常温', price: 0 }, { label: '冰镇', price: 0 }] }
    ] : undefined

    return {
      id: `${catName}-${i}`,
      name,
      price: parseFloat((Math.random() * (maxP - minP) + minP).toFixed(1)),
      image: imgBase(`${catName}-${i}`),
      monthSales: rand(100, 3000),
      description,
      specs,
    }
  })
}

export const categories: Category[] = [
  { name: '凉菜', dishes: generateDishes('凉菜', 18) },
  { name: '卤味', dishes: generateDishes('卤味', 18) },
  { name: '炒菜', dishes: generateDishes('炒菜', 18) },
  { name: '炖菜', dishes: generateDishes('炖菜', 18) },
  { name: '海鲜', dishes: generateDishes('海鲜', 8) },
  { name: '汤',   dishes: generateDishes('汤', 8) },
  { name: '主食', dishes: generateDishes('主食', 8) },
  { name: '酒水', dishes: [
      { id: '酒水-特价', name: '特惠矿泉水', price: 0.1, image: imgBase('water'), monthSales: 999, description: '清凉解渴', specs: [{ name: '温度', options: [{ label: '常温', price: 0 }, { label: '冰镇', price: 0 }] }] },
      ...generateDishes('酒水', 7)
    ]
  },
]

export const shopInfo = {
  name: '魔法小厨房',
  logo: 'https://picsum.photos/100?random=logo',
  banner: 'https://picsum.photos/430/200?random=banner',
  notice: '欢迎光临，新鲜食材，现点现做'
}