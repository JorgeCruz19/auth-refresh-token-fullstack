import { useQuery } from '@tanstack/react-query';
import { adminService } from './admin.service.js';

export const useGetAdminAccess = (hasRoleAdmin) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ['admin'],
		queryFn: adminService.getAdminAccess,
		enabled: hasRoleAdmin,
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	return { admin: data, error, isLoading };
};
