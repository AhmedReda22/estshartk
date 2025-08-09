import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faUsers, faFileAlt, faCog, 
  faChartArea, faEnvelope, faBell, faTasks,
  faSearch, faAngleUp, faAngleDown, faEllipsisV,
  faChevronDown, faChevronRight, faUser, faCogs,
  faList, faSignOutAlt, faCalendar, faShoppingCart,
  faComments, faFileAlt as faFile, faTable,
  faPalette, faColumns, faChevronLeft,
  faBars, faUserTie, faReply, faCheckCircle, faFileSignature 
} from '@fortawesome/free-solid-svg-icons';

const COLORS = ['#4FD1C5', '#F6AD55', '#63B3ED', '#F687B3', '#68D391'];

const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
  <motion.div 
    className="h-100"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <div className={`card h-100 border-left-${color} border-left-3 shadow-sm`}>
      <div className="card-body p-3">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className="text-xs font-weight-bold text-uppercase mb-1 text-gray-600">
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold text-gray-900">
              {value}
            </div>
            {trend && (
              <div className="mt-2 mb-0 text-muted text-xs">
                <span className={`mr-2 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  <FontAwesomeIcon icon={trend === 'up' ? faAngleUp : faAngleDown} />
                  {trendValue}
                </span>
                <span className="text-gray-500">من الشهر الماضي</span>
              </div>
            )}
          </div>
          <div className="col-auto">
            <div className={`icon-circle bg-${color}-light`}>
              <FontAwesomeIcon 
                icon={icon} 
                className={`text-${color} fa-lg`} 
                fixedWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, description, children, dropdown }) => (
  <motion.div 
    className="card mb-4 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
      <h6 className="m-0 font-weight-bold text-gray-800">{title}</h6>
      {dropdown && (
        <div className="dropdown no-arrow">
          <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" 
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <FontAwesomeIcon icon={faEllipsisV} className="fa-sm fa-fw text-gray-400" />
          </a>
          <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" 
            aria-labelledby="dropdownMenuLink">
            <div className="dropdown-header">Dropdown Header:</div>
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
      )}
    </div>
    <div className="card-body bg-gray-50">
      {children}
    </div>
  </motion.div>
);

const ProgressItem = ({ title, value, percent, color }) => (
  <div className="mb-4">
    <div className="small text-gray-600 font-weight-bold">
      {title}
      <div className="small float-right"><b className="text-gray-800">{value}</b></div>
    </div>
    <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
      <div 
        className={`progress-bar bg-gradient-${color}`} 
        role="progressbar" 
        style={{ 
          width: `${percent}%`,
          borderRadius: '5px',
          boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`
        }} 
        aria-valuenow={percent} 
        aria-valuemin="0" 
        aria-valuemax="100"
      ></div>
    </div>
  </div>
);

