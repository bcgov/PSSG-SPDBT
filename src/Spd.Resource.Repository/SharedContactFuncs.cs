using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository;
internal static class SharedContactFuncs
{
    public static async Task<contact?> CreateContact(this DynamicsContext context,
        contact contact,
        spd_identity? identity,
        IEnumerable<spd_alias> aliases,
        CancellationToken ct)
    {
        context.AddTocontacts(contact);
        if (identity != null)
            context.AddLink(contact, nameof(contact.spd_contact_spd_identity), identity);
        if (aliases.Any())
        {
            foreach (var alias in aliases)
            {
                if (AliasExists(context, alias, contact) == null)
                {
                    context.AddTospd_aliases(alias);
                    // associate alias to contact
                    context.SetLink(alias, nameof(alias.spd_ContactId), contact);
                }
            }
        }
        return contact;
    }

    public static async Task<contact?> UpdateContact(this DynamicsContext context,
        contact existingContact,
        contact newContact,
        spd_identity? identity,
        IEnumerable<spd_alias> aliases,
        CancellationToken ct)
    {
        if (!NameIsSame(existingContact, newContact))
        {
            //put old name to spd_alias
            spd_alias newAlias = new spd_alias
            {
                spd_firstname = existingContact.firstname,
                spd_surname = existingContact.lastname,
                spd_middlename1 = existingContact.spd_middlename1,
                spd_middlename2 = existingContact.spd_middlename2,
                spd_source = (int)AliasSourceTypeOptionSet.UserEntered,
            };
            if (AliasExists(context, newAlias, existingContact) == null)
            {
                context.AddTospd_aliases(newAlias);
                // associate alias to contact
                context.SetLink(newAlias, nameof(newAlias.spd_ContactId), existingContact);
            }
        }

        //when we found address is different, need to put current address to previous address.
        if (newContact.address1_country != null && newContact.address1_line1 != null && !MailingAddressIsSame(existingContact, newContact))
        {
            //put old address to spd_address
            spd_address newAddress = CreateAddrFromContact(existingContact, true);
            if (AddressExists(context, newAddress, existingContact) == null)
            {
                context.AddTospd_addresses(newAddress);
                // associate address to contact
                context.SetLink(newAddress, nameof(newAddress.spd_Contact), existingContact);
            }
        }

        //when we found residential address is different, need to put current address to previous address.
        if (newContact.address2_country != null && newContact.address2_line1 != null && !ResidentialAddressIsSame(existingContact, newContact))
        {
            //put old address to spd_address
            spd_address newAddress = CreateAddrFromContact(existingContact, false);
            if (newAddress.spd_address1 != null && newAddress.spd_country != null && AddressExists(context, newAddress, existingContact) == null)
            {
                context.AddTospd_addresses(newAddress);
                // associate address to contact
                context.SetLink(newAddress, nameof(newAddress.spd_Contact), existingContact);
            }
        }
        //update current contact
        existingContact = UpdateExistingContact(existingContact, newContact);
        context.UpdateObject(existingContact);

        if (aliases.Any())
        {
            foreach (var alias in aliases)
            {
                if (AliasExists(context, alias, existingContact) == null)
                {
                    context.AddTospd_aliases(alias);
                    // associate alias to contact
                    context.SetLink(alias, nameof(alias.spd_ContactId), existingContact);
                }
            }
        }

        return existingContact;
    }

    private static spd_alias? AliasExists(DynamicsContext context, spd_alias newAlias, contact contact)
    {
        var matchingAlias = context.spd_aliases.Where(o =>
           o.spd_firstname == newAlias.spd_firstname &&
           o.spd_middlename1 == newAlias.spd_middlename1 &&
           o.spd_middlename2 == newAlias.spd_middlename2 &&
           o.spd_surname == newAlias.spd_surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contactid_value == contact.contactid &&
           o.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
       ).FirstOrDefault();
        return matchingAlias;
    }

    private static bool NameIsSame(contact existed, contact newOne)
    {
        return (string.Equals(existed.firstname, newOne.firstname, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existed.lastname, newOne.lastname, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existed.spd_middlename1, newOne.spd_middlename1, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existed.spd_middlename2, newOne.spd_middlename2, StringComparison.InvariantCultureIgnoreCase));
    }

    private static bool MailingAddressIsSame(contact existingContact, contact newContact)
    {
        return (string.Equals(existingContact.address1_line1, newContact.address1_line1, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address1_line2, newContact.address1_line2, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address1_city, newContact.address1_city, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address1_country, newContact.address1_country, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address1_postalcode, newContact.address1_postalcode, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address1_stateorprovince, newContact.address1_stateorprovince, StringComparison.InvariantCultureIgnoreCase));
    }

