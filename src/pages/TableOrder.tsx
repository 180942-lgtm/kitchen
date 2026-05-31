import { useParams } from 'react-router-dom';
import Shop from './Shop';

const TableOrder: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  return (
    <div>
      <div style={{ background: '#ffd100', padding: '8px 16px', fontWeight: 'bold', textAlign: 'center' }}>
        🪑 桌号：{tableId || '未知'}
      </div>
      <Shop />
    </div>
  );
};

export default TableOrder;