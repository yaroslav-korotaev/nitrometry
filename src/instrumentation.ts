import {
  type Backend as TracingBackend,
  createTracing,
} from 'turbotrace';
import {
  type Telemetry,
  createTelemetry,
} from './telemetry';

export type InstrumentationParams = {
  tracingBackend: TracingBackend;
};

export class Instrumentation {
  public root: Telemetry;
  
  constructor(params: InstrumentationParams) {
    const {
      tracingBackend,
    } = params;
    
    this.root = createTelemetry({
      tracing: createTracing(tracingBackend),
    });
  }
  
  public telemetry(name: string): Telemetry {
    return this.root.child(name);
  }
}

export function createInstrumentation(params: InstrumentationParams): Instrumentation {
  return new Instrumentation(params);
}
