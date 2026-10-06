// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, inject, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-inventory',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './inventory.component.html',
//   styleUrl: './inventory.component.css'
// })
// export class InventoryComponent implements OnInit {
// isUpdate: boolean = false;
//   httpClient = inject(HttpClient);

//   inventoryDto: any[] = [];

//   inventoryData = {
//     ProductId: "",
//     ProductName: "",
//     StockAbilable: 0,
//     ReorderStock: 0
//   };

//   ngOnInit(): void {
//     this.getInventory();
//   }

//   getInventory(): void {

//     let apiurl = "https://localhost:7165/api/Inventory";

//     this.httpClient.get<any[]>(apiurl).subscribe({
//       next: (data) => {

//         console.log("GET API Response:", data);

//         this.inventoryDto = data;

//         console.log("Inventory DTO:", this.inventoryDto);
//       },

//       error: (error) => {
//         console.log("GET API Error:", error);
//       }
//     });
//   }

// UpdateInventory(inventory: any): void {

//   this.inventoryData.ProductId = inventory.productId;
//   this.inventoryData.ProductName = inventory.productName;
//   this.inventoryData.StockAbilable = inventory.stockAbilable;
//   this.inventoryData.ReorderStock = inventory.reorderStock;

//   this.isUpdate = true;

// }


//   onSubmit(): void {

//   let apiurl = "https://localhost:7165/api/Inventory";

//   let httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json'
//     }),
//     responseType: 'text' as 'json'
//   };

//   // NEW RECORD
//   if (!this.isUpdate) {

//     this.httpClient.post(apiurl, this.inventoryData, httpOptions)
//       .subscribe({

//         next: (response) => {

//           console.log("Success:", response);

//           alert("Record Saved Successfully!");

//           this.getInventory();
//         },

//         error: (error) => {
//           console.log("POST API Error:", error);
//         }

//       });

//   }

//   // UPDATE RECORD
//   else {

//     this.httpClient.put(apiurl, this.inventoryData, httpOptions)
//       .subscribe({

//         next: (response) => {

//           console.log("Update Success:", response);

//           alert("Record Updated Successfully!");

//           this.getInventory();

//           // Update complete hone ke baad normal insert mode
//           this.isUpdate = false;

//           // Form clear
//           this.inventoryData = {
//             ProductId: "",
//             ProductName: "",
//             StockAbilable: 0,
//             ReorderStock: 0
//           };
//         },

//         error: (error) => {
//           console.log("PUT API Error:", error);

//           alert("Record Update Failed!");
//         }

//       });

//   }

// }

//  deleteInventory(productId: number): void {

//   const isConfirm = confirm("Are you sure you want to delete this record?");

//   if (isConfirm) {

//     let apiurl =
//       "https://localhost:7165/api/Inventory?ProductId=" + productId;

//     this.httpClient.delete(apiurl, {
//       responseType: 'text'
//     }).subscribe({

//       next: (response) => {

//         console.log("Delete Response:", response);

//         alert("Record Deleted Successfully!");

//         // Table ko refresh karega
//         this.getInventory();
//       },

//       error: (error) => {

//         console.log("DELETE API Error:", error);

//         alert("Record could not be deleted.");
//       }

//     });

//   }

// }

// }

  
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {

  isUpdate: boolean = false;

  httpClient = inject(HttpClient);

  private route = inject(ActivatedRoute);

  inventoryDto: any[] = [];

  filteredInventoryDto: any[] = [];

  inventoryData = {

    ProductId: "",
    ProductName: "",
    StockAbilable: 0,
    ReorderStock: 0

  };

  ngOnInit(): void {

    this.getInventory();

    // URL se search value read karega
    this.route.queryParams.subscribe(params => {

      const searchText = params['search'] || '';

      this.filterInventory(searchText);

    });

  }

  getInventory(): void {

    let apiurl = "https://localhost:7165/api/Inventory";

    this.httpClient.get<any[]>(apiurl).subscribe({

      next: (data) => {

        console.log("GET API Response:", data);

        this.inventoryDto = data;

        this.filteredInventoryDto = data;

        const searchText =
          this.route.snapshot.queryParams['search'] || '';

        this.filterInventory(searchText);

        console.log("Inventory DTO:", this.inventoryDto);

      },

      error: (error) => {

        console.log("GET API Error:", error);

      }

    });

  }

  filterInventory(searchText: string): void {

    const search = searchText.toLowerCase().trim();

    if (!search) {

      this.filteredInventoryDto = this.inventoryDto;

      return;

    }

    this.filteredInventoryDto = this.inventoryDto.filter(inventory =>

      String(inventory.productId)
        .toLowerCase()
        .includes(search)

      ||

      String(inventory.productName)
        .toLowerCase()
        .includes(search)

      ||

      String(inventory.stockAbilable)
        .toLowerCase()
        .includes(search)

      ||

      String(inventory.reorderStock)
        .toLowerCase()
        .includes(search)

    );

  }

  UpdateInventory(inventory: any): void {

    this.inventoryData.ProductId = inventory.productId;

    this.inventoryData.ProductName = inventory.productName;

    this.inventoryData.StockAbilable = inventory.stockAbilable;

    this.inventoryData.ReorderStock = inventory.reorderStock;

    this.isUpdate = true;

  }

  onSubmit(): void {

    let apiurl = "https://localhost:7165/api/Inventory";

    let httpOptions = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),

      responseType: 'text' as 'json'

    };

    // NEW RECORD
    if (!this.isUpdate) {

      this.httpClient
        .post(apiurl, this.inventoryData, httpOptions)
        .subscribe({

          next: (response) => {

            console.log("Success:", response);

            alert("Record Saved Successfully!");

            this.getInventory();

          },

          error: (error) => {

            console.log("POST API Error:", error);

          }

        });

    }

    // UPDATE RECORD
    else {

      this.httpClient
        .put(apiurl, this.inventoryData, httpOptions)
        .subscribe({

          next: (response) => {

            console.log("Update Success:", response);

            alert("Record Updated Successfully!");

            this.getInventory();

            this.isUpdate = false;

            this.inventoryData = {

              ProductId: "",
              ProductName: "",
              StockAbilable: 0,
              ReorderStock: 0

            };

          },

          error: (error) => {

            console.log("PUT API Error:", error);

            alert("Record Update Failed!");

          }

        });

    }

  }

  deleteInventory(productId: number): void {

    const isConfirm =
      confirm("Are you sure you want to delete this record?");

    if (isConfirm) {

      let apiurl =
        "https://localhost:7165/api/Inventory?ProductId=" + productId;

      this.httpClient.delete(apiurl, {

        responseType: 'text'

      }).subscribe({

        next: (response) => {

          console.log("Delete Response:", response);

          alert("Record Deleted Successfully!");

          this.getInventory();

        },

        error: (error) => {

          console.log("DELETE API Error:", error);

          alert("Record could not be deleted.");

        }

      });

    }

  }

}