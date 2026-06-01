import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../data/menu'
import ShopHeader from '../components/ShopHeader'
import MenuItem from '../components/MenuItem'
import type { Dish } from '../data/menu'

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || categories[0].name
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const contentRef = useRef<HTMLDivElement>(null)
  const isManualScroll = useRef(false)

  // IntersectionObserver：监听右侧滚动，自动高亮左侧分类
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            const catName = entry.target.dataset.category
            if (catName) {
              setActiveCategory(catName)
            }
          }
        })
      },
      { root: content, threshold: 0.3 }
    )

    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // 点击左侧导航，手动滚动到对应分类
  const handleCategoryClick = (catName: string) => {
    isManualScroll.current = true
    setActiveCategory(catName)
    categoryRefs.current[catName]?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      isManualScroll.current = false
    }, 800)
  }

  // 获取每个分类的 Top 排名
  const getTopDishIds = (dishes: Dish[], topN: number): Set<string> => {
    const sorted = [...dishes].sort((a, b) => (b.monthSales || 0) - (a.monthSales || 0))
    return new Set(sorted.slice(0, topN).map(d => d.id))
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8f8f8' }}>
      <ShopHeader />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧导航 */}
        <div style={{
          width: 90, background: '#fff', overflowY: 'auto',
          borderRight: '1px solid #f0f0f0'
        }}>
          {categories.map(cat => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                padding: '12px 8px',
                fontSize: 13,
                textAlign: 'center',
                background: activeCategory === cat.name ? '#f8f8f8' : '#fff',
                fontWeight: activeCategory === cat.name ? 'bold' : 'normal',
                color: activeCategory === cat.name ? '#FF6B00' : '#666',
                borderLeft: activeCategory === cat.name ? '3px solid #FF6B00' : '3px solid transparent',
              }}
            >
              {cat.name}
            </div>
          ))}
        </div>

        {/* 右侧菜品列表 */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {categories.map(cat => {
            const sortedDishes = [...cat.dishes].sort((a, b) => (b.monthSales || 0) - (a.monthSales || 0))
            const topN = sortedDishes.length >= 8 ? 5 : 3
            const topIds = getTopDishIds(sortedDishes, topN)
            return (
              <div
                key={cat.name}
                ref={el => { categoryRefs.current[cat.name] = el }}
                data-category={cat.name}
              >
                <div style={{ fontSize: 15, fontWeight: 'bold', padding: '8px 0' }}>{cat.name}</div>
                {sortedDishes.map(dish => {
                  const rank = [...topIds].indexOf(dish.id) + 1
                  return <MenuItem key={dish.id} dish={dish} topRank={rank > 0 ? rank : undefined} />
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Shop