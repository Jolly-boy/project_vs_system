import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure thresholds, recording durations, and privacy controls.</p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Configuration Placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Controls for speed limits (default 20 km/h), rolling buffer duration (120s), 
            and local data management will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}