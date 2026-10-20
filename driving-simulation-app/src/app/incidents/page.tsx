import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incident History</h1>
        <p className="text-muted-foreground">Review recorded safety events, metadata, and video clips.</p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Incident List Placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A table or list of incidents will be displayed here in Phase 9. 
            It will fetch data from the local IndexedDB via Dexie.js.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}