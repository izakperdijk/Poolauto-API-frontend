import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { PoolautoAPIBackendService } from '../../services/poolauto-api-backend.service';
import {FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  carInfoJSON;
  carInfoString;
  licenseForm: FormGroup;
  validMessage = '';
  series = [
    '[A-Z]{2}[0-9]{4}',         // 1
    '[0-9]{4}[A-Z]{2}',         // 2
    '[0-9]{2}[A-Z]{2}[0-9]{2}', // 3
    '[A-Z]{2}[0-9]{2}[A-Z]{2}', // 4
    '[A-Z]{4}[0-9]{2}',         // 5
    '[0-9]{2}[A-Z]{4}',         // 6
    '[0-9]{2}[A-Z]{3}[0-9]{1}', // 7
    '[0-9]{1}[A-Z]{3}[0-9]{2}', // 8
    '[A-Z]{2}[0-9]{3}[A-Z]{1}', // 9
    '[A-Z]{1}[0-9]{3}[A-Z]{2}', // 10
    '[A-Z]{3}[0-9]{2}[A-Z]{1}'  // 11
    ];
  seriesRegEx = new RegExp(this.series.join('|'));

  constructor(private backend: PoolautoAPIBackendService) {
  }

  ngOnInit(): void {
    this.licenseForm = new FormGroup({
      licensePlate: new FormControl('', [
        Validators.required,
        Validators.pattern('([A-Z0-9\.])*'),
        Validators.maxLength(6),
        Validators.minLength(6),
        this.regexValidator(this.seriesRegEx, {series: ''})
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
      if (this.licenseForm.get('licensePlate').errors?.required) {
        this.validMessage = 'Please fill out the form before submitting';
      } else {
        this.validMessage = 'Wrong input';
      }
    }
  }

  JSONtoString(object) {
    return JSON.stringify(object, null, 2)
      .replace(/,/g, '')
      .replace(/"/g, '')
      .slice(2, -2);
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
