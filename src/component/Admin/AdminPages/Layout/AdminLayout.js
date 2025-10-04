import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

// eslint-disable-next-line
export default function AdminLayout() {
  return (
  <>
      <AdminHeader />
      <AdminSidebar />
      <Outlet />
    </>
  );
}
