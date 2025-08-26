import Sidebar from "./AdminSidebar"
import AdminMainHeader from "./AdminMainHeader"
import "./Layout.css"

const Layout = ({ children, currentPage }) => {
  return (
    <div className="page-with-sidebar">
      <Sidebar currentPage={currentPage} />
      <div className="page-content">
        <AdminMainHeader />   {/* 👈 Global header here */}
        {children}
      </div>
    </div>
  )
}

export default Layout
