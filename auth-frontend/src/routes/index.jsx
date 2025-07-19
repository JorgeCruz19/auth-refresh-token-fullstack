import { Navigate, Route, Routes } from 'react-router';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoutes';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminPanel from '../pages/AdminPanel';

const AppRoutes = () => {
	const { isAuthenticated } = useAuth();
	console.log(isAuthenticated);
	return (
		<Routes>
			<Route
				path='/login'
				element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Login />}
			/>
			<Route
				path='/register'
				element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Register />}
			/>
			<Route
				path='/dashboard'
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin'
				element={
					<ProtectedRoute requireRole='admin'>
						<AdminPanel />
					</ProtectedRoute>
				}
			/>
			<Route path='/' element={<Navigate to='/dashboard' replace />} />
		</Routes>
	);
};

export default AppRoutes;
