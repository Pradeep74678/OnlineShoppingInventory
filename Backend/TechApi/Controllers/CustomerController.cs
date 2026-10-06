using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Reflection;
using TechApi.Models;

namespace TechApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        [HttpPost]
        public ActionResult SaveCustomerDetails(CustometDtoClass CustometDtoClass)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_SaveCustomerDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@CustomerId", CustometDtoClass.CustomerId);
            command.Parameters.AddWithValue("@Firstname", CustometDtoClass.Firstname);
            command.Parameters.AddWithValue("@Lastname", CustometDtoClass.Lastname);
            command.Parameters.AddWithValue("@Email", CustometDtoClass.Email);
            command.Parameters.AddWithValue("@Mobile", CustometDtoClass.Mobile);
            command.Parameters.AddWithValue("@Registrationdate", CustometDtoClass.Registrationdate);
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();

            return Ok("Inventory data save");
        }


        [HttpGet]
        public ActionResult showCustomerDetails()
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_showCustomerDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            connection.Open();

            // 1. यहाँ List<Inventory> करें (InventoryDto की जगह)
            List<Customer> response = new List<Customer>();

            using (SqlDataReader SqlDataReader = command.ExecuteReader())
            {
                while (SqlDataReader.Read())
                {
                    // 2. सही ऑब्जेक्ट बनाएँ
                    Customer customer = new Customer();
                    customer.CustomerId = Convert.ToString(SqlDataReader["CustomerId"]);
                    customer.Firstname = Convert.ToString(SqlDataReader["FirstName"]);
                    customer.Lastname = Convert.ToString(SqlDataReader["LastName"]);
                    customer.Email = Convert.ToString(SqlDataReader["Email"]);
                    customer.Mobile = Convert.ToString(SqlDataReader["Mobile"]);
                    customer.Registrationdate = Convert.ToString(SqlDataReader["Registrationdate"]);

                   
                    response.Add(customer);
                }
            }
            connection.Close();

            // .NET Core अपने आप ऑब्जेक्ट को JSON बना देता है, JsonConvert की जरूरत नहीं है
            return Ok(response);
        }

        [HttpPut]
        public ActionResult UpdateCustomerDetails(Customer CustometDtoClass)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;"
            };

            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_UpdateCustomerDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };



            command.Parameters.AddWithValue("@CustomerId", CustometDtoClass.CustomerId);
            command.Parameters.AddWithValue("@Firstname", CustometDtoClass.Firstname);
            command.Parameters.AddWithValue("@Lastname", CustometDtoClass.Lastname);
            command.Parameters.AddWithValue("@Email", CustometDtoClass.Email);
            command.Parameters.AddWithValue("@Mobile", CustometDtoClass.Mobile);
            command.Parameters.AddWithValue("@Registrationdate", CustometDtoClass.Registrationdate);

            connection.Open();

            int rows = command.ExecuteNonQuery();

            connection.Close();

            if (rows > 0)
            {
                return Ok("Customer data Update");
            }
            else
            {
                return NotFound("Customer not found");
            }
        }


        [HttpDelete]
        public ActionResult DeleteCustomerDetails(int CustomerId)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;"
            };

            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_DeleteCustomerDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@CustomerId", CustomerId);

            connection.Open();

            int rows = command.ExecuteNonQuery();

            connection.Close();

            if (rows > 0)
            {
                return Ok("Customer data Deleted");
            }
            else
            {
                return NotFound("Customer not found");
            }
        }
    }
}
