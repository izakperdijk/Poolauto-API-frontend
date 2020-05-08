import { Component, OnInit } from '@angular/core';
import { PoolautoAPIBackendService } from '../../services/poolauto-api-backend.service';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { LicenseSeries } from './series';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  carInfoJSON;
  carInfoString;
  licenseForm: FormGroup;
  feedbackMsg = 'Input a license plate to retrieve corresponding car information';
  seriesRegEx = new RegExp(LicenseSeries.SERIES.join('|'));

  constructor(private backend: PoolautoAPIBackendService) {
  }

  ngOnInit(): void {
    this.licenseForm = new FormGroup({
      licensePlate: new FormControl('', [
        Validators.required,
        Validators.pattern('([A-Z0-9\.])*'),
        Validators.maxLength(6),
        Validators.minLength(6),
        this.regexValidator(this.seriesRegEx, {series: 'Unknown format'})
      ])
    });
  }

  submitQuery() {
    if (this.licenseForm.valid) {
      this.feedbackMsg = 'Processing request.';
      const input = this.licenseForm.get('licensePlate').value;
      this.backend.getLicensePlate(input).subscribe(
        data => {
          this.carInfoJSON = data;
          this.carInfoString = this.JSONtoString(this.carInfoJSON);
          this.feedbackMsg = 'Available data for ' + input;
          return true;
        },
        error => {
          this.feedbackMsg = error.toString();
          this.carInfoJSON = null;
          this.carInfoString = null;
          return true;
        }
      );
      this.licenseForm.reset();
    } else {
      if (this.licenseForm.get('licensePlate').errors?.required) {
        this.feedbackMsg = 'Please fill out the form before submitting';
      } else {
        this.feedbackMsg = 'Wrong input';
      }
    }
  }

  JSONtoString(object) {
    return JSON.stringify(object, null, 2)
      .replace(/,/g, '')
      .replace(/"/g, '')
      .slice(2, -2);            // remove the surrounding curly brackets and newlines
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

}
