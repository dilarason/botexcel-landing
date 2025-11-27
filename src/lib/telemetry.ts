export type TelemetryEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export async function trackTelemetry(event: TelemetryEvent): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log("[telemetry]", event);
  }
}
