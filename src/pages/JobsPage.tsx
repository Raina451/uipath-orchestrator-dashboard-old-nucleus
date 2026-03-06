--- a/src/pages/JobsPage.tsx
+++ b/src/pages/JobsPage.tsx
@@ -75,7 +75,7 @@ export function JobsPage() {
       const interval = setInterval(() => fetchJobs(true), 30000);
       return () => clearInterval(interval);
     }
-  }, [jobsService, statusFilter]);
+  }, [jobsService, statusFilter, fetchJobs]);
   const filteredJobs = useMemo(() => {
     if (!searchQuery) return jobs;