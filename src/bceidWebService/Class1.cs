using ServiceReference;

using static ServiceReference.BCeIDServiceSoapClient;


namespace bceidWebService;
public  class Class1
{
    public async Task<BCeIDServiceSoapClient?> Test()
    {
        try
        {
            var client = new BCeIDServiceSoapClient(EndpointConfiguration.BCeIDServiceSoap);
            client.ClientCredentials.UserName.UserName = "SPDOSDEV";
            client.ClientCredentials.UserName.Password = "U2mXw3121Y";
            client.Endpoint.Address = new System.ServiceModel.EndpointAddress("https://gws1.development.bceid.ca/webservices/client/V10/BCeIDService.asmx?WSDL");
            AccountDetailResponse resp = await client.getAccountDetailAsync(new AccountDetailRequest() { userGuid = "DA63209C24AA4026B7FB6AB0BE866C94" });
            return client;
        }catch(Exception ex)
        {
            string msg = ex.Message;
            return null;
        }
    }
}
