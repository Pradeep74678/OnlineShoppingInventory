using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using TechApi.Models;

namespace TechApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {

        [HttpPost]
        public ActionResult SaveBillDetails(BillReqDtoClass BillReqDtoClass)
        {
            try
            {
                SqlConnection connection = new SqlConnection
                {
                    ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
                };

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_SaveBillDetails",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@BillNo", BillReqDtoClass.BillNo);
                command.Parameters.AddWithValue("@CustomerId", BillReqDtoClass.CustomerId);
                command.Parameters.AddWithValue("@BillDate", BillReqDtoClass.BillDate);
                command.Parameters.AddWithValue("@TotalAmount", BillReqDtoClass.TotalAmount);
                command.Parameters.AddWithValue("@PaymentReceived", BillReqDtoClass.PaymentReceived);

                if (string.IsNullOrEmpty(BillReqDtoClass.PaymentDate))
                {
                    command.Parameters.AddWithValue("@PaymentDate", DBNull.Value);
                }
                else
                {
                    command.Parameters.AddWithValue("@PaymentDate", BillReqDtoClass.PaymentDate);
                }

                if (string.IsNullOrEmpty(BillReqDtoClass.PaymentMethod))
                {
                    command.Parameters.AddWithValue("@PaymentMethod", DBNull.Value);
                }
                else
                {
                    command.Parameters.AddWithValue("@PaymentMethod", BillReqDtoClass.PaymentMethod);
                }

                command.Parameters.AddWithValue("@BalanceAmount", BillReqDtoClass.BalanceAmount);
                command.Parameters.AddWithValue("@PaymentStatus", BillReqDtoClass.PaymentStatus);

                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok("Bill data save");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public ActionResult ShowBillDetails()
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
            };

            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_ShowBillDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            connection.Open();

            List<Bill> response = new List<Bill>();

            using (SqlDataReader SqlDataReader = command.ExecuteReader())
            {
                while (SqlDataReader.Read())
                {
                    Bill bill = new Bill();

                    bill.BillId = Convert.ToInt32(SqlDataReader["BillId"]);
                    bill.BillNo = Convert.ToString(SqlDataReader["BillNo"]);
                    bill.CustomerId = Convert.ToInt32(SqlDataReader["CustomerId"]);
                    bill.CustomerName = Convert.ToString(SqlDataReader["CustomerName"]);
                    bill.BillDate = Convert.ToDateTime(SqlDataReader["BillDate"]).ToString("yyyy-MM-dd");
                    bill.TotalAmount = Convert.ToDecimal(SqlDataReader["TotalAmount"]);
                    bill.PaymentReceived = Convert.ToDecimal(SqlDataReader["PaymentReceived"]);

                    if (SqlDataReader["PaymentDate"] != DBNull.Value)
                    {
                        bill.PaymentDate = Convert.ToDateTime(SqlDataReader["PaymentDate"]).ToString("yyyy-MM-dd");
                    }
                    else
                    {
                        bill.PaymentDate = "";
                    }

                    bill.PaymentMethod = Convert.ToString(SqlDataReader["PaymentMethod"]);
                    bill.BalanceAmount = Convert.ToDecimal(SqlDataReader["BalanceAmount"]);
                    bill.PaymentStatus = Convert.ToString(SqlDataReader["PaymentStatus"]);

                    response.Add(bill);
                }
            }

            connection.Close();

            return Ok(response);
        }
        [HttpPut]
        public ActionResult UpdateBillDetails(BillReqDtoClass BillReqDtoClass)
        {
            SqlConnection connection = new SqlConnection
            {
                ConnectionString = "Server=PRADEEP_RAJPUT\\SQLEXPRESS;Database=TechDb;Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True;"
            };

            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_UpdateBillDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@BillId", BillReqDtoClass.BillId);
            command.Parameters.AddWithValue("@BillNo", BillReqDtoClass.BillNo);
            command.Parameters.AddWithValue("@CustomerId", BillReqDtoClass.CustomerId);
            command.Parameters.AddWithValue("@BillDate", BillReqDtoClass.BillDate);
            command.Parameters.AddWithValue("@TotalAmount", BillReqDtoClass.TotalAmount);
            command.Parameters.AddWithValue("@PaymentReceived", BillReqDtoClass.PaymentReceived);

            if (string.IsNullOrEmpty(BillReqDtoClass.PaymentDate))
            {
                command.Parameters.AddWithValue("@PaymentDate", DBNull.Value);
            }
            else
            {
                command.Parameters.AddWithValue("@PaymentDate", BillReqDtoClass.PaymentDate);
            }

            if (string.IsNullOrEmpty(BillReqDtoClass.PaymentMethod))
            {
                command.Parameters.AddWithValue("@PaymentMethod", DBNull.Value);
            }
            else
            {
                command.Parameters.AddWithValue("@PaymentMethod", BillReqDtoClass.PaymentMethod);
            }

            command.Parameters.AddWithValue("@BalanceAmount", BillReqDtoClass.BalanceAmount);
            command.Parameters.AddWithValue("@PaymentStatus", BillReqDtoClass.PaymentStatus);

            connection.Open();

            int rows = command.ExecuteNonQuery();

            connection.Close();

            if (rows > 0)
            {
                return Ok("Bill data Update");
            }
            else
            {
                return NotFound("Bill not found");
            }
        }
    }
}