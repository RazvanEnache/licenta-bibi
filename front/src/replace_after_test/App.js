import Register from "./components/Register";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import TransporterHome from "./components/TransporterHome";
import AdminHome from "./components/AdminHome";
import RequireAuth from "./components/RequireAuth";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Layout from "./components/Layout";
import PersistLogin from "./components/PersistLogin";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* public routes */}
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="unauthorized" element={<Unauthorized />} />

				{/* we want to protect these routes */}
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth isAdmin={true} />}>
						<Route path="/" element={<AdminHome />} />
					</Route>

					<Route element={<RequireAuth isAdmin={false} />}>
						<Route path="/" element={<TransporterHome />} />
					</Route>

					{/* catch all */}
					<Route path="*" element={<Missing />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
