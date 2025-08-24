import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, message } from 'antd';
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
  password: string;
};

const createEmployee = async (data: Employee) => {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
const updateEmployee = async ({ id, ...data }: Employee) => {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
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
      message.success('Thành công!');
      navigate('/');
    },
  });

  const onFinish = (values: Employee) => {
    mutation.mutate(id ? { id: Number(id), ...values } : values);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  return (
    <Form
      form={form}
      initialValues={data}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, min: 4, max: 160 }]}> <Input /> </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}> <Input /> </Form.Item>
      <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true }]}> <Input type="date" /> </Form.Item>
      <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}> <Input.Group compact>
        <Form.Item name="gender" noStyle rules={[{ required: true }]}> <select style={{ width: '100%' }}>
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select> </Form.Item>
      </Input.Group> </Form.Item>
      <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, min: 10, max: 10 }]}> <Input /> </Form.Item>
      <Form.Item name="active" label="Hoạt động" valuePropName="checked" rules={[{ required: true }]}> <Input type="checkbox" /> </Form.Item>
      <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}> <Input.Password /> </Form.Item>
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
