import React, { useEffect, useState } from 'react';
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
  faBars, faUserTie
} from '@fortawesome/free-solid-svg-icons';

const COLORS = ['#4FD1C5', '#F6AD55', '#63B3ED', '#F687B3', '#68D391'];

// ==================== Helper Components ====================

const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
  <div className="col-xl-3 col-md-6 mb-4">
    <div className="card h-100">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col mr-2">
            <div className="text-xs font-weight-bold text-uppercase mb-1">{title}</div>
            <div className="h5 mb-0 font-weight-bold text-gray-800">{value}</div>
            {trend && (
              <div className="mt-2 mb-0 text-muted text-xs">
                <span className={`mr-2 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  <FontAwesomeIcon icon={trend === 'up' ? faAngleUp : faAngleDown} />
                  {trendValue}
                </span>
                <span>Since last month</span>
              </div>
            )}
          </div>
          <div className="col-auto">
            <FontAwesomeIcon icon={icon} className={`fa-2x text-${color}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, description, children, dropdown }) => (
  <div className="card mb-4">
    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
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
    <div className="card-body">
      {children}
    </div>
  </div>
);

const ProgressItem = ({ title, value, percent, color }) => (
  <div className="mb-3">
    <div className="small text-gray-500">
      {title}
      <div className="small float-right"><b>{value}</b></div>
    </div>
    <div className="progress" style={{ height: '12px' }}>
      <div className={`progress-bar bg-${color}`} role="progressbar" 
        style={{ width: `${percent}%` }} aria-valuenow={percent} 
        aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  </div>
);

const MessageItem = ({ title, time, user, bold }) => (
  <div className="customer-message align-items-center">
    <a className={bold ? "font-weight-bold" : ""} href="#">
      <div className="text-truncate message-title">{title}</div>
      <div className={`small text-gray-500 message-time ${bold ? "font-weight-bold" : ""}`}>
        {user} · {time}
      </div>
    </a>
  </div>
);

// ==================== Main Component ====================

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [estsharat, setEstsharat] = useState([]);
  const [users, setUsers] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyStats, setDailyStats] = useState({});
  const [lawyersWithCounts, setLawyersWithCounts] = useState([]);
  const [loading, setLoading] = useState({
    estsharat: true,
    monthly: true,
    users: true,
    stats: true,
    lawyers: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          estsharaResponse, 
          monthlyResponse, 
          usersResponse, 
          statsResponse,
          lawyersResponse
        ] = await Promise.all([
          axios.get('https://stellarwebsocket.shop/api/estshara'),
          axios.get('https://stellarwebsocket.shop/api/estsharas-in-month'),
          axios.get('https://stellarwebsocket.shop/api/users'),
          axios.get('https://stellarwebsocket.shop/api/daily-stats'),
          axios.get('https://stellarwebsocket.shop/api/lawyers-with-estshara-response-count')
        ]);
        
        setEstsharat(Array.isArray(estsharaResponse.data) ? 
          estsharaResponse.data : 
          estsharaResponse.data.data);
        
        setMonthlyData(monthlyResponse.data);
        setUsers(usersResponse.data);
        setDailyStats(statsResponse.data);
        setLawyersWithCounts(lawyersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading({ 
          estsharat: false, 
          monthly: false, 
          users: false, 
          stats: false,
          lawyers: false 
        });
      }
    };

    fetchData();
  }, []);

  if (loading.estsharat || loading.monthly || loading.users || loading.stats || loading.lawyers) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <p className="mt-4 text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  const sentEstsharat = estsharat.filter(e => e.status?.user_reply_status === true);
  const pendingEstsharat = estsharat.filter(e => e.status?.status === 'pending' && !e.status?.user_reply_status);
  const underReviewEstsharat = estsharat.filter(e => e.status?.status === 'under_review' && !e.status?.user_reply_status);
  const rejectedEstsharat = estsharat.filter(e => e.status?.status === 'rejected' && !e.status?.user_reply_status);

  const lawyers = users.filter(u => u.role === 'lawyer');
  const auditors = users.filter(u => u.role === 'auditor');
  const reviewers = users.filter(u => u.role === 'reviewer');
  const clients = users.filter(u => u.role === 'client');

  const statusChartData = [
    { name: 'تم الرد', value: sentEstsharat.length },
    { name: 'بانتظار التدقيق', value: pendingEstsharat.length },
    { name: 'قيد المراجعة', value: underReviewEstsharat.length },
    { name: 'مرفوضة', value: rejectedEstsharat.length },
  ];

  const userRoleChartData = [
    { name: 'محامون', value: lawyers.length },
    { name: 'مدققون', value: auditors.length },
    { name: 'مراجعون', value: reviewers.length },
    { name: 'عملاء', value: clients.length },
  ];

  const formattedMonthlyData = monthlyData.map(item => ({
    name: item.month,
    استشارات: item.count
  }));

  return (
    <div id="wrapper">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {/* Topbar */}
          <nav className="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top">
            <button id="sidebarToggleTop" className="btn btn-link rounded-circle mr-3">
              <FontAwesomeIcon icon={faBars} />
            </button>
            
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown no-arrow">
                <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <FontAwesomeIcon icon={faSearch} className="fa-fw" />
                </a>
                <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" 
                  aria-labelledby="searchDropdown">
                  <form className="navbar-search">
                    <div className="input-group">
                      <input type="text" className="form-control bg-light border-1 small" 
                        placeholder="What do you want to look for?" aria-label="Search" 
                        aria-describedby="basic-addon2" style={{ borderColor: '#3f51b5' }} />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                          <FontAwesomeIcon icon={faSearch} className="fa-sm" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </li>
              
              <li className="nav-item dropdown no-arrow mx-1">
                <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <FontAwesomeIcon icon={faBell} className="fa-fw" />
                  <span className="badge badge-danger badge-counter">3+</span>
                </a>
                <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" 
                  aria-labelledby="alertsDropdown">
                  <h6 className="dropdown-header">مركز التنبيهات</h6>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <div className="mr-3">
                      <div className="icon-circle bg-primary">
                        <FontAwesomeIcon icon={faFile} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="small text-gray-500">December 12, 2019</div>
                      <span className="font-weight-bold">A new monthly report is ready to download!</span>
                    </div>
                  </a>
                  <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                </div>
              </li>
              
              <li className="nav-item dropdown no-arrow mx-1">
                <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <FontAwesomeIcon icon={faEnvelope} className="fa-fw" />
                  <span className="badge badge-warning badge-counter">2</span>
                </a>
                <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" 
                  aria-labelledby="messagesDropdown">
                  <h6 className="dropdown-header">Message Center</h6>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <div className="dropdown-list-image mr-3">
                      <img className="rounded-circle" src="img/man.png" style={{ maxWidth: '60px' }} alt="" />
                      <div className="status-indicator bg-success"></div>
                    </div>
                    <div className="font-weight-bold">
                      <div className="text-truncate">Hi there! I am wondering if you can help me with a problem I've been having.</div>
                      <div className="small text-gray-500">Udin Cilok · 58m</div>
                    </div>
                  </a>
                  <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                </div>
              </li>
              
              <div className="topbar-divider d-none d-sm-block"></div>
              
              <li className="nav-item dropdown no-arrow">
                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img className="img-profile rounded-circle" src="img/boy.png" style={{ maxWidth: '60px' }} alt="Profile" />
                  <span className="ml-2 d-none d-lg-inline text-white small">Admin User</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" 
                  aria-labelledby="userDropdown">
                  <a className="dropdown-item" href="#">
                    <FontAwesomeIcon icon={faUser} className="fa-sm fa-fw mr-2 text-gray-400" />
                    Profile
                  </a>
                  <a className="dropdown-item" href="#">
                    <FontAwesomeIcon icon={faCogs} className="fa-sm fa-fw mr-2 text-gray-400" />
                    Settings
                  </a>
                  <a className="dropdown-item" href="#">
                    <FontAwesomeIcon icon={faList} className="fa-sm fa-fw mr-2 text-gray-400" />
                    Activity Log
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="login.html">
                    <FontAwesomeIcon icon={faSignOutAlt} className="fa-sm fa-fw mr-2 text-gray-400" />
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </nav>
          {/* End Topbar */}

          {/* Container Fluid */}
          <div className="container-fluid" id="container-wrapper">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">لوحة التحكم</h1>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="./">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
              </ol>
            </div>

            {activeModule === 'dashboard' && (
              <div className="row mb-3">
                <StatCard 
                  title="إجمالي الاستشارات" 
                  value={estsharat.length} 
                  icon={faFileAlt}
                  trend="up"
                  trendValue="12%"
                  color="primary"
                />
                <StatCard 
                  title="تم الرد" 
                  value={sentEstsharat.length} 
                  icon={faShoppingCart}
                  trend="up"
                  trendValue="8%"
                  color="success"
                />
                <StatCard 
                  title="المستخدمون الجدد" 
                  value={users.length} 
                  icon={faUsers}
                  trend="up"
                  trendValue="15%"
                  color="info"
                />
                <StatCard 
                  title="طلبات بانتظار التدقيق" 
                  value={pendingEstsharat.length} 
                  icon={faComments}
                  trend="down"
                  trendValue="4%"
                  color="warning"
                />

                {/* Area Chart */}
                <div className="col-xl-8 col-lg-7">
                  <ChartCard title="الاستشارات الشهرية" dropdown>
                    <div className="chart-area">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formattedMonthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fill: '#4a5568' }} />
                          <YAxis tick={{ fill: '#4a5568' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white' }} />
                          <Line 
                            type="monotone" 
                            dataKey="استشارات" 
                            stroke="#4FD1C5" 
                            strokeWidth={2} 
                            dot={{ fill: '#4FD1C5', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>
                
                {/* Pie Chart */}
                <div className="col-xl-4 col-lg-5">
                  <ChartCard title="حالة الاستشارات" dropdown>
                    <div className="mb-3">
                      <ProgressItem 
                        title="تم الرد" 
                        value={`${sentEstsharat.length} of ${estsharat.length} Items`} 
                        percent={(sentEstsharat.length / estsharat.length) * 100} 
                        color="warning" 
                      />
                      <ProgressItem 
                        title="بانتظار التدقيق" 
                        value={`${pendingEstsharat.length} of ${estsharat.length} Items`} 
                        percent={(pendingEstsharat.length / estsharat.length) * 100} 
                        color="success" 
                      />
                      <ProgressItem 
                        title="قيد المراجعة" 
                        value={`${underReviewEstsharat.length} of ${estsharat.length} Items`} 
                        percent={(underReviewEstsharat.length / estsharat.length) * 100} 
                        color="danger" 
                      />
                      <ProgressItem 
                        title="مرفوضة" 
                        value={`${rejectedEstsharat.length} of ${estsharat.length} Items`} 
                        percent={(rejectedEstsharat.length / estsharat.length) * 100} 
                        color="info" 
                      />
                    </div>
                    <div className="card-footer text-center">
                      <a className="m-0 small text-primary card-link" href="#">
                        View More <FontAwesomeIcon icon={faChevronRight} />
                      </a>
                    </div>
                  </ChartCard>
                </div>

                {/* Invoice Example */}
                <div className="col-xl-8 col-lg-7 mb-4">
                  <ChartCard title="آخر الاستشارات">
                    <div className="table-responsive">
                      <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th>رقم الاستشارة</th>
                            <th>الاسم</th>
                            <th>النوع</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {estsharat.slice(0, 5).map(est => (
                            <tr key={est.id}>
                              <td><a href="#">#{est.id}</a></td>
                              <td>{est.full_name}</td>
                              <td>{est.category || 'غير محدد'}</td>
                              <td>
                                <span className={`badge ${
                                  est.status?.user_reply_status ? 'badge-success' : 
                                  est.status?.status === 'pending' ? 'badge-warning' :
                                  est.status?.status === 'under_review' ? 'badge-info' :
                                  est.status?.status === 'rejected' ? 'badge-danger' : 'badge-secondary'
                                }`}>
                                  {est.status?.user_reply_status ? 'تم الرد' : 
                                   est.status?.status === 'pending' ? 'بانتظار التدقيق' :
                                   est.status?.status === 'under_review' ? 'قيد المراجعة' :
                                   est.status?.status === 'rejected' ? 'مرفوضة' : 'غير معروف'}
                                </span>
                              </td>
                              <td>
                                <a href="#" className="btn btn-sm btn-primary">تفاصيل</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ChartCard>
                </div>

                {/* Message From Customer */}
                <div className="col-xl-4 col-lg-5">
                  <div className="card">
                    <div className="card-header py-4 bg-primary d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-light">رسائل العملاء</h6>
                    </div>
                    <div>
                      <MessageItem 
                        title="مرحبًا، لدي استفسار بخصوص استشارتي الأخيرة" 
                        time="58m" 
                        user="أحمد محمد" 
                        bold 
                      />
                      <MessageItem 
                        title="كيف يمكنني متابعة حالة استشارتي؟" 
                        time="2h" 
                        user="سارة علي" 
                      />
                      <MessageItem 
                        title="شكرًا لكم على المساعدة في استشارتي" 
                        time="1d" 
                        user="محمد خالد" 
                        bold 
                      />
                      <MessageItem 
                        title="لدي مشكلة في تسجيل الدخول إلى حسابي" 
                        time="2d" 
                        user="ليلى أحمد" 
                      />
                      <div className="card-footer text-center">
                        <a className="m-0 small text-primary card-link" href="#">
                          View More <FontAwesomeIcon icon={faChevronRight} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'users' && (
              <div className="row">
                <div className="col-lg-12">
                  <ChartCard title="إدارة المستخدمين">
                    <div className="table-responsive">
                      <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>الدور</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.role === 'lawyer' ? 'محامي' :
                                 user.role === 'auditor' ? 'مدقق' :
                                 user.role === 'reviewer' ? 'مراجع' : 'مستفيد'}
                              </td>
                              <td>
                                <span className={`badge ${
                                  user.status === 'active' ? 'badge-success' : 'badge-danger'
                                }`}>
                                  {user.status === 'active' ? 'نشط' : 'معطل'}
                                </span>
                              </td>
                              <td>
                                <a href="#" className="btn btn-sm btn-primary mr-1">تعديل</a>
                                <a href="#" className="btn btn-sm btn-danger">حذف</a>
                              </td>
                            </tr>
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
                      <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th>رقم الاستشارة</th>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>المدينة</th>
                            <th>النوع</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {estsharat.map(est => (
                            <tr key={est.id}>
                              <td>#{est.id}</td>
                              <td>{est.full_name}</td>
                              <td>{est.email}</td>
                              <td>{est.city}</td>
                              <td>{est.category || 'غير محدد'}</td>
                              <td>
                                <span className={`badge ${
                                  est.status?.user_reply_status ? 'badge-success' : 
                                  est.status?.status === 'pending' ? 'badge-warning' :
                                  est.status?.status === 'under_review' ? 'badge-info' :
                                  est.status?.status === 'rejected' ? 'badge-danger' : 'badge-secondary'
                                }`}>
                                  {est.status?.user_reply_status ? 'تم الرد' : 
                                   est.status?.status === 'pending' ? 'بانتظار التدقيق' :
                                   est.status?.status === 'under_review' ? 'قيد المراجعة' :
                                   est.status?.status === 'rejected' ? 'مرفوضة' : 'غير معروف'}
                                </span>
                              </td>
                              <td>
                                <a href="#" className="btn btn-sm btn-primary mr-1">عرض</a>
                                <a href="#" className="btn btn-sm btn-success">رد</a>
                              </td>
                            </tr>
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
                      <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th>اسم المحامي</th>
                            <th>البريد الإلكتروني</th>
                            <th>عدد الاستشارات المجابة</th>
                            <th>النسبة المئوية</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lawyersWithCounts.map(lawyer => (
                            <tr key={lawyer.id}>
                              <td>{lawyer.name}</td>
                              <td>{lawyer.email}</td>
                              <td>{lawyer.estsharas_count}</td>
                              <td>
                                <div className="progress" style={{ height: '10px' }}>
                                  <div 
                                    className="progress-bar bg-success" 
                                    role="progressbar" 
                                    style={{ width: `${(lawyer.estsharas_count / estsharat.length) * 100}%` }} 
                                    aria-valuenow={(lawyer.estsharas_count / estsharat.length) * 100} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <small>{Math.round((lawyer.estsharas_count / estsharat.length) * 100)}%</small>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary">تفاصيل</button>
                              </td>
                            </tr>
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
                    <form>
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">عنوان الموقع</label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" placeholder="عنوان الموقع" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">شعار الموقع</label>
                        <div className="col-sm-9">
                          <input type="file" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">وضع الصيانة</label>
                        <div className="col-sm-9">
                          <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="maintenanceMode" />
                            <label className="custom-control-label" htmlFor="maintenanceMode">تفعيل وضع الصيانة</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <button type="submit" className="btn btn-primary">حفظ الإعدادات</button>
                        </div>
                      </div>
                    </form>
                  </ChartCard>
                </div>
              </div>
            )}
          </div>
          {/* End Container Fluid */}

          {/* Footer */}
          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>حقوق النشر &copy; {new Date().getFullYear()} - تم التطوير بواسطة
                  <b><a href="https://example.com" target="_blank" rel="noopener noreferrer"> فريق استشارة</a></b>
                </span>
              </div>
            </div>
          </footer>
          {/* End Footer */}
        </div>
      </div>

      {/* Scroll to top */}
      <a className="scroll-to-top rounded" href="#page-top">
        <FontAwesomeIcon icon={faAngleUp} />
      </a>
    </div>
  );
};

export default AdminDashboard;