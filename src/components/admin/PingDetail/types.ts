/**
 * Admin Ping Detail Types
 */

export interface Author {
  name: string;
  avatar: string;
  timestamp: string;
}

export interface StatusEvent {
  status: string;
  timestamp: string;
  description?: string;
}

export interface PingComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  replies: number;
}

export interface RelatedPing {
  id: string;
  category: string;
  title: string;
  waveCount: number;
}
