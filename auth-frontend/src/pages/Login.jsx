import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router';

import useAuthStore from '../store/auth.store';
import { authAPI } from '../api';

const Login = () => {
	const [formData, setFormData] = useState({ email: 'user@example.com', password: 'password' });
	const [errors, setErrors] = useState({});
	const { setAuth } = useAuthStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/dashboard';

	const loginMutation = useMutation({
		mutationFn: authAPI.login,
		onSuccess: (data) => {
			setAuth(data.user, data.accessToken);
			queryClient.invalidateQueries(['user']);
			setErrors({});
			navigate(from, { replace: true });
		},
		onError: (error) => {
			setErrors({ general: error.response?.data?.error || 'Login failed' });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation.mutate(formData);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Inicio de Sesión
					</h2>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='rounded-md shadow-sm -space-y-px'>
						<div>
							<input
								type='text'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Ingrese su usuario'
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							/>
						</div>
						<div>
							<input
								type='password'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Contraseña'
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							/>
						</div>
					</div>

					{errors.general && (
						<div className='text-red-600 text-sm text-center'>{errors.general}</div>
					)}

					<div>
						<button
							type='submit'
							disabled={loginMutation.isLoading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'>
							{loginMutation.isLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>

					<div className='text-center'>
						<Link to='/register' className='text-indigo-600 hover:text-indigo-500'>
							No tienes cuenta? Registrarse
						</Link>
					</div>

					<div className='text-center text-sm text-gray-600'>
						<p>Demo credentials:</p>
						<p>Admin: admin@example.com / password</p>
						<p>User: user@example.com / password</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
