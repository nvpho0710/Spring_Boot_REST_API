import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, message, Select, Checkbox, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const fetchEmployee = async (id: string) => {
  const res = await fetch(`/api/employees/${id}`);
  return res.json();
};
type Employee = {
  id?: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  active: boolean;
  password?: string;
};

const createEmployee = async (data: Employee) => {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Thêm mới thất bại');
  }
  return res.json();
};
const updateEmployee = async ({ id, ...data }: Employee) => {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Cập nhật thất bại');
  }
  return res.json();
};

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
      mutationFn: id ? updateEmployee : createEmployee,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        message.success(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        navigate('/');
      },
      onError: (error: any) => {
        message.error(error.message || 'Có lỗi xảy ra');
      },
    });

  const onFinish = (values: Employee) => {
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
        password: values.password || '',
      };
      if (id) {
        mutation.mutate({ id: Number(id), ...payload });
      } else {
        mutation.mutate(payload);
      }
  };

  useEffect(() => {
    if (id && data) {
      console.log('Employee data for edit:', data);
      form.setFieldsValue({
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
        password: '',
      });
    }
  }, [id, data, form]);

  return (
    <Form
      form={form}
      initialValues={id && data ? {
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
        password: '',
      } : undefined}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}> <Input /> </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}> <Input /> </Form.Item>
      <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}> <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} /> </Form.Item>
      <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}> <Select
        options={[
          { value: 'MALE', label: 'Nam' },
          { value: 'FEMALE', label: 'Nữ' },
          { value: 'OTHER', label: 'Khác' },
        ]}
        placeholder="Chọn giới tính"
        showSearch={false}
        filterOption={false}
        allowClear={false}
      /> </Form.Item>
      <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}> <Input /> </Form.Item>
      <Form.Item name="active" label="Hoạt động" valuePropName="checked"> <Checkbox>Hoạt động</Checkbox> </Form.Item>
      <Form.Item name="password" label="Mật khẩu" rules={[{ required: !id, message: 'Vui lòng nhập mật khẩu' }]}> <Input.Password /> </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {id ? 'Cập nhật' : 'Thêm mới'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>Quay lại</Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
