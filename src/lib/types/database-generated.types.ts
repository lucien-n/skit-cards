export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          answer: string
          collection: string
          created_at: string
          question: string
          uid: string
        }
        Insert: {
          answer: string
          collection: string
          created_at?: string
          question: string
          uid?: string
        }
        Update: {
          answer?: string
          collection?: string
          created_at?: string
          question?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_collection_fkey"
            columns: ["collection"]
            referencedRelation: "cards_collections"
            referencedColumns: ["uid"]
          }
        ]
      }
      cards_collections: {
        Row: {
          author: string
          created_at: string
          is_public: boolean
          name: string
          uid: string
        }
        Insert: {
          author: string
          created_at?: string
          is_public?: boolean
          name: string
          uid?: string
        }
        Update: {
          author?: string
          created_at?: string
          is_public?: boolean
          name?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_collections_author_fkey"
            columns: ["author"]
            referencedRelation: "profiles"
            referencedColumns: ["uid"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          name: string
          uid: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          name: string
          uid: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          name?: string
          uid?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_uid_fkey"
            columns: ["uid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      collection_exists_by_author: {
        Args: {
          collection_name: string
          author_uid: string
        }
        Returns: boolean
      }
      is_collection_author: {
        Args: {
          collection_uid: string
          author_uid: string
        }
        Returns: boolean
      }
      is_collection_public: {
        Args: {
          collection_uid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
