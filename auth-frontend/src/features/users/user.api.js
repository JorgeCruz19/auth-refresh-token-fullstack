import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from './user.service.js';

export const useGetAllUsers = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: userService.getAllUsers,
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	return { users: data?.users, error, isLoading };
};

export const useUpdateUserRole = () => {
	const queryClient = useQueryClient();

	const { mutate, error, isError, isSuccess, isPending } = useMutation({
		mutationFn: userService.updateUserRole,
		onSuccess: () => {
			queryClient.invalidateQueries(['users']);
			queryClient.invalidateQueries(['admin']);
		},
	});

	return { mutate, isSuccess, error, isError, isPending };
};
