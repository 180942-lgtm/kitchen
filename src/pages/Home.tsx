import { useNavigate } from 'react-router-dom'
import { SearchBar, Grid } from 'antd-mobile'
import { categories } from '../data/menu'

const iconMap: Record<string, string> = {
  '凉菜': '🥗', '卤味': '🍖', '炒菜': '🍳', '炖菜': '🍲',
  '海鲜': '🦞', '汤': '🥣', '主食': '🍚', '酒水': '🍺'
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div style={{ padding: '8px 12px' }}>
      <SearchBar placeholder="搜索菜品" style={{ borderRadius: 20, marginBottom: 12 }} />
      <div style={{ height: 150, background: '#ffd100', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 24, marginBottom: 16, color: '#fff' }} onClick={() => navigate('/shop')}>
        🧙‍♀️ 魔法小厨房
      </div>
      <Grid columns={4} gap={8}>
        {categories.map(cat => (
          <Grid.Item key={cat.name} onClick={() => navigate(`/shop?category=${cat.name}`)}>
            <div style={{ textAlign: 'center', padding: '8px 4px', background: '#fff', borderRadius: 12 }}>
              <div style={{ fontSize: 28 }}>{iconMap[cat.name] || '🍽️'}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{cat.name}</div>
            </div>
          </Grid.Item>
        ))}
      </Grid>
    </div>
  )
}

export default Home