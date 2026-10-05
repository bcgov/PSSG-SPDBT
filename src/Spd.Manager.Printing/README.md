# Spd.Manager.Printing

## Secrets Template

```JSON
  "BcMailPlus": {
    "ServerUrl": "",
    "User": "",
    "Secret": "",
    "LogPayload": false
  }
```

### LogPayload

The `LogPayload` secret can be set to `true` to log the entire raw BCMail payload right before it would normally be sent to the external BCMail service. This is useful for debugging the payload, and testing the code that creates it.

- This should not be enabled in production to avoid logging sensitive information.
- This should not be left enabled in dev or test either, as the payload can be very large.
