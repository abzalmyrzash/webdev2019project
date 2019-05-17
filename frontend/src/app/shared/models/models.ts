import { GroupedObservable } from 'rxjs';

export interface IUser{
  id: number;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  reputation: number;
  is_superuser: boolean
  date_joined: Date;
}

export interface IGroup {
  id: number;
  name: string;
  created_by: number;
  created_at: Date;
  subscriber_count: number;
  subscribed: boolean;
}

export interface IPost {
  id: number;
  title: string;
  body: string;
  created_by: IUser;
  created_at: Date;
  group: IGroup;
  like_count: number;
  liked: boolean;
}

export interface IComment {
  id: number;
  body: string;
  created_by: IUser;
  created_at: Date;
  post: IPost;
  like_count: number;
  liked: boolean;
}

export interface LikeData {
  liked: boolean;
  like_count: number;
}

export interface SubscribeData {
  subscribed: boolean;
  subscriber_count: number;
}

export interface IAuthResponse {
  token: string;
}
