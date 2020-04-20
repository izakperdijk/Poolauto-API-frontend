import { Component, OnInit } from '@angular/core';
import { PoolautoAPIBackendService } from '../../services/poolauto-api-backend.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public carInfo;
  licenseform: FormGroup;
  validMessage = '';

  constructor(private backend: PoolautoAPIBackendService) { }

  ngOnInit(): void {
    this.licenseform = new FormGroup({
      licenseNumber: new FormControl('', Validators.required)
    });
  }

  submitQuery() {
    if (this.licenseform.valid) {
      this.validMessage = 'Processing request.';
      this.backend.getLicensePlate(this.licenseform.controls.licenseNumber.value).subscribe(
        data => {
          this.carInfo = data;
          this.licenseform.reset();
          this.validMessage = '';
          return true;
        },
        error => {
          this.validMessage = 'No information available for given license plate number';
          return true;
        }
      );
    } else {
      this.validMessage = 'Please fill out the form before submitting';
    }
  }
}
