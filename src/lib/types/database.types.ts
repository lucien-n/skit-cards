import type { MergeDeep } from 'type-fest';
import type { Database as DatabaseGenerated } from './database-generated.types';
export { Json } from './database-generated.types';

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Views: {
				profiles: {
					Row: {
						uid: string;
					};
				};
			};
		};
	}
>;

export type Tables<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
