import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Allow this route to block on runtime parameters under Next.js 16 Cache Components
export const instant = false;

export default async function IncidentDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params Promise (Next.js 15+ requirement)
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incident Detail</h1>
        <p className="text-muted-foreground">Reviewing Incident ID: {id}</p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Video Playback & Sensor Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pre-event and post-event video segments, along with sensor telemetry and driver state metadata, 
            will be rendered here in Phase 9.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}