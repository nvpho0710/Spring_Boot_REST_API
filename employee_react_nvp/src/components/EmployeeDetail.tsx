import { useParams, useNavigate } from 'react-router';
// React Query hook
import { useQuery } from '@tanstack/react-query';
import { Card, Button } from 'antd';

const fetchEmployee = async (id: string) => {
  const res = await fetch(`/api/employees/${id}`);
  return res.json();
};

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Lấy chi tiết nhân viên bằng useQuery
  const { data, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (!data) return <div>Không tìm thấy nhân viên</div>;

  return (
    <Card title={`Thông tin nhân viên #${data.id}`} style={{ maxWidth: 600, margin: '0 auto' }}>
      <p><b>Họ và tên:</b> {data.fullName}</p>
      <p><b>Email:</b> {data.email}</p>
      <p><b>Ngày sinh:</b> {data.dateOfBirth}</p>
      <p><b>Giới tính:</b> {data.gender === 'MALE' ? 'Nam' : data.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</p>
      <p><b>Số điện thoại:</b> {data.phoneNumber}</p>
      <p><b>Hoạt động:</b> {data.active ? '✔️' : '❌'}</p>
      <Button onClick={() => navigate(`/employee/${data.id}/edit`)} type="primary">Sửa</Button>
      <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>Quay lại</Button>
    </Card>
  );
};

export default EmployeeDetail;
