/**
 * UiPath SDK Client Configuration with OAuth Authentication
 */

import { UiPath } from '@uipath/uipath-typescript/core';
import { getOAuthRedirectUri } from './router-utils';

let sdk: UiPath | null = null;

export async function initializeUiPathSDK(): Promise<UiPath> {
    if (!sdk) {

        if (!import.meta.env.VITE_UIPATH_CLIENT_ID) {
            console.error('UiPath SDK: VITE_UIPATH_CLIENT_ID is missing');
            throw new Error('VITE_UIPATH_CLIENT_ID is required for OAuth authentication');
        }

        
        const config = {
            baseUrl: import.meta.env.VITE_UIPATH_BASE_URL,
            orgName: import.meta.env.VITE_UIPATH_ORG_NAME,
            tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME,
            clientId: import.meta.env.VITE_UIPATH_CLIENT_ID,
            redirectUri: getOAuthRedirectUri(),
            scope: import.meta.env.VITE_UIPATH_SCOPE || 'OR.Execution'
        };
        
        try {
            sdk = new UiPath(config);      
            await sdk.initialize();
        } catch (error) {
            throw error;
        }
    } else {
        console.log('UiPath SDK: Using existing instance');
    }
    
    return sdk;
}

export function getUiPath(): UiPath {
    if (!sdk) {
        console.error('UiPath SDK: Instance not found - SDK not initialized');
        throw new Error('UiPath SDK not initialized. Call initializeUiPathSDK() first.');
    }
    return sdk;
}

export type { UiPath } from '@uipath/uipath-typescript/core';
