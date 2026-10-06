namespace TechApi.Models
{
    public class Bill
    {
        #region propertise

        public int BillId { get; set; }
        public string BillNo { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string BillDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaymentReceived { get; set; }
        public string PaymentDate { get; set; }
        public string PaymentMethod { get; set; }
        public decimal BalanceAmount { get; set; }
        public string PaymentStatus { get; set; }

        #endregion
    }
}