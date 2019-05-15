export interface User{
  id: number;
  username: string;
  first_name: string,
  last_name: string,
  reputation: number;
  date_joined: Date;
}

export interface IGroup {
  id: number;
  name: string;
  subscribers: Array<User>
  phone: string;
}

export interface IAuthResponse {
  token: string;
}
