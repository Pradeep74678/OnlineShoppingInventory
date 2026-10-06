import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-details-dialog',
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-details-dialog.component.html',
  styleUrl: './customer-details-dialog.component.css'
})
export class CustomerDetailsDialogComponent {

  modal = inject(NgbActiveModal);
  httpClient = inject(HttpClient);

  isUpdate: boolean = false;

  customerDetails = {
    CustomerId: 0,
    Firstname: "",
    Lastname: "",
    Email: "",
    Mobile: "",
    Registrationdate: ""
  };

  onSubmit() {

    let apiurl = "https://localhost:7165/api/Customer";

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Pradeep',
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };

    if (!this.isUpdate) {

      // ADD
      this.httpClient.post(
        apiurl,
        this.customerDetails,
        httpOptions
      ).subscribe({

        next: (response) => {

          console.log("Success:", response);

          alert("Customer Details Added Successfully!");

          this.modal.close({
            event: 'close'
          });
        },

        error: (error) => {

          console.log("POST API Error:", error);

          alert("Customer Details Add Failed!");
        }

      });

    } else {

      // UPDATE
      this.httpClient.put(
        apiurl,
        this.customerDetails,
        httpOptions
      ).subscribe({

        next: (response) => {

          console.log("Update Success:", response);

          alert("Customer Details Updated Successfully!");

          this.modal.close({
            event: 'close'
          });
        },

        error: (error) => {

          console.log("PUT API Error:", error);

          alert("Customer Details Update Failed!");
        }

      });

    }
  }
}