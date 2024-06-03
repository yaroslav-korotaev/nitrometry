import {
  type Log,
  type Metrics,
  type Tracing,
  type Telemetry,
} from 'universe-types';

export type TelemetryParams = {
  log: Log;
  metrics: Metrics;
  tracing: Tracing;
};

export function createTelemetry(params: TelemetryParams): Telemetry {
  const {
    log,
    metrics,
    tracing,
  } = params;
  
  const _self: Telemetry = () => {};
  
  _self.log = log;
  _self.metrics = metrics;
  _self.tracing = tracing;
  
  _self.destroy = metrics.destroy.bind(metrics);
  _self.child = (tag, options) => {
    const {
      labels,
      details,
    } = options ?? {};
    
    const taggedLabels = { tag: `${tracing.tag}.${tag}`, ...labels };
    
    return createTelemetry({
      log: log.child({ labels: taggedLabels, details }),
      metrics: metrics.child(taggedLabels),
      tracing: tracing.child(tag),
    });
  };
  
  _self.debug = log.debug.bind(log);
  _self.info = log.info.bind(log);
  _self.warn = log.warn.bind(log);
  _self.error = log.error.bind(log);
  
  _self.counter = metrics.counter.bind(metrics);
  _self.gauge = metrics.gauge.bind(metrics);
  _self.histogram = metrics.histogram.bind(metrics);
  _self.summary = metrics.summary.bind(metrics);
  
  _self.span = tracing.span.bind(tracing);
  _self.wrap = tracing.wrap.bind(tracing);
  
  _self.trace = tracing.trace.bind(tracing);
  
  return _self;
}
