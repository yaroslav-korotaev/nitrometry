import { type AsyncFunction, type SpanCallback, type Tracing } from 'turbotrace';

export type TelemetryParams = {
  tracing: Tracing;
};

export type Telemetry = {
  (msg?: string): void;
  (details?: object, msg?: string): void;
  
  tracing: Tracing;
  
  child(name: string): Telemetry;
  
  span<T>(name: string, callback: SpanCallback<T>): Promise<T>;
  wrap<T, A extends any[], R>(name: string, fn: AsyncFunction<T, A, R>): AsyncFunction<T, A, R>;
  trace(msg?: string): void;
  trace(details?: object, msg?: string): void;
};

export function createTelemetry(params: TelemetryParams): Telemetry {
  const {
    tracing,
  } = params;
  
  const _self: Telemetry = tracing.trace.bind(tracing) as Telemetry;
  
  _self.tracing = tracing;
  
  _self.child = name => {
    return createTelemetry({
      tracing: tracing.child(name),
    });
  };
  
  _self.span = tracing.span.bind(tracing);
  _self.wrap = tracing.wrap.bind(tracing);
  _self.trace = tracing.trace.bind(tracing);
  
  return _self;
}
