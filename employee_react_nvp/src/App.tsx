import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout, Breadcrumb } from 'antd';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDetail from './components/EmployeeDetail';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5', width: '100vw', margin: 0, padding: 0 }}>
          <Layout.Header style={{ 
            color: '#fff', 
            fontSize: 24, 
            textAlign: 'center', 
            letterSpacing: 1,
            height: 64,
            lineHeight: '64px',
            background: '#001529'
          }}>
            Employee Management
          </Layout.Header>
          <Layout.Content style={{ 
            margin: 0,
            padding: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Breadcrumb style={{ margin: '24px 0', width: '90%', maxWidth: '1400px' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ 
              background: '#fff', 
              minHeight: 600, 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
              width: '90%', 
              maxWidth: '1400px', 
              borderRadius: 8 
            }}>
              <Routes>
                <Route path="/" element={<EmployeeList />} />
                <Route path="/employee/new" element={<EmployeeForm />} />
                <Route path="/employee/:id" element={<EmployeeDetail />} />
                <Route path="/employee/:id/edit" element={<EmployeeForm />} />
              </Routes>
            </div>
          </Layout.Content>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;