const MessageItem = ({ title, time, user, bold }) => (
  <div className="customer-message align-items-center py-2 px-3 rounded hover:bg-gray-100 transition-colors duration-200">
    <a className={`${bold ? "font-weight-bold" : ""} d-block`} href="#">
      <div className="text-truncate message-title">{title}</div>
      <div className={`small text-gray-500 message-time ${bold ? "font-weight-bold" : ""}`}>
        {user} · {time}
      </div>
    </a>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [estsharat, setEstsharat] = useState([]);
  const [users, setUsers] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyStats, setDailyStats] = useState({});
  const [lawyersWithCounts, setLawyersWithCounts] = useState([]);
  const [monthlyEstsharatData, setMonthlyEstsharatData] = useState([]);
  const [repliesCount, setRepliesCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
  Waiting_for_Reviewer_count: 0,
  Waiting_for_Lawyer_count: 0,
  Waiting_for_Approver_count: 0,
  Replied_count: 0,
  Rejected_count: 0,
  Unknown_count: 0
});
  const [pendingEstsharatCount, setPendingEstsharatCount] = useState(0);
  
  const [loading, setLoading] = useState({
  all: true,
  estsharat: true,
  monthly: true, 
  users: true,
  stats: true,
  lawyers: true,
  monthlyEstsharat: true,
  repliesCount: true,
  pendingCount: true
});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        };

        setLoading(prev => ({ ...prev, all: true }));

    const [
      estsharaResponse,
      statsResponse,
      lawyersResponse,
      monthlyEstsharatResponse,
      repliesCountResponse,
      pendingEstsharatResponse,
      statusResponse
    ] = await Promise.all([
      axios.get('https://stellarwebsocket.shop/api/estshara-status', { headers }),
      axios.get('https://stellarwebsocket.shop/api/estsharas-in-month', { headers }),
      axios.get('https://stellarwebsocket.shop/api/lawyers-with-estshara-response-count', { headers }),
      axios.get('https://stellarwebsocket.shop/api/estsharas-in-month', { headers }),
      axios.get('https://stellarwebsocket.shop/api/replies/count', { headers }),
      axios.get('https://stellarwebsocket.shop/api/estshara-created', { headers }),
      axios.get('https://stellarwebsocket.shop/api/estshara-status', { headers }) 
    ]);


        setEstsharat(estsharaResponse.data.data.estsharas || estsharaResponse.data || []);
    setDailyStats(statsResponse.data?.data || statsResponse.data || {});
    setLawyersWithCounts(lawyersResponse.data?.data || lawyersResponse.data || []);
    setRepliesCount(repliesCountResponse.data?.data?.replies_count || repliesCountResponse.data?.replies_count || 0);
    setPendingEstsharatCount(pendingEstsharatResponse.data?.data?.length || 0);
    console.log("oioi:", estsharaResponse);
    // Add this line to set the status counts
    setStatusCounts(statusResponse.data.data || {
      Waiting_for_Reviewer_count: 0,
      Waiting_for_Lawyer_count: 0,
      Waiting_for_Approver_count: 0,
      Replied_count: 0,
      Rejected_count: 0,
      Unknown_count: 0
    });
    
    const processedMonthlyData = processMonthlyEstsharatData(monthlyEstsharatResponse.data);
    setMonthlyEstsharatData(processedMonthlyData);

  } catch (error) {
    console.error("Data fetching error:", error);
    if (error.response?.status === 401) {
      navigate('/login');
    }
  } finally {
    setLoading(prev => ({ ...prev, all: false }));
  }
};

    fetchAllData();
  }, [navigate]);

  const processMonthlyEstsharatData = (apiData) => {
    const consultations = Array.isArray(apiData) ? apiData : apiData?.data || [];
    
    if (!consultations.length) {
      console.warn("No consultations data found");
      return [];
    }

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
                       "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    const monthlyCounts = consultations.reduce((acc, cons) => {
      try {
        const date = new Date(cons.created_at);
        if (isNaN(date)) return acc;

        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;

        if (!acc[key]) {
          acc[key] = {
            month: monthNames[month],
            year,
            count: 0
          };
        }
        
        acc[key].count++;
        return acc;
        
      } catch (e) {
        console.warn("Failed to process consultation:", cons, e);
        return acc;
      }
    }, {});

    return Object.values(monthlyCounts).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });
  };

  const formattedMonthlyEstsharatData = processMonthlyEstsharatData(monthlyEstsharatData);
  const formattedMonthlyData = Array.isArray(monthlyData) 
    ? monthlyData.map(item => ({
        name: item.month,
        استشارات: item.count
      }))
    : [];

  if (loading.all) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"
          ></motion.div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-4 text-gray-700 font-medium"
          >
            Loading data...
          </motion.p>
        </div>
      </div>
    );
  }

  const sentEstsharat = estsharat.filter(e => e.status?.user_reply_status === true);
  const underReviewEstsharat = estsharat.filter(e => e.status?.status === 'under_review' && !e.status?.user_reply_status);
  const rejectedEstsharat = estsharat.filter(e => e.status?.status === 'rejected' && !e.status?.user_reply_status);

  const lawyers = users.filter(u => u.role === 'lawyer');
  const auditors = users.filter(u => u.role === 'auditor');
  const reviewers = users.filter(u => u.role === 'reviewer');
  const clients = users.filter(u => u.role === 'client');

  const statusChartData = [
  { name: 'تم الرد', value: statusCounts.Replied_count },
  { name: 'بانتظار التدقيق', value: statusCounts.Waiting_for_Approver_count },
  { name: 'بإنتظار مراجع معتمد', value: statusCounts.Waiting_for_Reviewer_count },
  { name: 'بإنتظار المحامي', value: statusCounts.Waiting_for_Lawyer_count },
  { name: 'مرفوضة', value: statusCounts.Rejected_count },
].filter(item => item.value > 0); // هذا السطر يضمن عرض العناصر التي لها قيمة فقط

  const userRoleChartData = [
    { name: 'محامون', value: lawyers.length },
    { name: 'مدققون', value: auditors.length },
    { name: 'مراجعون', value: reviewers.length },
    { name: 'عملاء', value: clients.length },
  ];

  return (
    <div id="wrapper" className="bg-gray-50">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <div className="container-fluid" id="container-wrapper">
            <motion.div 
              className="d-sm-flex align-items-center justify-content-between mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="h3 mb-0 text-gray-800 font-weight-bold">لوحة التحكم</h1>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="./" className="text-primary">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
              </ol>
            </motion.div>

            {activeModule === 'dashboard' && (
              <div className="row mb-3">
                <div className="col-lg-4 col-md-6 mb-4">
    <StatCard 
      title="إجمالي الاستشارات" 
      value={estsharat.length} 
      icon={faFileAlt}
      trend="up"
      trendValue="12%"
      color="primary"
    />
  </div>
  <div className="col-lg-4 col-md-6 mb-4">
    <StatCard 
  title="استشارات تم الرد عليها" 
  value={statusCounts.Replied_count} 
  icon={faReply} // تغيير الأيقونة هنا
  color="success"
/>
  </div>
  <div className="col-lg-4 col-md-6 mb-4">
    <StatCard 
      title="طلبات بانتظار التدقيق" 
      value={statusCounts.Waiting_for_Reviewer_count} 
      icon={faComments}
      color="warning"
    />
  </div>

  {/* الصف الثاني - بطاقتين فقط (ستأخذ كل منهما نصف المساحة على الأجهزة الكبيرة) */}
  <div className="col-lg-6 col-md-6 mb-4">
    <StatCard 
      title="استشارات قيد المراجة" 
      value={statusCounts.Waiting_for_Approver_count} 
      icon={faTasks}
      color="info"
    />
  </div>
  <div className="col-lg-6 col-md-6 mb-4">
    <StatCard 
      title="استشارات بانتظار المحامي" 
      value={statusCounts.Waiting_for_Lawyer_count} 
      icon={faUserTie}
      color="secondary"
    />
  </div>

                <div className="row mb-4">

                  
  {/* مخطط حالة الاستشارات - سيأخذ مساحة أقل على الأجهزة الكبيرة */}
  <div className="col-xl-4 col-lg-5">
    <ChartCard title="حالة الاستشارات" dropdown>
      <div className="mb-3" dir="rtl">
        
        <ProgressItem 
          title="تم الرد" 
          value={`${statusCounts.Replied_count} من ${estsharat.length}`} 
          percent={(statusCounts.Replied_count / estsharat.length) * 100} 
          color="primary" 
        />
        <ProgressItem 
          title="بانتظار التدقيق" 
          value={`${statusCounts.Waiting_for_Approver_count} من ${estsharat.length}`} 
          percent={(statusCounts.Waiting_for_Approver_count / estsharat.length) * 100} 
          color="success" 
        />
        <ProgressItem 
          title="بإنتظار مراجع معتمد" 
          value={`${statusCounts.Waiting_for_Reviewer_count} من ${estsharat.length}`} 
          percent={(statusCounts.Waiting_for_Reviewer_count / estsharat.length) * 100} 
          color="warning" 
        />
        <ProgressItem 
          title="بإنتظار المحامي" 
          value={`${statusCounts.Waiting_for_Lawyer_count} من ${estsharat.length}`} 
          percent={(statusCounts.Waiting_for_Lawyer_count / estsharat.length) * 100} 
          color="info" 
        />
        <ProgressItem 
          title="مرفوضة" 
          value={`${statusCounts.Rejected_count} من ${estsharat.length}`} 
          percent={(statusCounts.Rejected_count / estsharat.length) * 100} 
          color="danger" 
        />
        </div>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {statusChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry, index) => (
                <span style={{ color: '#4a5568' }}>
                  {value}: {statusChartData[index].value} ({((statusChartData[index].value / estsharat.length) * 100).toFixed(0)}%)
                </span>
              )}
            />
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} استشارة`, 
                `${name} (${(props.payload.percent * 100).toFixed(1)}%)`
              ]}
              contentStyle={{
                backgroundColor: '#2D3748',
                color: 'white',
                borderRadius: '8px',
                border: 'none'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  </div>

  
  
  <div className="col-xl-8 col-lg-7 mb-4 mb-lg-0">
    <ChartCard title="آخر الاستشارات">
      <div className="table-responsive">
        <table className="table align-items-center table-flush table-hover">
          <thead className="thead-light">
            <tr>
              <th className="border-top-0">رقم الاستشارة</th>
              <th className="border-top-0">الاسم</th>
              <th className="border-top-0">النوع</th>
              <th className="border-top-0">الحالة</th>
              <th className="border-top-0">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {estsharat.slice(0, 5).map(est => (
              console.log('Estshara data:', est),
              <motion.tr 
                key={est.id}
                whileHover={{ backgroundColor: '#f8f9fa' }}
                transition={{ duration: 0.2 }}
              >
                <td><a href="#" className="text-primary font-weight-bold" onClick={() => navigate(`/admin/estshara/${est.id}`)}>#{est.id}</a></td>
                
                <td>{est.full_name}</td>
                <td>{est.category || 'غير محدد'}</td>
                <td>
  <span className={`badge badge-pill ${
    est.status_label === 'Replied' ? 'badge-success text-dark' : 
    est.status_label === 'Waiting for Approver' ? 'badge-warning text-dark' :
    est.status_label === 'Waiting for Reviewer' ? 'badge-info text-dark' :
    est.status_label === 'Waiting for Lawyer' ? 'badge-secondary text-dark' :
    est.status_label === 'Rejected' ? 'badge-danger text-dark' : 'badge-secondary text-dark'
  }`}>
    {est.status_label === 'Replied' ? 'تم الرد' : 
     est.status_label === 'Waiting for Approver' ? 'بانتظار التدقيق' :
     est.status_label === 'Waiting for Reviewer' ? 'بإنتظار مراجع معتمد' :
     est.status_label === 'Waiting for Lawyer' ? 'بإنتظار المحامي' :
     est.status_label === 'Rejected' ? 'مرفوضة' : 'غير معروف'}
  </span>
</td>

<td>
  <button 
    className="btn btn-sm btn-primary shadow-sm"
    onClick={() => navigate(`/admin/estshara/${est.id}`)}
  >
    تفاصيل
  </button>
</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  </div>

</div>

                <div className="col-xl-12 mt-4">
                  <ChartCard title="توزيع الاستشارات الشهرية (تفصيلي)" dropdown>
                    <div className="chart-area">
                      {monthlyEstsharatData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
  <BarChart data={statusChartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" name="عدد الاستشارات">
      {statusChartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-gray-500">لا توجد بيانات متاحة لعرضها</p>
                          <p className="text-muted small">
                            {monthlyEstsharatData.length === 0 && "تم استلام مصفوفة بيانات فارغة"}
                          </p>
                        </div>
                      )}
                    </div>
                  </ChartCard>
                </div>

                
              </div>
            )}

            {activeModule === 'users' && (
              <div className="row">
                <div className="col-lg-12">
                  <ChartCard title="إدارة المستخدمين">
                    <div className="table-responsive">
                      <table className="table align-items-center table-flush table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th className="border-top-0">الاسم</th>
                            <th className="border-top-0">البريد الإلكتروني</th>
                            <th className="border-top-0">الدور</th>
                            <th className="border-top-0">الحالة</th>
                            <th className="border-top-0">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <motion.tr 
                              key={user.id}
                              whileHover={{ backgroundColor: '#f8f9fa' }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="font-weight-bold text-gray-800">{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.role === 'lawyer' ? 'محامي' :
                                 user.role === 'auditor' ? 'مدقق' :
                                 user.role === 'reviewer' ? 'مراجع' : 'مستفيد'}
                              </td>
                              <td>
                                <span className={`badge badge-pill ${
                                  user.status === 'active' ? 'badge-success' : 'badge-danger'
                                }`}>
                                  {user.status === 'active' ? 'نشط' : 'معطل'}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary mr-2 shadow-sm">
                                  تعديل
                                </button>
                                <button className="btn btn-sm btn-danger shadow-sm">
                                  حذف
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ChartCard>
                </div>
              </div>
            )}

            {activeModule === 'estsharat' && (
              <div className="row">
                <div className="col-lg-12">
                  <ChartCard title="إدارة الاستشارات">
                    <div className="table-responsive">
                      <table className="table align-items-center table-flush table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th className="border-top-0">رقم الاستشارة</th>
                            <th className="border-top-0">الاسم</th>
                            <th className="border-top-0">البريد الإلكتروني</th>
                            <th className="border-top-0">المدينة</th>
                            <th className="border-top-0">النوع</th>
                            <th className="border-top-0">الحالة</th>
                            <th className="border-top-0">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {estsharat.map(est => (
                            <motion.tr 
                              key={est.id}
                              whileHover={{ backgroundColor: '#f8f9fa' }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="font-weight-bold text-gray-800">#{est.id}</td>
                              <td>{est.full_name}</td>
                              <td>{est.email}</td>
                              <td>{est.city}</td>
                              <td>{est.category || 'غير محدد'}</td>
                              <td>
  <span className={`badge badge-pill ${
    est.status?.user_reply_status ? 'badge-success text-dark' : 
    est.status?.reviewer_status === 'approved' && !est.status?.lawyer_status ? 'badge-secondary text-dark' :
    est.status?.reviewer_status === 'rejected' ? 'badge-danger text-dark' :
    est.status?.approver_status === 'approved' ? 'badge-info text-dark' :
    'badge-warning text-dark'
  }`}>
    {est.status?.user_reply_status ? 'تم الرد' : 
     est.status?.reviewer_status === 'approved' && !est.status?.lawyer_status ? 'بإنتظار المحامي' :
     est.status?.reviewer_status === 'rejected' ? 'مرفوضة' :
     est.status?.approver_status === 'approved' ? 'بانتظار التدقيق' :
     'قيد المراجعة'}
  </span>
</td>
                              <td>
                                <button className="btn btn-sm btn-primary mr-2 shadow-sm">
                                  عرض
                                </button>
                                <button className="btn btn-sm btn-success shadow-sm">
                                  رد
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ChartCard>
                </div>
              </div>
            )}

            {activeModule === 'lawyers' && (
              <div className="row">
                <div className="col-lg-12">
                  <ChartCard title="المحامون وعدد الاستشارات المجابة">
                    <div className="table-responsive">
                      <table className="table align-items-center table-flush table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th className="border-top-0">اسم المحامي</th>
                            <th className="border-top-0">البريد الإلكتروني</th>
                            <th className="border-top-0">عدد الاستشارات المجابة</th>
                            <th className="border-top-0">النسبة المئوية</th>
                            <th className="border-top-0">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lawyersWithCounts.map(lawyer => (
                            <motion.tr 
                              key={lawyer.id}
                              whileHover={{ backgroundColor: '#f8f9fa' }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="font-weight-bold text-gray-800">{lawyer.name}</td>
                              <td>{lawyer.email}</td>
                              <td>{lawyer.estsharas_count}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 mr-3" style={{ height: '8px' }}>
                                    <div 
                                      className="progress-bar bg-gradient-primary" 
                                      role="progressbar" 
                                      style={{ 
                                        width: `${(lawyer.estsharas_count / estsharat.length) * 100}%`,
                                        borderRadius: '4px'
                                      }} 
                                      aria-valuenow={(lawyer.estsharas_count / estsharat.length) * 100} 
                                      aria-valuemin="0" 
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                  <small className="font-weight-bold">
                                    {Math.round((lawyer.estsharas_count / estsharat.length) * 100)}%
                                  </small>
                                </div>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary shadow-sm">
                                  تفاصيل
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ChartCard>
                </div>
              </div>
            )}

            {activeModule === 'settings' && (
              <div className="row">
                <div className="col-lg-12">
                  <ChartCard title="إعدادات النظام">
                    <form className="px-4 py-3">
                      <div className="form-group row mb-4">
                        <label className="col-sm-3 col-form-label font-weight-bold text-gray-700">عنوان الموقع</label>
                        <div className="col-sm-9">
                          <input 
                            type="text" 
                            className="form-control shadow-sm rounded-lg border-gray-300" 
                            placeholder="عنوان الموقع" 
                          />
                        </div>
                      </div>
                      <div className="form-group row mb-4">
                        <label className="col-sm-3 col-form-label font-weight-bold text-gray-700">شعار الموقع</label>
                        <div className="col-sm-9">
                          <div className="custom-file">
                            <input 
                              type="file" 
                              className="custom-file-input shadow-sm" 
                              id="customFile"
                            />
                            <label className="custom-file-label border-gray-300" htmlFor="customFile">
                              اختر ملف
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row mb-4">
                        <label className="col-sm-3 col-form-label font-weight-bold text-gray-700">وضع الصيانة</label>
                        <div className="col-sm-9">
                          <div className="custom-control custom-switch">
                            <input 
                              type="checkbox" 
                              className="custom-control-input" 
                              id="maintenanceMode" 
                            />
                            <label 
                              className="custom-control-label" 
                              htmlFor="maintenanceMode"
                            >
                              تفعيل وضع الصيانة
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12 text-right">
                          <motion.button 
                            type="submit" 
                            className="btn btn-primary shadow-sm px-4 py-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            حفظ الإعدادات
                          </motion.button>
                        </div>
                      </div>
                    </form>
                  </ChartCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.a 
        className="scroll-to-top rounded shadow-lg bg-primary text-white"
        href="#page-top"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </motion.a>
    </div>
  );
};

export default AdminDashboard;