namespace TechApi.Models
{
    public class Inventory
    {
        #region propertise
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int ReorderStock { get; set; }
        public int StockAbilable { get; set; }

        #endregion
    }
}
