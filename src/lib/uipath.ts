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
            throw new Error('VITE_UIPATH_CLIENT_ID is required for OAuth authentication. Please check your .env file.');
        }
        if (!import.meta.env.VITE_UIPATH_ORG_NAME) {
            console.error('UiPath SDK: VITE_UIPATH_ORG_NAME is missing');
            throw new Error('VITE_UIPATH_ORG_NAME is required. Please check your .env file.');
        }
        if (!import.meta.env.VITE_UIPATH_TENANT_NAME) {
            console.error('UiPath SDK: VITE_UIPATH_TENANT_NAME is missing');
            throw new Error('VITE_UIPATH_TENANT_NAME is required. Please check your .env file.');
        }
        const config = {
            baseUrl: import.meta.env.VITE_UIPATH_BASE_URL || 'https://cloud.uipath.com',
            orgName: import.meta.env.VITE_UIPATH_ORG_NAME,
            tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME,
            clientId: import.meta.env.VITE_UIPATH_CLIENT_ID,
            redirectUri: getOAuthRedirectUri(),
            scope: import.meta.env.VITE_UIPATH_SCOPE || 'OR.Execution OR.Folders OR.Jobs OR.Queues OR.Assets OR.Robots'
        };
        try {
            console.log('UiPath SDK: Initializing with config:', {
                baseUrl: config.baseUrl,
                orgName: config.orgName,
                tenantName: config.tenantName,
                redirectUri: config.redirectUri
            });
            sdk = new UiPath(config);      
            await sdk.initialize();
            console.log('UiPath SDK: Successfully initialized');
        } catch (error) {
            console.error('UiPath SDK: Initialization failed:', error);
            sdk = null;
            if (error instanceof Error) {
                throw new Error(`Failed to initialize UiPath SDK: ${error.message}`);
            }
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