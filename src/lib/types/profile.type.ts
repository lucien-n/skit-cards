export type PublicProfile = {
	uid: string;
	name: string;
	avatar_url: string;
};

export type Profile = {
	email: string;
	created_at: number;
	updated_at: number;
} & PublicProfile;
