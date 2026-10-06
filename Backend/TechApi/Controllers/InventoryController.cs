using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using TechApi.Models;

namespace TechApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        [HttpPost]
        public ActionResult SaveInventory(Inventory  InventoryDto)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_SaveinventoryData",
                CommandType =System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@ProductId", InventoryDto.ProductId);
            command.Parameters.AddWithValue("@ProductName", InventoryDto.ProductName);
            command.Parameters.AddWithValue("@ReorderStock", InventoryDto.ReorderStock);
            command.Parameters.AddWithValue("@StockAbilable", InventoryDto.StockAbilable);
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();

            return Ok("Inventory data save"); 
        }
        [HttpDelete]
        public ActionResult inventoryDeleteDetailes(int ProductId)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;"
            };

            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_inventoryDeleteDetailes",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@ProductId", ProductId);

            connection.Open();

            int rows = command.ExecuteNonQuery();

            connection.Close();

            if (rows > 0)
            {
                return Ok("Inventory data Deleted");
            }
            else
            {
                return NotFound("ProductId not found");
            }
        }

        [HttpPut]
        public ActionResult inventoryUpdateDetailes(Inventory InventoryDto)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;"
            };

            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_inventoryUpdateDetailes",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };


            command.Parameters.AddWithValue("@ProductId", InventoryDto.ProductId);
            command.Parameters.AddWithValue("@ProductName", InventoryDto.ProductName);
            command.Parameters.AddWithValue("@ReorderStock", InventoryDto.ReorderStock);
            command.Parameters.AddWithValue("@StockAbilable", InventoryDto.StockAbilable);

            connection.Open();

            int rows = command.ExecuteNonQuery();

            connection.Close();

            if (rows > 0)
            {
                return Ok("Inventory data Update");
            }
            else
            {
                return NotFound("ProductId not found");
            }
        }

        [HttpGet]
        public ActionResult GetInventoryData()
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_GetInventoryData",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            connection.Open();

            // 1. यहाँ List<Inventory> करें (InventoryDto की जगह)
            List<Inventory> response = new List<Inventory>();

            using (SqlDataReader SqlDataReader = command.ExecuteReader())
            {
                while (SqlDataReader.Read())
                {
                    // 2. सही ऑब्जेक्ट बनाएँ
                    Inventory inventory = new Inventory();
                    inventory.ProductId = Convert.ToInt32(SqlDataReader["ProductId"]);
                    inventory.ProductName = Convert.ToString(SqlDataReader["ProductName"]);
                    inventory.ReorderStock = Convert.ToInt32(SqlDataReader["ReorderStock"]);
                    inventory.StockAbilable = Convert.ToInt32(SqlDataReader["StockAbilable"]);

                    // 3. सही ऑब्जेक्ट को लिस्ट में जोड़ें
                    response.Add(inventory);
                }
            }
            connection.Close();

            // .NET Core अपने आप ऑब्जेक्ट को JSON बना देता है, JsonConvert की जरूरत नहीं है
            return Ok(response);
        }
    }
}
