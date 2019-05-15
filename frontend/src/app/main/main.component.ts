import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { ProviderService } from '../shared/services/provider.service';
import { IGroup } from '../shared/models/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public groups: IGroup[] = [];

  public isLogged = false;
  public loading = false;

  public login = '';
  public password = '';

  constructor(private provider: ProviderService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('JoinedIn')

    let token = localStorage.getItem('token');
    if (token){
      this.isLogged = true;
    }

    if (this.isLogged) {
      this.provider.getGroups().then(res => {
        this.groups = res;
        setTimeout(() => {
          this.loading = true;
        }, 2000);
      });
    }
  }

  getGroups() {
    this.provider.getGroups().then(res => {
      this.groups = res;
      this.loading = true;
    });
  }

  sendMessageByService() {
    this.provider.sendMessage.emit('This message From Parent Component');
  }

  updateGroup(c: IGroup) {
    this.provider.updateGroup(c).then(res => {
      console.log(c.name + ' | ' + c.phone + ' updated');
    });
  }

  deleteGroup(c: IGroup) {
    this.provider.deleteGroup(c.id).then(res => {
      console.log(c.name + ' deleted');
      this.provider.getGroups().then(r => {
        this.groups = r;
      });
    });
  }

  createGroup() {
    if (this.name !== '' && this.phone !== '') {
      this.provider.createGroup(this.name, this.phone).then(res => {
        this.name = '';
        this.phone = '';
        this.groups.push(res);
      });
    }
  }

  auth() {
    if (this.login !== '' && this.password !== '') {
      this.provider.auth(this.login, this.password).then(res => {
        console.log(res.token)
        localStorage.setItem('token', res.token);
        this.isLogged = true;
        this.getGroups();
      });
    }
  }

  logout() {
    this.provider.logout().then(res => {
      this.isLogged = false;
      localStorage.clear();
    });
  }

}
