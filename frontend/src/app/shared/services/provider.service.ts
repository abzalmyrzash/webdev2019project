import {EventEmitter, Injectable} from '@angular/core';
import {MainService} from './main.service';
import {HttpClient} from '@angular/common/http';
import {IAuthResponse, IGroup, IPost, IComment, LikeData, SubscribeData, IUser} from '../models/models';
import { groupBy } from 'rxjs/internal/operators/groupBy';

@Injectable({
  providedIn: 'root'
})
export class ProviderService extends MainService {

  public sendMessage = new EventEmitter<string>();

  constructor(http: HttpClient) {
    super(http);
  }


  //Group

  getSubscribedGroups(): Promise<IGroup[]> {
    return this.get('http://localhost:8000/api/subscribed_groups/', {});
  }

  getCreatedGroups(): Promise<IGroup[]> {
    return this.get('http://localhost:8000/api/created_groups/', {});
  }

  getGroups(search_parameter: string): Promise<IGroup[]> {
    return this.get('http://localhost:8000/api/groups/?search=' + search_parameter, {});
  }

  createGroup(new_group_name: string): Promise<IGroup> {
    return this.post('http://localhost:8000/api/groups/', {
      name: new_group_name
    });
  }

  getGroup(id: number): Promise<IGroup> {
    return this.get(`http://localhost:8000/api/groups/${id}/`, {});
  }

  updateGroup(group: IGroup, new_group_name: string): Promise<IGroup> {
    return this.put(`http://localhost:8000/api/groups/${group.id}/`, {
      name: new_group_name
    });
  }

  deleteGroup(id: number): Promise<any> {
    return this.delet(`http://localhost:8000/api/groups/${id}/`, {});
  }

//======================================================================================================
  

  // Post

  getGroupPosts(group_id: number): Promise<IPost[]> {
    return this.get(`http://localhost:8000/api/groups/${group_id}/posts/`, {});
  }

  createPost(group_id: number, new_post_title: string, new_post_body: string): Promise<IGroup> {
    return this.post(`http://localhost:8000/api/groups/${group_id}/posts/`, {
      title: new_post_title,
      body: new_post_body
    });
  }

  getPost(id: number): Promise<IPost> {
    return this.get(`http://localhost:8000/api/groups/0/posts/id/`, {});
  }

  updatePost(post: IPost, post_title: string, post_body: string): Promise<IPost> {
    return this.put(`http://localhost:8000/api/groups/0/posts/${post.id}/`, {
      title: post_title,
      body: post_body
    });
  }

  deletePost(id: number): Promise<any> {
    return this.delet(`http://localhost:8000/api/groups/0/posts/${id}/`, {});
  }

//======================================================================================================

  // Comment

  getPostComments(post_id: number): Promise<IComment[]> {
    return this.get(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/`, {});
  }

  createComment(post_id: number, new_comment_body: string): Promise<IComment> {
    return this.post(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/`, {
      body: new_comment_body
    });
  }

  getComment(post_id: number, id: number): Promise<IComment> {
    return this.get(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/1/${id}/`, {});
  }

  updateComment(post_id: number, comment: IComment,comment_body: string): Promise<IComment> {
    return this.put(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/${comment.id}/`, {
      body: comment_body
    });
  }

  deleteComment(post_id: number, id: number): Promise<any> {
    return this.delet(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/${id}/`, {});
  }

  getCommentReplies(post_id: number, comment_id:number): Promise<IComment[]> {
    return this.get(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/${comment_id}/replies/`, {});
  }

  createReply(post_id: number, comment_id:number, reply: IComment): Promise<IComment> {
    return this.get(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/${comment_id}/replies/`, {
      body: reply.body
    });
  }

//======================================================================================================

  //Info about post/comment likes

  getPostLikeCount(post_id: number): Promise<LikeData> {
    return this.get(`http://localhost:8000/api/groups/0/posts/${post_id}/like/`, {});
  }

  getCommentLikeCount(post_id: number, comment_id: number): Promise<LikeData>{
    return this.get(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/${comment_id}/like/`, {});
  }

//======================================================================================================

  //Like a post/comment

  putLikeOnPost(post_id: number): Promise<LikeData>{
    return this.post(`http://localhost:8000/api/groups/0/posts/${post_id}/like/`, {});
  }

  putLikeOnComment(post_id: number, comment_id: number): Promise<LikeData>{
    return this.post(`http://localhost:8000/api/groups/0/posts/${post_id}/comments/${comment_id}/like/`, {});
  }

//======================================================================================================

  //Info about subscriber_count, subscribe to group

  getSubscriberCount(id: number): Promise<SubscribeData> {
    return this.get(`http://localhost:8000/api/groups/${id}/subscribe/`, {});
  }

  subscribeToGroup(id: number): Promise<SubscribeData> {
    return this.post(`http://localhost:8000/api/groups/${id}/subscribe/`, {});
  }

//======================================================================================================


  //login, logout, signup

  auth(login: string, password: string): Promise<IAuthResponse> {
    return this.post('http://localhost:8000/api/login/', {
      username: login,
      password: password
    });
  }

  logout(): Promise<any> {
    return this.post('http://localhost:8000/api/logout/', {});
  }

  signup(username: string, password: string, email: string, first_name: string, last_name: string): Promise<IUser> {
    return this.post('http://localhost:8000/api/signup/', {
      username: username,
      password: password,
      email: email,
      first_name: first_name,
      last_name: last_name,
      is_superuser: false
    });
  }

  getCurrentUser(): Promise<IUser>{
    return this.get('http://localhost:8000/api/current_user/', {})
  }

  getUser(id: number): Promise<IUser> {
    return this.get(`http://localhost:8000/api/users/${id}/`, {})
  }

  setNewPassword(id: number, old_password: string, new_password: string): Promise<any>{
    return this.post(`http://localhost:8000/api/users/${id}/set_password/`, {
      old_password: old_password,
      new_password: new_password
    })
  }

//======================================================================================================
}
