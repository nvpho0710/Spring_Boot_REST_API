import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button,  message, Input, Space } from 'antd';
import { useState } from 'react';

type Employee = {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  active: boolean;
};

const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await fetch('/api/employees');
  return res.json();
};

const deleteEmployee = async (id: number) => {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    let errorMsg = 'Xóa thất bại';
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return true;
};

const EmployeeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });
  const [search, setSearch] = useState('');

  const mutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Xóa thành công!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Xóa thất bại!');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      mutation.mutate(id);
    }
  };

  // Lọc dữ liệu theo search
  const filteredData = (data || []).filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.phoneNumber.includes(search)
  );

  return (
    <div style={{ width: '100%', padding: 0 }}>
      <Space style={{ marginBottom: 0 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên hoặc email"
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => navigate('/employee/new')}>Thêm mới</Button>
      </Space>
      <Table
        style={{ width: '100%' }}
        loading={isLoading}
        dataSource={filteredData}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Họ và tên', dataIndex: 'fullName' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Ngày sinh', dataIndex: 'dateOfBirth' },
          { title: 'Giới tính', dataIndex: 'gender', render: (g: string) => g === 'MALE' ? 'Nam' : g === 'FEMALE' ? 'Nữ' : 'Khác' },
          { title: 'Số điện thoại', dataIndex: 'phoneNumber' },
          { title: 'Hoạt động', dataIndex: 'active', render: (a: boolean) => a ? '✔️' : '❌' },
          {
            title: 'Hành động',
            render: (_: unknown, record: Employee) => (
              <>
                <Button onClick={() => navigate(`/employee/${record.id}`)}>Xem</Button>
                <Button onClick={() => navigate(`/employee/${record.id}/edit`)} style={{ marginLeft: 8 }}>Sửa</Button>
                <Button danger style={{ marginLeft: 8 }} loading={mutation.isPending} onClick={() => handleDelete(record.id)}>Xóa</Button>
              </>
            ),
          },
        ]}
        pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 20] }}
      />
    </div>
  );
};

export default EmployeeList;
