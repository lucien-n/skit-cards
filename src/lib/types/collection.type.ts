export type Collection = {
	uid: string;
	author: {
		uid: string;
		name: string;
	};
	name: string;
	is_public: boolean;
	created_at: string;
};