    private static bool ResidentialAddressIsSame(contact existingContact, contact newContact)
    {
        return (string.Equals(existingContact.address2_line1, newContact.address2_line1, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address2_line2, newContact.address2_line2, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address2_city, newContact.address2_city, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address2_country, newContact.address2_country, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address2_postalcode, newContact.address2_postalcode, StringComparison.InvariantCultureIgnoreCase)
            && string.Equals(existingContact.address2_stateorprovince, newContact.address2_stateorprovince, StringComparison.InvariantCultureIgnoreCase));
    }
    private static spd_address? AddressExists(DynamicsContext context, spd_address newAddr, contact contact)
    {
        var matchingAddr = context.spd_addresses.Where(o =>
           o.spd_address1 == newAddr.spd_address1 &&
           o.spd_address2 == newAddr.spd_address2 &&
           o.spd_city == newAddr.spd_city &&
           o.spd_country == newAddr.spd_country &&
           o.spd_provincestate == newAddr.spd_provincestate &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contact_value == contact.contactid &&
           o.spd_type == newAddr.spd_type
       ).FirstOrDefault();
        return matchingAddr;
    }

    private static spd_address CreateAddrFromContact(contact c, bool isMailing)
    {
        return new spd_address
        {
            spd_address1 = isMailing ? c.address1_line1 : c.address2_line1,
            spd_address2 = isMailing ? c.address1_line2 : c.address2_line2,
            spd_city = isMailing ? c.address1_city : c.address2_city,
            spd_country = isMailing ? c.address1_country : c.address2_country,
            spd_provincestate = isMailing ? c.address1_stateorprovince : c.address2_stateorprovince,
            spd_postalcode = isMailing ? c.address1_postalcode : c.address2_postalcode,
            spd_type = isMailing ? (int)AddressTypeOptionSet.Mailing : (int)AddressTypeOptionSet.Physical
        };
    }

    private static contact UpdateExistingContact(contact existingContact, contact newContact)
    {
        if (newContact.address1_country != null && newContact.address1_line1 != null && newContact.address1_city != null)
        {
            existingContact.address1_city = newContact.address1_city;
            existingContact.address1_country = newContact.address1_country;
            existingContact.address1_line1 = newContact.address1_line1;
            existingContact.address1_line2 = newContact.address1_line2;
            existingContact.address1_postalcode = newContact.address1_postalcode;
            existingContact.address1_stateorprovince = newContact.address1_stateorprovince;
        }

        if (newContact.address2_country != null && newContact.address2_line1 != null && newContact.address2_city != null)
        {
            existingContact.address2_city = newContact.address2_city;
            existingContact.address2_country = newContact.address2_country;
            existingContact.address2_line1 = newContact.address2_line1;
            existingContact.address2_line2 = newContact.address2_line2;
            existingContact.address2_postalcode = newContact.address2_postalcode;
            existingContact.address2_stateorprovince = newContact.address2_stateorprovince;
        }

        existingContact.firstname = newContact.firstname ?? string.Empty;
        existingContact.lastname = newContact.lastname ?? string.Empty;
        existingContact.spd_middlename1 = newContact.spd_middlename1 ?? string.Empty;
        existingContact.spd_middlename2 = newContact.spd_middlename2 ?? string.Empty;
        existingContact.spd_sex = newContact.spd_sex ?? existingContact.spd_sex;
        existingContact.birthdate = newContact.birthdate ?? existingContact.birthdate;
        existingContact.telephone1 = newContact.telephone1 ?? existingContact.telephone1;
        existingContact.spd_bcdriverslicense = newContact.spd_bcdriverslicense ?? existingContact.spd_bcdriverslicense;
        existingContact.emailaddress1 = newContact.emailaddress1 ?? existingContact.emailaddress1;
        existingContact.spd_mentalhealthcondition = newContact.spd_mentalhealthcondition ?? existingContact.spd_mentalhealthcondition;
        existingContact.spd_peaceofficer = newContact.spd_peaceofficer ?? existingContact.spd_peaceofficer;
        existingContact.spd_peaceofficerother = newContact.spd_peaceofficerother ?? existingContact.spd_peaceofficerother;
        existingContact.spd_peaceofficerstatus = newContact.spd_peaceofficer == 100000001 ? newContact.spd_peaceofficerstatus : existingContact.spd_peaceofficerstatus;
        existingContact.spd_selfdisclosure = newContact.spd_selfdisclosure ?? existingContact.spd_selfdisclosure;
        existingContact.spd_selfdisclosuredetails = newContact.spd_selfdisclosuredetails ?? existingContact.spd_selfdisclosuredetails;
        existingContact.spd_lastloggedinlicensingportal = newContact.spd_lastloggedinlicensingportal ?? existingContact.spd_lastloggedinlicensingportal;
        existingContact.spd_lastloggedinscreeningportal = newContact.spd_lastloggedinscreeningportal ?? existingContact.spd_lastloggedinscreeningportal;
        return existingContact;
    }
}
