import { MsalGuardConfiguration, MsalInterceptorConfiguration } from "@azure/msal-angular";
import { InteractionType, IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";
import { environment } from "src/environments/environment";

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
      auth: {
        clientId: environment.azure.clientId, // Application (client) ID from the app registration
        authority: environment.azure.tenantId, // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: environment.azure.redirectUri, // This is your redirect URI
        postLogoutRedirectUri: environment.azure.redirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    });
  }
  
  export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    // protectedResourceMap.set(environment.pythonApi, ['user.read']); // This protects the api as well.
    protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read.all']);
    protectedResourceMap.set('https://graph.microsoft.com/v1.0/me/photo', ['profile']);
  
    return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap
    };
  }
  
  export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return { 
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: [
          'user.read.all',
          'profile',
        ]
      },
      loginFailedRoute: '/'
    };
  }
  