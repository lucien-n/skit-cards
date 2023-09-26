export const checkUid = (uid?: string): { uid: string; response?: Response } => {
	if (!uid || uid.length !== 36)
		return {
			uid: '',
			response: new Response(JSON.stringify({ error: ' Please provide a valid uid' }), {
				status: 422
			})
		};
	return { uid };
};
