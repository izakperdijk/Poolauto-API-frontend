import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { PoolautoAPIBackendService } from '../../services/poolauto-api-backend.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public carInfoJSON;
  public carInfoString;
  licenseForm: FormGroup;
  validMessage = '';

  constructor(private backend: PoolautoAPIBackendService) {
  }

  ngOnInit(): void {
    this.licenseForm = new FormGroup({
      licensePlate: new FormControl('', [
        Validators.required,
        Validators.pattern('([a-zA-Z0-9\.]){6}') // Alpha numeric of length 6
      ])
    });
  }

  submitQuery() {
    if (this.licenseForm.valid) {
      this.validMessage = 'Processing request.';
      this.backend.getLicensePlate(this.licenseForm.controls.licensePlate.value).subscribe(
        data => {
          this.carInfoJSON = data;
          this.carInfoString = this.JSONtoString(this.carInfoJSON);
          this.licenseForm.reset();
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

  JSONtoString(object) {
    return JSON.stringify(object, null, 2)
      .replace(/,/g, '')
      .replace(/"/g, '')
      .slice(2, -2);
  }

}
