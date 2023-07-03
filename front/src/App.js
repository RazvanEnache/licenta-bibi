import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Missing from "./pages/Missing";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import Header from "./components/Header";
import AdminCars from "./pages/admin/AdminCars";
import AdminMerchandises from "./pages/admin/AdminMerchandises";
import useAuth from "./hooks/useAuth";
import AdminTransports from "./pages/admin/AdminTransports";
import AdminTransportDetail from "./pages/admin/AdminTransportDetail";
import UserHome from "./pages/user/UserHome";
import MyProfile from "./pages/user/MyProfile";
import AdminAdministrative from "./pages/admin/AdminAdministrative";

const ROLES = {
	User: "2001",
	Admin: "5150",
	Client: "1300",
};

function App() {
	const { auth } = useAuth();

	return (
		<>
			<Header />
			<Routes>
				<Route path="/" element={<Layout />}>
					{/* public routes */}
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="unauthorized" element={<Unauthorized />} />

					{/* we want to protect these routes */}
					<Route element={<PersistLogin />}>
						<Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
							<Route path="/" element={auth?.roles?.indexOf("5150") > 0 ? <AdminTransports /> : <UserHome />} />
							<Route path="/profile" element={<MyProfile />} />
						</Route>
						<Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
							<Route path="/admin/users" element={<AdminUsers />} />
							<Route path="/admin/users/:id" element={<AdminUserDetails />} />
							<Route path="/admin/cars" element={<AdminCars />} />
							<Route path="/admin/merchandises" element={<AdminMerchandises />} />
							<Route path="/admin/transports" element={<AdminTransports />} />
							<Route path="/admin/transports/:id" element={<AdminTransportDetail />} />
							<Route path="/admin/administrative" element={<AdminAdministrative />} />
						</Route>
					</Route>

					{/* catch all */}
					<Route path="*" element={<Missing />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
