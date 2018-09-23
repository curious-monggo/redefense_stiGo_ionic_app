import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from './../../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userObj = {
    user_name: '',
    user_email:'',
    user_photo_url: '',
    user_type:''
  };
  userKey;

  displayName;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private authProvider: AuthProvider,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.afAuth.authState.subscribe(user =>{
      if(user){
        this.userObj.user_name = user.displayName;
        this.userObj.user_email = user.email;
        this.userObj.user_photo_url = user.photoURL;
        this.userKey = user.uid;
        this.authProvider.addUserDocument(this.userKey, this.userObj);
        console.log(this.userObj);
        this.navCtrl.pop();
        console.log(user.uid, 'uid to');

      } else {
        console.log('Error on login, stay there');
      }
    });
  }
  googleSignIn(){
    console.log('Google Sign in');
    // this.authProvider.signInWithGoogle();
  }

  facebookSignIn(){
    console.log('Facebook Sign in');
    this.authProvider.signInWithFacebook();
  }
  goToHome(){
    this.navCtrl.setRoot('TabsPage');
  }
  // signOut(){
  //   this.authProvider.signOut();
  // }
}
