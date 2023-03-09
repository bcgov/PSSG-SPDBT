namespace Spd.Utilities.Address
{
    internal class AddressAutoCompleteClientConfigurations
    {
        public string ApiKey { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int MaxSuggestions { get; set; } = 7;
    }
}
