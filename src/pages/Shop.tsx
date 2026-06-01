import { useState, useRef, useEffect, useCallback } from 'react'
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

  // 根据滚动位置计算当前应该高亮的分类
  const updateActiveCategory = useCallback(() => {
    if (isManualScroll.current) return

    const content = contentRef.current
    if (!content) return

    const containerTop = content.getBoundingClientRect().top
    let currentCat = categories[0]?.name || ''

    // 找到第一个顶部超出容器顶部的分类标题，其前一个分类就是当前所在
    for (let i = categories.length - 1; i >= 0; i--) {
      const catName = categories[i].name
      const el = categoryRefs.current[catName]
      if (el) {
        const rect = el.getBoundingClientRect()
        // 元素顶部 <= 容器顶部 + 50px（留一点偏移）即认为进入了视口
        if (rect.top <= containerTop + 50) {
          currentCat = catName
          break
        }
      }
    }

    setActiveCategory(currentCat)
  }, [])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const handleScroll = () => {
      updateActiveCategory()
    }

    content.addEventListener('scroll', handleScroll, { passive: true })
    return () => content.removeEventListener('scroll', handleScroll)
  }, [updateActiveCategory])

  // 点击左侧导航，手动滚动到对应分类
  const handleCategoryClick = (catName: string) => {
    isManualScroll.current = true
    setActiveCategory(catName)
    const el = categoryRefs.current[catName]
    if (el && contentRef.current) {
      // 计算相对滚动位置
      const containerTop = contentRef.current.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = elTop - containerTop + contentRef.current.scrollTop - 10
      contentRef.current.scrollTo({ top: offset, behavior: 'smooth' })
    }
    setTimeout(() => {
      isManualScroll.current = false
    }, 800)
  }

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