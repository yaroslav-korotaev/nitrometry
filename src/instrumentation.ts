import {
  type Backend as TracingBackend,
  type Tracing,
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
  public tracing: Tracing;
  
  constructor(params: InstrumentationParams) {
    const {
      tracingBackend,
    } = params;
    
    this.tracing = createTracing(tracingBackend);
  }
  
  public telemetry(name: string): Telemetry {
    return createTelemetry({
      tracing: this.tracing.child(name),
    });
  }
}

export function createInstrumentation(params: InstrumentationParams): Instrumentation {
  return new Instrumentation(params);
}
