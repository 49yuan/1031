import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // 侧边栏组件
import Header from './components/Header';
import HomePage from './components/HomePage'; // 登录主页组件
import RegisterPage from './components/RegisterPage';
// import Dashboard from './components/Dashboard'; // 仪表盘页面组件
import MaterialsDocuments from './components/MaterialsDocuments';
import MaterialsImages from './components/MaterialsImages';
import MaterialsMusic from './components/MaterialsMusic';
import MaterialsVideos from './components/MaterialsVideos';
import MaterialsBackground from './components/MaterialsBackground';
import MaterialsSound from './components/MaterialsSound';
import ProductsDocuments from './components/ProductsDocuments';
import ProductsImages from './components/ProductsImages';
import ProductsMusic from './components/ProductsMusic';
import ProductsVideos from './components/ProductsVideos';
import ProductsDigitalV from './components/ProductsDigitalV';
// import ViewDocumentPage from './components/ViewDocumentPage';

function Layout({ children }) {
  let location = useLocation();
  return (
    <div className="app">
      {location.pathname !== '/' && (location.pathname !== '/register' && (
        <>
          <Sidebar />
          <Header />
        </>
      ))}
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/materials/background" element={<MaterialsBackground />} />
          <Route path="/materials/sound" element={<MaterialsSound />} />
          <Route path="/materials/documents" element={<MaterialsDocuments />} />
          <Route path="/materials/images" element={<MaterialsImages />} />
          <Route path="/materials/music" element={<MaterialsMusic />} />
          <Route path="/materials/videos" element={<MaterialsVideos />} />
          <Route path="/products/documents" element={<ProductsDocuments />} />
          <Route path="/products/images" element={<ProductsImages />} />
          <Route path="/products/music" element={<ProductsMusic />} />
          <Route path="/products/videos" element={<ProductsVideos />} />
          <Route path="/products/digitalv" element={<ProductsDigitalV />} />
          {/* <Route path="/view-document" element={<ViewDocumentPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;