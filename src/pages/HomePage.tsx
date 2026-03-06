--- a/src/pages/HomePage.tsx
+++ b/src/pages/HomePage.tsx
@@ -91,7 +91,7 @@ export function HomePage() {
       const interval = setInterval(() => fetchDashboardData(true), 60000);
       return () => clearInterval(interval);
     }
-  }, [jobsService]);
+  }, [jobsService, fetchDashboardData]);
   const getStatusBadge = (state: string) => {
     const variants: Record<string, { className: string }> = {