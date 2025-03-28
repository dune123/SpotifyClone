import axios from "axios";
import { create } from "zustand";

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;

	checkAdminStatus: (userEmail: string) => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,

	checkAdminStatus: async (userEmail:string) => {
		if (!userEmail) return; // Prevent API call if no email
		set({ isLoading: true, error: null });
	
		const token = window.localStorage.getItem("token");
	
		try {
			const response = await axios.get(`http://localhost:3000/api/admin/check/${userEmail}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
	
			console.log(response);
			set({ isAdmin: response.data.admin });
		} catch (error:any) {
			set({ 
				isAdmin: false, 
				error: error.response?.data?.message || "Error checking admin status" 
			});
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null });
	},
}));
