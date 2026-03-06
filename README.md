# UiPath Orchestrator Dashboard
Professional enterprise dashboard for UiPath Orchestrator with clean table-based layouts, OAuth authentication, and comprehensive resource management capabilities.
[cloudflarebutton]
## Overview
A professional enterprise dashboard application that provides a clean, information-dense interface for viewing and managing UiPath Orchestrator resources. The application features a modern, corporate-appropriate design with neutral color schemes, table-based data displays, and efficient navigation patterns. Built with React, TypeScript, and the UiPath SDK, it offers real-time visibility into Orchestrator entities including processes, queues, assets, jobs, and robots.
## Key Features
- **OAuth Authentication** - Secure authentication flow with UiPath Cloud accounts
- **Dashboard Overview** - Real-time metrics and activity feed with auto-refresh
- **Process Management** - View and start automation processes with folder scoping
- **Job Monitoring** - Comprehensive job tracking with status indicators and auto-refresh
- **Queue Management** - Monitor queue backlogs and add new queue items
- **Asset Management** - View and manage configuration assets with credential masking
- **Robot Status** - Track robot availability and online/offline status
- **Professional UI** - Clean, table-based layouts with enterprise-grade design
- **Responsive Design** - Optimized for desktop and mobile devices
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Auto-Refresh** - Real-time data updates for jobs and dashboard metrics
## Technology Stack
### Frontend
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **React Router 6** - Client-side routing
- **Zustand** - Lightweight state management
- **date-fns** - Date formatting and manipulation
- **Lucide React** - Beautiful icon library
### Backend
- **Cloudflare Workers** - Serverless edge computing platform
- **Hono** - Fast, lightweight web framework
- **Durable Objects** - Stateful serverless storage
### UiPath Integration
- **@uipath/uipath-typescript** - Official UiPath SDK for Orchestrator API integration
## Prerequisites
- [Bun](https://bun.sh/) runtime installed
- UiPath Cloud account with Orchestrator access
- UiPath OAuth application credentials (Client ID)
## Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd uipath-orchestrator-dashboard
```
2. Install dependencies:
```bash
bun install
```
3. Configure environment variables:
Create a `.env` file in the root directory with your UiPath credentials:
```env
VITE_UIPATH_BASE_URL=https://cloud.uipath.com
VITE_UIPATH_ORG_NAME=your_org_name
VITE_UIPATH_TENANT_NAME=your_tenant_name
VITE_UIPATH_CLIENT_ID=your_client_id
VITE_UIPATH_SCOPE=OR.Execution OR.Folders OR.Jobs OR.Queues OR.Assets OR.Robots
```
**Note:** The redirect URI is automatically detected from your current URL. For local development, it will use `http://localhost:3000`.
## Development
Start the development server:
```bash
bun run dev
```
The application will be available at `http://localhost:3000`.
### Development Commands
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint for code quality checks
## Project Structure
```
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── layout/      # Layout components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and SDK setup
│   └── main.tsx         # Application entry point
├── worker/              # Cloudflare Worker backend
│   ├── index.ts         # Worker entry point
│   ├── userRoutes.ts    # API routes
│   └── durableObject.ts # Durable Object implementation
├── shared/              # Shared types and utilities
└── wrangler.jsonc       # Cloudflare configuration
```
## Usage
### Authentication
1. Navigate to the application URL
2. The SDK will automatically initiate OAuth flow if not authenticated
3. Authenticate with your UiPath Cloud credentials
4. Grant the requested permissions
5. You'll be redirected back to the dashboard
### Dashboard Navigation
- **Home** - Overview metrics and recent activity with auto-refresh
- **Processes** - Browse and start automation processes
- **Jobs** - Monitor job executions with real-time updates
- **Queues** - Manage queue items and monitor processing
- **Assets** - View and manage configuration assets
- **Robots** - Check robot status and availability
### Folder Scoping
Most resources in Orchestrator are folder-scoped. Use the folder selector dropdown to switch between different folders and view their respective resources.
### Auto-Refresh
- Dashboard metrics refresh every 60 seconds
- Jobs page refreshes every 30 seconds
- Manual refresh available via the Refresh button on each page
## Deployment
### Deploy to Cloudflare Workers
[cloudflarebutton]
#### Manual Deployment
1. Install Wrangler CLI (if not already installed):
```bash
bun add -g wrangler
```
2. Authenticate with Cloudflare:
```bash
wrangler login
```
3. Build and deploy:
```bash
bun run deploy
```
4. Configure environment variables in Cloudflare Dashboard:
   - Navigate to Workers & Pages > Your Worker > Settings > Variables
   - Add the same environment variables from your `.env` file
#### Environment Variables for Production
Ensure the following variables are set in your Cloudflare Worker settings:
- `VITE_UIPATH_BASE_URL`
- `VITE_UIPATH_ORG_NAME`
- `VITE_UIPATH_TENANT_NAME`
- `VITE_UIPATH_CLIENT_ID`
- `VITE_UIPATH_SCOPE`
**Important:** Update `VITE_UIPATH_REDIRECT_URI` to match your production domain (e.g., `https://your-app.workers.dev`).
## Configuration
### UiPath OAuth Setup
1. Log in to UiPath Cloud Platform
2. Navigate to Admin > External Applications
3. Create a new application with the following settings:
   - **Application Type:** Confidential Client
   - **Redirect URIs:** Add your application URLs (local and production)
   - **Scopes:** Select required scopes (OR.Execution, OR.Jobs, etc.)
4. Copy the Client ID and add it to your `.env` file
### Customizing the UI
The application uses Tailwind CSS with a professional neutral color palette. To customize:
1. Edit `src/index.css` for theme colors
2. Modify `tailwind.config.js` for custom design tokens
3. Update component styles in `src/components/`
## API Integration
The application uses the official UiPath TypeScript SDK for all Orchestrator interactions. The SDK handles:
- OAuth authentication and token management
- API request/response handling
- Type-safe interfaces for all Orchestrator entities
- Automatic pagination and error handling
### Adding Custom Features
To add new Orchestrator integrations:
1. Import the required service from the SDK:
```typescript
import { ProcessesService } from '@uipath/uipath-typescript/services/processes';
```
2. Create a service instance with the SDK:
```typescript
const sdk = getUiPath();
const processesService = new ProcessesService(sdk);
```
3. Call service methods with proper error handling:
```typescript
try {
  const processes = await processesService.getProcesses({ folderId });
  // Handle response
} catch (error) {
  // Handle error
}
```
## Best Practices
### State Management
- Use Zustand for global state with minimal, focused stores
- Select only required primitives to avoid unnecessary re-renders
- Keep component state local when possible
### Error Handling
- Wrap SDK calls in try-catch blocks
- Display user-friendly error messages via toast notifications
- Implement loading states for all async operations
- Provide retry mechanisms for failed operations
### Performance
- Use React.memo for expensive components
- Implement proper pagination for large datasets
- Leverage the SDK's built-in caching mechanisms
- Use auto-refresh intervals appropriately (30-60 seconds)
## Troubleshooting
### OAuth Authentication Issues
**Problem:** "Authentication Required" error on startup
**Solutions:**
- Verify Client ID is correct in `.env`
- Ensure redirect URI matches exactly (including protocol and port)
- Check that required scopes are granted in UiPath Cloud
- Clear browser cache and cookies
- Check browser console for detailed error messages
### SDK Initialization Errors
**Problem:** "SDK not initialized" errors
**Solutions:**
- Confirm all environment variables are set correctly
- Check browser console for detailed error messages
- Verify network connectivity to UiPath Cloud
- Ensure your UiPath account has proper permissions
### Data Loading Issues
**Problem:** "Failed to load" errors on resource pages
**Solutions:**
- Check if you have access to the selected folder
- Verify your account has permissions for the resource type
- Try refreshing the page or using the Refresh button
- Check browser console for API error details
### Build/Deployment Issues
**Problem:** Build fails or deployment errors
**Solutions:**
- Clear build cache: `rm -rf dist node_modules/.vite`
- Reinstall dependencies: `bun install`
- Check Wrangler configuration in `wrangler.jsonc`
- Verify all environment variables are set in Cloudflare Dashboard
### Performance Issues
**Problem:** Slow page loads or laggy UI
**Solutions:**
- Check network tab for slow API calls
- Reduce auto-refresh intervals if needed
- Implement pagination for large datasets
- Use browser performance profiler to identify bottlenecks
## Contributing
Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
## License
This project is licensed under the MIT License.
## Support
For issues and questions:
- Check the [UiPath SDK Documentation](https://docs.uipath.com/)
- Review [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- Open an issue in this repository
## Acknowledgments
- Built with [UiPath TypeScript SDK](https://www.npmjs.com/package/@uipath/uipath-typescript)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)