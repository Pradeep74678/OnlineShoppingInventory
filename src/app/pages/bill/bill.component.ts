import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bill',
  imports: [CommonModule, FormsModule],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {

  httpClient = inject(HttpClient);

  CustomerDetails: any[] = [];

  billDetails: any[] = [];

  // Add / Update check
  isUpdate: boolean = false;

  // Selected Bill Id
  billId: number = 0;


  billData = {
    BillNo: "",
    CustomerId: 0,
    BillDate: "",
    TotalAmount: 0,
    PaymentReceived: 0,
    PaymentDate: "",
    PaymentMethod: "",
    BalanceAmount: 0,
    PaymentStatus: "Pending"
  };


  ngOnInit(): void {

    this.getCustomerDetails();

    this.getBillDetails();

  }


  // =========================
  // GET CUSTOMER DETAILS
  // =========================

  getCustomerDetails(): void {

    let apiurl =
      "https://localhost:7165/api/Customer";


    this.httpClient.get<any[]>(apiurl).subscribe({

      next: (result) => {

        console.log(
          "Customer Data:",
          result
        );

        this.CustomerDetails = result;

      },

      error: (error) => {

        console.log(
          "Customer GET API Error:",
          error
        );

      }

    });

  }


  // =========================
  // GET BILL DETAILS
  // =========================

  getBillDetails(): void {

    let apiurl =
      "https://localhost:7165/api/Bill";


    this.httpClient.get<any[]>(apiurl).subscribe({

      next: (result) => {

        console.log(
          "Bill Details:",
          result
        );

        this.billDetails = result;

      },

      error: (error) => {

        console.log(
          "Bill GET API Error:",
          error
        );

      }

    });

  }


  // =========================
  // CALCULATE BALANCE
  // =========================

  calculateBalance(): void {

    const total =
      Number(this.billData.TotalAmount) || 0;

    const received =
      Number(this.billData.PaymentReceived) || 0;


    this.billData.BalanceAmount =
      total - received;


    if (received >= total && total > 0) {

      this.billData.PaymentStatus =
        "Paid";

    }
    else if (received > 0) {

      this.billData.PaymentStatus =
        "Partial";

    }
    else {

      this.billData.PaymentStatus =
        "Pending";

    }

  }


  // =========================
  // EDIT BILL
  // =========================

  UpdateBill(bill: any): void {

    console.log(
      "Selected Bill:",
      bill
    );

    console.log(
      "Selected BillId:",
      bill.billId
    );


    // Important for Update
    this.billId =
      Number(bill.billId);


    this.billData.BillNo =
      bill.billNo;


    this.billData.CustomerId =
      Number(bill.customerId);


    this.billData.BillDate =
      this.formatDate(bill.billDate);


    this.billData.TotalAmount =
      Number(bill.totalAmount);


    this.billData.PaymentReceived =
      Number(bill.paymentReceived);


    this.billData.PaymentDate =
      this.formatDate(bill.paymentDate);


    this.billData.PaymentMethod =
      bill.paymentMethod || "";


    this.billData.BalanceAmount =
      Number(bill.balanceAmount);


    this.billData.PaymentStatus =
      bill.paymentStatus || "Pending";


    this.isUpdate = true;


    // Edit click ke baad form par le jayega
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // =========================
  // FORMAT DATE
  // =========================

  formatDate(dateValue: any): string {

    if (!dateValue) {

      return "";

    }


    // Already yyyy-MM-dd
    if (
      typeof dateValue === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {

      return dateValue;

    }


    const date =
      new Date(dateValue);


    if (isNaN(date.getTime())) {

      return "";

    }


    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');


    const day =
      String(
        date.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;

  }


  // =========================
  // SAVE / UPDATE BILL
  // =========================

  saveBill(): void {

    this.calculateBalance();


    // Bill No Validation
    if (
      this.billData.BillNo.trim() === ""
    ) {

      alert(
        "Please enter Bill No."
      );

      return;

    }


    // Customer Validation
    if (
      Number(
        this.billData.CustomerId
      ) === 0
    ) {

      alert(
        "Please select Customer."
      );

      return;

    }


    // Bill Date Validation
    if (
      this.billData.BillDate === ""
    ) {

      alert(
        "Please select Bill Date."
      );

      return;

    }


    // Total Amount Validation
    if (
      Number(
        this.billData.TotalAmount
      ) <= 0
    ) {

      alert(
        "Please enter Total Bill Amount."
      );

      return;

    }


    // CustomerId number me
    this.billData.CustomerId =
      Number(
        this.billData.CustomerId
      );


    let apiurl =
      "https://localhost:7165/api/Bill";


    // =========================
    // ADD NEW BILL
    // =========================

    if (!this.isUpdate) {

      console.log(
        "Saving Bill:",
        this.billData
      );


      this.httpClient.post(
        apiurl,
        this.billData,
        {
          responseType: 'text'
        }
      ).subscribe({

        next: (response) => {

          console.log(
            "Bill Save Response:",
            response
          );


          alert(
            "Bill Saved Successfully!"
          );


          // Refresh table
          this.getBillDetails();


          // Clear form
          this.clearForm();

        },


        error: (error) => {

          console.log(
            "Bill POST API Error:",
            error
          );

          console.log(
            "Error Body:",
            error.error
          );


          alert(
            "Bill Save Failed: " +
            error.error
          );

        }

      });

    }


    // =========================
    // UPDATE BILL
    // =========================

    else {

      const updateData = {

        BillId:
          this.billId,

        BillNo:
          this.billData.BillNo,

        CustomerId:
          Number(
            this.billData.CustomerId
          ),

        BillDate:
          this.billData.BillDate,

        TotalAmount:
          Number(
            this.billData.TotalAmount
          ),

        PaymentReceived:
          Number(
            this.billData.PaymentReceived
          ),

        PaymentDate:
          this.billData.PaymentDate,

        PaymentMethod:
          this.billData.PaymentMethod,

        BalanceAmount:
          Number(
            this.billData.BalanceAmount
          ),

        PaymentStatus:
          this.billData.PaymentStatus

      };


      console.log(
        "Update Data:",
        updateData
      );

      console.log(
        "Updating BillId:",
        this.billId
      );


      this.httpClient.put(
        apiurl,
        updateData,
        {
          responseType: 'text'
        }
      ).subscribe({

        next: (response) => {

          console.log(
            "Bill Update Response:",
            response
          );


          alert(
            "Bill Updated Successfully!"
          );


          // Refresh table
          this.getBillDetails();


          // Clear form
          this.clearForm();

        },


        error: (error) => {

          console.log(
            "Bill PUT API Error:",
            error
          );

          console.log(
            "Error Body:",
            error.error
          );


          alert(
            "Bill Update Failed: " +
            error.error
          );

        }

      });

    }

  }


  // =========================
  // CLEAR FORM
  // =========================

  clearForm(): void {

    this.billData = {

      BillNo: "",

      CustomerId: 0,

      BillDate: "",

      TotalAmount: 0,

      PaymentReceived: 0,

      PaymentDate: "",

      PaymentMethod: "",

      BalanceAmount: 0,

      PaymentStatus: "Pending"

    };


    // Reset Update Mode
    this.billId = 0;

    this.isUpdate = false;

  }

}