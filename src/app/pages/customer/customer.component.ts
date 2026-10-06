// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { CustomerDetailsDialogComponent } from '../customer-details-dialog/customer-details-dialog.component';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-customer',
//   imports: [CommonModule],
//   templateUrl: './customer.component.html',
//   styleUrl: './customer.component.css'
// })
// export class CustomerComponent {

//   private modalService = inject(NgbModal);
//   httpClient = inject(HttpClient);

//   CustomerDetails: any[] = [];

//   ngOnInit() {
//     this.getCustomerDetails();
//   }

//   getCustomerDetails() {
//     let apiurl = "https://localhost:7165/api/Customer";

//     this.httpClient.get<any[]>(apiurl).subscribe({
//       next: (result) => {
//         this.CustomerDetails = result;
//         console.log(result);
//       },
//       error: (error) => {
//         console.log("GET API Error:", error);
//       }
//     });
//   }

//   OpenModal(customer?: any) {

//     const modalRef = this.modalService.open(
//       CustomerDetailsDialogComponent
//     );

//     // Edit ke liye customer data pass karo
//     if (customer) {
//       modalRef.componentInstance.customerDetails = {
//         CustomerId: customer.customerId,
//         Firstname: customer.firstname,
//         Lastname: customer.lastname,
//         Email: customer.email,
//         Mobile: customer.mobile,
//         Registrationdate: customer.registrationdate
//       };

//       modalRef.componentInstance.isUpdate = true;
//     }

//     modalRef.result.then(
//       (data) => {

//         if (data?.event === 'close') {
//           this.getCustomerDetails();
//         }

//       },
//       () => {
//         // Modal manually close/dismiss hone par kuch nahi karna
//       }
//     );
//   }

//   deleteCustomer(customerId: number): void {

//     const isConfirm = confirm(
//       "Are you sure you want to delete this record?"
//     );

//     if (isConfirm) {

//       let apiurl =
//         "https://localhost:7165/api/Customer?CustomerId=" + customerId;

//       this.httpClient.delete(apiurl, {
//         responseType: 'text'
//       }).subscribe({

//         next: (response) => {

//           console.log("Delete Response:", response);

//           alert("Record Deleted Successfully!");

//           this.getCustomerDetails();
//         },

//         error: (error) => {

//           console.log("DELETE API Error:", error);

//           alert("Record could not be deleted.");
//         }

//       });
//     }
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDetailsDialogComponent } from '../customer-details-dialog/customer-details-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer',
  imports: [CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {

  private modalService = inject(NgbModal);
  httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);

  CustomerDetails: any[] = [];
  filteredCustomerDetails: any[] = [];

  ngOnInit() {

    this.getCustomerDetails();

    // URL se search value read karega
    this.route.queryParams.subscribe(params => {

      const searchText = params['search'] || '';

      this.filterCustomers(searchText);

    });
  }

  getCustomerDetails() {

    let apiurl = "https://localhost:7165/api/Customer";

    this.httpClient.get<any[]>(apiurl).subscribe({

      next: (result) => {

        this.CustomerDetails = result;

        // Initially all records show
        this.filteredCustomerDetails = result;

        // URL mein already search hai to filter karo
        const searchText = this.route.snapshot.queryParams['search'] || '';

        this.filterCustomers(searchText);

        console.log(result);
      },

      error: (error) => {

        console.log("GET API Error:", error);

      }

    });
  }

  filterCustomers(searchText: string) {

    const search = searchText.toLowerCase().trim();

    if (!search) {

      this.filteredCustomerDetails = this.CustomerDetails;

      return;
    }

    this.filteredCustomerDetails = this.CustomerDetails.filter(customer =>

      String(customer.customerId)
        .toLowerCase()
        .includes(search)

      ||

      String(customer.firstname)
        .toLowerCase()
        .includes(search)

      ||

      String(customer.lastname)
        .toLowerCase()
        .includes(search)

      ||

      String(customer.email)
        .toLowerCase()
        .includes(search)

      ||

      String(customer.mobile)
        .toLowerCase()
        .includes(search)

    );
  }

  OpenModal(customer?: any) {

    const modalRef = this.modalService.open(
      CustomerDetailsDialogComponent
    );

    // Edit ke liye customer data pass karo
    if (customer) {

      modalRef.componentInstance.customerDetails = {

        CustomerId: customer.customerId,
        Firstname: customer.firstname,
        Lastname: customer.lastname,
        Email: customer.email,
        Mobile: customer.mobile,
        Registrationdate: customer.registrationdate

      };

      modalRef.componentInstance.isUpdate = true;

    }

    modalRef.result.then(

      (data) => {

        if (data?.event === 'close') {

          this.getCustomerDetails();

        }

      },

      () => {

        // Modal manually close/dismiss hone par kuch nahi karna

      }

    );
  }

  deleteCustomer(customerId: number): void {

    const isConfirm = confirm(
      "Are you sure you want to delete this record?"
    );

    if (isConfirm) {

      let apiurl =
        "https://localhost:7165/api/Customer?CustomerId=" + customerId;

      this.httpClient.delete(apiurl, {
        responseType: 'text'
      }).subscribe({

        next: (response) => {

          console.log("Delete Response:", response);

          alert("Record Deleted Successfully!");

          this.getCustomerDetails();

        },

        error: (error) => {

          console.log("DELETE API Error:", error);

          alert("Record could not be deleted.");

        }

      });

    }
  }
}