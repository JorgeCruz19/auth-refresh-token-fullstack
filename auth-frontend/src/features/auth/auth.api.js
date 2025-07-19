import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from './auth.service.js';

export const useLogOut = () => {
	const queryClient = useQueryClient();

	const { mutate, error, isPending, isError } = useMutation({
		mutationFn: authService.logOut,
		onSuccess: () => {
			queryClient.clear();
		},
	});

	return { mutate, error, isPending, isError };
};
