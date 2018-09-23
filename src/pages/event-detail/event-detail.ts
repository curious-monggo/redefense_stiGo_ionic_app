import { AttendanceProvider } from './../../providers/attendance/attendance';


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { HotspotProvider } from './../../providers/hotspot/hotspot';
import { EventProvider } from '../../providers/event/event';
import { Event } from './../../models/event/event';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { Hotspot } from '@ionic-native/hotspot';

/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  eventDocumentId;
  eventDocument:Event;
  userDocRef;
  userDoc;
  isStudent:boolean;
  isSBG:boolean;
  userId;
  programType;
  userObj = {
    student_id_number: '',
    student_first_name: '',
    student_middle_name:'',
    student_last_name: '',
    student_program:'',
    student_year_level:''
  };
  attendanceParameters = {
    attendance_event_date: '',
    attendance_event_name: '',
    attendance_password: '',
    attendance_time_end: '',
    attendance_time_start: ''
  }
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams, 
     private hotspotProvider:HotspotProvider,
     private toastCtrl:ToastController,
     private attendanceProvider: AttendanceProvider,
     private afAuth: AngularFireAuth,
     private afDb: AngularFirestore,
     private eventProvider: EventProvider,
     private hotspot: Hotspot
     ){
      this.afAuth.authState.subscribe(user => {
        
        this.userDocRef = this.afDb.doc(`users/${user.uid}`);
        this.userId = user.uid;
      //  this.programType = user.student_program;
        this.userDoc = this.userDocRef.valueChanges();
        
        
        this.userDoc.subscribe(user => {
          console.log(user)
          if(user.user_type == 'Student'){
            this.isStudent = true;
            this.isSBG = false;
            //this.programType = user.student_program;
            console.log(this.programType, this.userId);
            this.getAttendanceParameters();
            console.log(user.user_type);
            this.userObj = {
              student_id_number: user.student_id_number,
              student_first_name: user.student_first_name,
              student_middle_name: user.student_middle_name,
              student_last_name: user.student_last_name,
              student_program:user.student_program,
              student_year_level: user.student_year_level
            };
            console.log(this.userObj);
            this.attendanceProvider.checkAttendanceStatus(this.eventDocumentId, this.userObj);
        
          }
          else if (user.user_type == 'SBG'){
            this.isSBG = true;
            this.isStudent = false;
            this.getAttendanceParameters();
          }
        });
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailPage');
    this.eventDocumentId = this.navParams.get('id');
    console.log(this.eventDocumentId);
    this.getEventDocument(this.eventDocumentId);

  }
  getEventDocument(eventDocumentId){
    this.eventProvider.getEventDocument(eventDocumentId).subscribe(eventDocument => {
      this.eventDocument = eventDocument;
    }, error => {
      this.navCtrl.pop();
    });
  }

  openAttendanceHostMode(){
    this.createHotspot(
        this.attendanceParameters.attendance_event_name, 
        this.attendanceParameters.attendance_password
      );
  }
  openAttendeeMode(){
    this.connectToHotspot(
      this.attendanceParameters.attendance_event_name, 
      this.attendanceParameters.attendance_password 
    );
  }
  createHotspot(ssid:string, password:string){
    this.hotspot.createHotspot(ssid, 'WPA', password).then((onCreateHotspotSuccess => {
      console.log(onCreateHotspotSuccess);
      this.toast(onCreateHotspotSuccess);
    }), error => {
      console.log(error);
      this.toast(error);
    });
  }
  connectToHotspot(ssid:string, password:string){
    this.hotspot.connectToWifi(ssid, password).then((onConnectToHotspotSuccess => {
      this.toast(onConnectToHotspotSuccess);
      this.hotspot.removeWifiNetwork(ssid);
      this.attendanceProvider.signInForAttendance(this.eventDocumentId, this.userObj);
    }),
    onRejected => {
      console.log(onRejected);
    })
  }
  toast(message){
    let toast = this.toastCtrl.create({
      message:message,
      position:'bottom',
      duration: 3000
    });
    toast.present();
  }
  getAttendanceParameters(){
    this.attendanceProvider.getAttendanceParameters(this.eventDocumentId).subscribe(attendanceParams => {
      this.attendanceParameters = {
        attendance_event_date: attendanceParams.attendance_event_date,
        attendance_event_name: attendanceParams.attendance_event_name,
        attendance_password: attendanceParams.attendance_password,
        attendance_time_end: attendanceParams.attendance_time_end,
        attendance_time_start: attendanceParams.attendance_time_start
      };
    });
  }
}
