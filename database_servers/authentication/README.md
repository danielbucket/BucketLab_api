## Without realizing what I was doing, I'm implementing Network Access Control (NAC) in the authentication server that mimics a EAP (Extensible Authentication Protocol).

### EAPs typically involve three components:
## 1: Supplicant --> The device/user seeking to access the network/app.
## 2: Authenticator --> Network device (Profiles Server) the user wants to connect to.
## 3: Authentication Server --> Server on the network (Authentication Server) that will authenitcate the users device (grant an authenticated token to the user). The token could be considered a "Non-persistent Agent"

## Specically-tailored NACs can use access controls like Time, Location, Role, or Rule-based requirements. The Authentication Server uses the Role-based (seen in auth.model.js as "Permissions") access control. This enforces the principal of least priveledge.