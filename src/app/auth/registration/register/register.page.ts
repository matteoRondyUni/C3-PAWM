import { Component, OnInit } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('mySlider')  slides: IonSlides;

  constructor() { }

  ngOnInit() {
  }

  isRegistrationPage() {
    document.getElementById("header-registration").style.color = "white";
    document.getElementById("header-registration").style.backgroundColor = "#2196F3";
    document.getElementById("header-registration-label").style.color = "white";
    document.getElementById("header-registration-label").style.backgroundColor = "#2196F3";
  }

  swipeNext(){
    this.slides.slideNext();
  }//
}
