import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//providers
import { AuthProvider } from './../../providers/auth/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  userDocRef: any;
  userDoc: any;
  isStudent: boolean =false;
  notice:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private afDb: AngularFirestore,
    private afAuth: AngularFireAuth
    ) {
      this.afAuth.authState.subscribe(user => {
        
        this.userDocRef = this.afDb.doc(`users/${user.uid}`);
        this.userDoc = this.userDocRef.valueChanges();
        
        
        this.userDoc.subscribe(user => {
          console.log(user)
          if(user.user_type == 'Student'){
            this.isStudent = true;
            console.log(user.user_type);
            this.notice = 'You have already registered as a student.'
        
          }
          else if(user.user_type == 'SBG'){
            this.isStudent = true;
            console.log(user.user_type);
            this.notice = 'You have already registered as a student, SBG officer.'
        
          }
          else if(user.user_type == 'Admin'){
            this.isStudent = true;
            console.log(user.user_type);
            this.notice = 'Welcome, admin.'
        
          }  
          else{
            this.isStudent = false;
            this.notice ='Register account as student';
          }
        });
      
    });
  }
  ionViewCanEnter(){

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');

  }
  goToRegistrationCodePage(){
    if(this.isStudent == true){
    }
    else{
      this.navCtrl.push('RegistrationCodePage');
    }

  }
  signOut(){
    this.authProvider.signOut();
    this.navCtrl.setRoot('TabsPage');
  }

}
