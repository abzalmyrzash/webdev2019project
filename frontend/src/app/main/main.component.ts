import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { ProviderService } from '../shared/services/provider.service';
import { IGroup, IUser, IPost, IComment, LikeData, SubscribeData } from '../shared/models/models';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent implements OnInit {
  
  public isLogged = false;
  public loading = false;

  public login = '';
  public password = '';
  public remember_me: boolean = false;
  public cur_user: IUser;
  public user: IUser;
  public new_username: string = '';
  public new_password: string = '';
  public new_email: string = '';
  public new_first_name: string = '';
  public new_last_name: string = '';

  public subscribed_groups: IGroup[] = []
  public created_groups: IGroup[] = []
  public groups: IGroup[] = [];
  public cur_group: IGroup;
  public new_group_name: string = '';
  public edit_group_name: string = '';

  public posts: IPost[] = []
  public cur_post: IPost;
  public new_post_title: string = '';
  public new_post_body: string = '';
  public edit_post_title: string = '';
  public edit_post_body: string = '';

  public comments: IComment[] = [];
  public cur_comment: IComment;
  public new_comment_body: string = '';
  public edit_comment_body: string = '';

  public location: string = "Login";

  public search_parameter: string = '';

  public set_new_password: boolean = false;
  public set_password_old_pw: string = '';
  public set_password_new_pw: string = '';


  // public like_count: number;
  // public liked: boolean;
  // public subscriber_count: number;
  // public subscribed: boolean;

  public edit: boolean;

  constructor(private provider: ProviderService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('JoinedIn')

    let token = localStorage.getItem('token');
    if (token){
      this.isLogged = true;
      this.location = 'GroupList';
      this.getCurrentUser()
    }
    else{
      let login = localStorage.getItem('login');
      let password = localStorage.getItem('password');
      if(login && password){
        this.login = login;
        this.password = password;
      }
    }

    let remember_me = localStorage.getItem('remember_me')
    if(remember_me){
      this.remember_me = true
    }

    if (this.isLogged) {
      this.getSubscribedGroups();
      this.getCreatedGroups();
    }
  }

  sendMessageByService() {
    this.provider.sendMessage.emit('This message From Parent Component');
  }
//=====================================================================================
  getSubscribedGroups() {
    this.loading = false;
    this.provider.getSubscribedGroups().then(res => {
      this.subscribed_groups = res;

      for(let group of this.subscribed_groups){
        this.getSubscriberCount(group);
      }

    });
    
    setTimeout(() => {
      this.loading = true;
    }, 500);
  }

  getCreatedGroups() {
    this.loading = false;
    this.provider.getCreatedGroups().then(res => {
      this.created_groups = res;

      for(let group of this.created_groups){
        this.getSubscriberCount(group);
      }
    });

    setTimeout(() => {
      this.loading = true;
    }, 500);
  }

  getGroups() {
    this.loading = false;
    this.provider.getGroups(this.search_parameter).then(res => {
      this.groups = res;

      for(let group of this.groups){
        this.getSubscriberCount(group);
      }
    });

    setTimeout(() => {
      this.loading = true;
    }, 500);
  }

  createGroup() {
    var name: string = this.new_group_name;
    if (this.new_group_name !== '') {
      this.provider.createGroup(this.new_group_name).then(res => {
        this.new_group_name = '';
      });
    }
  }

  updateGroup(group: IGroup) {
    if (this.edit_group_name !== '') {
      this.provider.updateGroup(group, this.edit_group_name).then(res => {
        group = res;
        console.log(group.name + ' | '+ ' updated');
      });
    }
  }

  deleteGroup(group: IGroup) {
    this.provider.deleteGroup(group.id).then(res => {
      console.log(group.name + ' deleted');
      group = null;
      this.provider.getGroups('').then(r => {
        this.groups = r;
      });
    });
  }
//=====================================================================================
  
  getGroupPosts(){
    this.loading = false;
    this.provider.getGroupPosts(this.cur_group.id).then(res => {
      this.posts = res;
      for(let post of this.posts){
        this.provider.getPostLikeCount(post.id).then(res => {
          post.liked = res.liked;
          post.like_count = res.like_count;
        });
      }
    })
    setTimeout(() => {
      this.loading = true;
    }, 2000);
  }

  createPost() {
    if (this.new_post_title !== '' && this.new_post_body !== '') {
      this.provider.createPost(this.cur_group.id, this.new_post_title, this.new_post_body).then(res => {
        this.new_post_title = '';
        this.new_post_body = '';
      });
    }
  }

  updatePost(post: IPost) {
    if(this.edit_post_title !== '' && this.edit_post_body !== ''){
      this.provider.updatePost(post, this.edit_post_title, this.edit_post_body).then(res => {
        console.log(post.title + ' | '+ ' updated');
      });
    }
  }

  deletePost(post: IPost) {
    this.provider.deletePost(post.id).then(res => {
      console.log(post.title + ' deleted');
      post = null;
      this.provider.deletePost(post.id).then(r => {
        this.posts = r;
      });
    });
  }

//==============================================================================================

  
getPostComments(){
  this.loading = false;
  this.provider.getPostComments(this.cur_post.id).then(res => {
    this.comments = res;
    for(let comment of this.comments){
      this.provider.getPostLikeCount(comment.id).then(res => {
        comment.liked = res.liked;
        comment.like_count = res.like_count;
      });
    }
  });
  setTimeout(() => {
    this.loading = true;
  }, 2000);
}

createComment() {
  if (this.new_comment_body !== '') {
    this.provider.createComment(this.cur_post.id, this.new_comment_body).then(res => {
      this.new_comment_body = '';
    });
  }
}

updateComment(comment) {
  if (this.new_comment_body !== '') {
    this.provider.updateComment(this.cur_post.id, comment, this.edit_comment_body).then(res => {
      console.log(this.cur_post.title + ' | '+ ' updated');
    });
  }
}

deleteComment(comment) {
  this.provider.deleteComment(this.cur_post.id, comment.id).then(res => {
    console.log(this.cur_post.title + ' deleted');
    this.cur_post = null;
    this.provider.deletePost(this.cur_post.id).then(r => {
      this.posts = r;
    });
  });
}

getCommentReplies(comment) {
  this.provider.getCommentReplies(this.cur_post.id, comment.id).then(res => {
    comment = null;
  })
}

// setLikeTextColor(el: Element, liked: boolean){
//   el.setAttribute("style", "color:" + (liked ? "green" : "black"));
// }

//==============================================================================================
  getPostLikeCount(post: IPost) {
    this.provider.getPostLikeCount(post.id).then(res => {
      post.liked = res.liked;
      post.like_count = res.like_count;
    })
  }

  getCommentLikeCount(post_id: number, comment: IComment) {
    this.provider.getCommentLikeCount(post_id, comment.id).then(res => {
      comment.liked = res.liked;
      comment.like_count = res.like_count;
    });
  }

  putLikeOnPost(post: IPost) {
    this.provider.putLikeOnPost(post.id).then(res => {
      post.liked = res.liked;
      post.like_count = res.like_count;
    })
  }

  putLikeOnComment(post_id: number, comment: IComment) {
    
    this.provider.putLikeOnComment(post_id, comment.id).then(res => {
      comment.liked = res.liked;
      comment.like_count = res.like_count;
    });
  }

  getSubscriberCount(group: IGroup) {
    this.provider.getSubscriberCount(group.id).then(res => {
      group.subscriber_count = res.subscriber_count;
      group.subscribed = res.subscribed;
    })
  }

  subscribeToGroup(group: IGroup) {
    this.provider.subscribeToGroup(group.id).then(res => {
      group.subscriber_count = res.subscriber_count;
      group.subscribed = res.subscribed;
    });
  }
//==============================================================================================


  auth() {
    if (this.login !== '' && this.password !== '') {
      this.provider.auth(this.login, this.password).then(res => {
        console.log(res.token)
        localStorage.setItem('token', res.token);
        this.isLogged = true;
        this.getSubscribedGroups();
        this.getCreatedGroups();
        this.location='GroupList';
        if(this.remember_me){
          localStorage.setItem('login', this.login);
          localStorage.setItem('password', this.password);
          localStorage.setItem('remember_me', "");
        }
        else{
          localStorage.removeItem('login');
          localStorage.removeItem('password');
          localStorage.removeItem('remember_me');
        }
        this.login = '';
        this.password = '';
        this.getCurrentUser();
      });
    }
  }

  logout() {
    this.provider.logout().then(res => {
      this.isLogged = false;
      localStorage.removeItem('token');
      let login = localStorage.getItem('login');
      let password = localStorage.getItem('password');
      if(login && password){
        this.login = login;
        this.password = password;
      }
    });
  }

  signup() {
    if(this.new_username !== '' && this.new_password !== '' && this.new_email !== '' &&
      this.new_first_name !== '' && this.new_last_name !== '') {
        
        this.provider.signup(this.new_username, this.new_password, this.new_email, this.new_first_name, this.new_last_name).then(res => {
          this.login = this.new_username;
          this.password = this.new_password;
          this.auth();
          this.new_username = this.new_password = this.new_first_name = this.new_last_name = this.new_email = '';
        })
    }    
  }

  getCurrentUser(){
    this.provider.getCurrentUser().then(res => {
      this.cur_user = res;
    })
  }

  getUser(id: number): IUser{
    this.provider.getUser(id).then(res => {
      this.user = res;
      console.log(res.username);
    })

    return this.user;
  }

  setNewPassword(){
    if(this.set_password_old_pw != '' && this.set_password_new_pw != ''){
      let success = false;
      this.provider.setNewPassword(this.cur_user.id, this.set_password_old_pw, this.set_password_new_pw).then(res => {
        success = true;
        alert("Password successfully changed");
      })
      if(!success) alert("Failed to change password");
      this.set_password_old_pw = this.set_password_new_pw = '';
    }
  }


  //====================================================================================================

  refreshPage(){
    if(this.location == "GroupList"){
      this.getSubscribedGroups();
      this.getCreatedGroups();
    }
    else if(this.location == "PostList"){
      this.getGroupPosts();
    }
    else if(this.location == "CommentList"){
      this.getPostComments();
    }
  }
}
